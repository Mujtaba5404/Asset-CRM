import { Badge, Group, Switch, Tooltip } from "@mantine/core";
import { IconUserExclamation } from "@tabler/icons-react";
import { usePicklists } from "../../../context/PicklistContext";
import Picklists from "../../../features/picklists/Picklists";
import PicklistsSelect from "../components/PicklistsSelect";

const AdditionalFields = () => {
  const { form, resource } = usePicklists();

  return (
    <>
      <PicklistsSelect queryObject={{ resource, field: "category" }} selectProps={{ required: true, label: "asset category", ...form.getInputProps("parentPicklist") }} />
      <Switch label="Requires Employee" description="If enabled, employee is mandatory when creating an asset" tt={"initial"} {...form.getInputProps("meta.requiresEmployee", { type: "checkbox" })} />
    </>
  );
};

const AssetSubCategories = () => {
  return (
    <Picklists featureName="asset sub category" resource="Asset" field="subCategory">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false, acronym: true }}>
        <AdditionalFields />
      </Picklists.Modal>

      <Picklists.List>
        {(picklist) => (
          <Group gap={"xs"} mr={"auto"}>
            <Badge color={picklist.color}>{picklist.title}</Badge>

            {picklist.meta.requiresEmployee && (
              <Tooltip label="Employee is mandatory for assets in this sub-category">
                <IconUserExclamation size={18} />
              </Tooltip>
            )}
          </Group>
        )}
      </Picklists.List>
    </Picklists>
  );
};

export default AssetSubCategories;
