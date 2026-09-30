import { Badge, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Children, useState } from "react";
import { useGetAllPicklistsQuery } from "../../api/picklist";
import PICKLIST_SCOPE from "../../constants/PICKLIST_SCOPE";
import PicklistContext from "../../context/PicklistContext";
import AddPicklistModalButton from "./components/AddPicklistModalButton";
import PicklistModal from "./components/PicklistModal";
import PicklistsList from "./components/PicklistsList";

const INITIAL_VALUES = {
  title: "",
  acronym: "",
  preserveTitleFormatting: false,
  color: "",
  isDefault: false,
  isActive: true,
  parentPicklist: undefined,
  meta: {},
};

/**
 * Picklists Compound Component
 *
 * Renders a titled screen for one configurable list. The add button and modal
 * are lifted out of the child flow into the header, so the ~50 feature files can
 * keep their existing `<Picklists.AddButton /> <Picklists.Modal /> <Picklists.List />`
 * shape and still get a consistent layout.
 *
 * @param {string} featureName - Friendly name for the picklist feature
 * @param {string} scope - Scope for the picklist
 * @param {string} resource - API resource name
 * @param {string} field - API field name
 * @param {React.ReactNode} children - Compound components (Modal, List, AddButton, etc.)
 */
const Picklists = ({ featureName = "", scope = PICKLIST_SCOPE.RESOURCE, resource = "", field = "", children }) => {
  const [existingPicklist, setExistingPicklist] = useState(null);
  const [isOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  const form = useForm({
    initialValues: INITIAL_VALUES,
    validate: { title: (value) => (String(value ?? "").trim() ? null : "Title is required") },
  });

  // Same query key as the list below — React Query serves both from one request.
  const { data, isLoading } = useGetAllPicklistsQuery({ query: { scope, resource, field } });
  console.log(data)

  const openCreateModal = () => {
    setExistingPicklist(null);
    form.reset();
    openModal();
  };

  const openEditModal = (picklist) => {
    setExistingPicklist(picklist);

    form.setValues({
      title: picklist.title,
      acronym: picklist.acronym || "",
      preserveTitleFormatting: !!picklist.preserveTitleFormatting,
      color: picklist.color,
      isDefault: !!picklist.isDefault,
      isActive: !!picklist.isActive,
      parentPicklist: picklist?.parentPicklist?._id,
      meta: picklist.meta ?? {},
    });

    openModal();
  };

  const items = Children.toArray(children);
  const addButton = items.find((item) => item.type === AddPicklistModalButton);
  const modal = items.find((item) => item.type === PicklistModal);
  const body = items.filter((item) => item !== addButton && item !== modal);

  const usage = scope === PICKLIST_SCOPE.GLOBAL ? "Shared across every module" : `Used by ${resource}.${field}`;
  const count = Array.isArray(data) ? data.length : 0;

  return (
    <PicklistContext.Provider
      value={{
        featureName,
        scope,
        resource,
        field,
        form,
        isOpened,
        closeModal,
        openCreateModal,
        openEditModal,
        existingPicklist,
      }}
    >
      <Stack gap="md">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
          <div>
            <Group gap="xs" align="center">
              <Title order={2} fz="h3" tt="capitalize">
                {featureName}
              </Title>

              {isLoading ? <Loader size={14} /> : <Badge variant="default">{count}</Badge>}
            </Group>

            <Text fz="xs" c="dimmed" mt={4}>
              {usage}
            </Text>
          </div>

          {addButton}
        </Group>

        {modal}

        {body}
      </Stack>
    </PicklistContext.Provider>
  );
};

Picklists.List = PicklistsList;
Picklists.Modal = PicklistModal;
Picklists.AddButton = AddPicklistModalButton;

export default Picklists;
