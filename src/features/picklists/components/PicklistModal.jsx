import { Button, ColorSwatch, Group, Modal, Select, Stack, Switch, Text, TextInput, useMantineTheme } from "@mantine/core";
import { useCreatePicklistMutation, useUpdatePicklistMutation } from "../../../api/picklist";
import COLORS from "../../../constants/COLORS";
import capitalizeLetters from "../../../utils/capitalizeLetters";
import { usePicklists } from "../../../context/PicklistContext";

const DEFAULT_FIELDS_CONFIG = {
  acronym: false,
  color: true,
  preserveTitleFormatting: true,
  isDefault: true,
  isActive: true,
};

const COLOR_OPTIONS = Object.values(COLORS).map((color) => ({ value: color, label: capitalizeLetters(color) }));

const PicklistModal = ({ children, fieldsConfig = {} }) => {
  const { featureName, scope, resource, field, form, isOpened, closeModal, existingPicklist } = usePicklists();
  const theme = useMantineTheme();

  const config = { ...DEFAULT_FIELDS_CONFIG, ...fieldsConfig };
  const isEdit = Boolean(existingPicklist?._id);

  const createMutation = useCreatePicklistMutation();
  const updateMutation = useUpdatePicklistMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  const selectedColor = form.values.color;

  const handleSubmit = (values) => {
    const payload = { ...values, scope, resource, field };

    mutation.mutate(isEdit ? { picklistId: existingPicklist._id, payload } : payload, {
      onSuccess: () => {
        form.reset();
        closeModal();
      },
    });
  };

  return (
    <Modal opened={isOpened} onClose={closeModal} title={`${isEdit ? "Edit" : "New"} ${featureName}`}>
      <Stack component="form" gap="md" onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <TextInput required label="Title" placeholder={`e.g. ${capitalizeLetters(featureName)}`} data-autofocus {...form.getInputProps("title")} />

        {config.color && (
          <Select
            clearable
            allowDeselect
            searchable={false}
            label="Colour"
            placeholder="No colour"
            description="Used for the badge wherever this value appears"
            data={COLOR_OPTIONS}
            leftSection={selectedColor ? <ColorSwatch size={16} color={theme.colors[selectedColor]?.[6] ?? selectedColor} withShadow={false} /> : undefined}
            renderOption={({ option }) => (
              <Group gap="xs" wrap="nowrap">
                <ColorSwatch size={16} color={theme.colors[option.value]?.[6] ?? option.value} withShadow={false} />
                <Text fz="sm">{option.label}</Text>
              </Group>
            )}
            {...form.getInputProps("color")}
          />
        )}

        {config.acronym && (
          <TextInput
            required
            label="Acronym"
            description="Used wherever a short code is needed, e.g. in generated asset tags"
            placeholder="EQ for Equipment"
            {...form.getInputProps("acronym")}
          />
        )}

        {children}

        <Stack gap="sm">
          {config.preserveTitleFormatting && (
            <Switch label="Preserve title formatting" description="Keeps the original casing and spacing" {...form.getInputProps("preserveTitleFormatting", { type: "checkbox" })} />
          )}

          {config.isDefault && (
            <Switch label={`Default ${featureName}`} description="Replaces the current default and is pre-selected on new records" {...form.getInputProps("isDefault", { type: "checkbox" })} />
          )}

          {config.isActive && <Switch label="Active" description="Inactive values stay on existing records but can't be picked again" {...form.getInputProps("isActive", { type: "checkbox" })} />}
        </Stack>

        <Group gap="sm" justify="flex-end" mt="xs">
          <Button variant="default" onClick={closeModal} disabled={mutation.isPending} flex={{ base: 1, sm: "0 0 auto" }}>
            Cancel
          </Button>

          <Button type="submit" loading={mutation.isPending} flex={{ base: 1, sm: "0 0 auto" }}>
            {isEdit ? "Save changes" : "Create"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default PicklistModal;
