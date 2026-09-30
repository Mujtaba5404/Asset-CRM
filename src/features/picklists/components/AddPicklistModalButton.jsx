import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import CanAccess from "../../../components/CanAccess";
import PICKLIST_SCOPE from "../../../constants/PICKLIST_SCOPE";
import { usePicklists } from "../../../context/PicklistContext";

const AddPicklistModalButton = () => {
  const { featureName, scope, resource, openCreateModal } = usePicklists();

  return (
    <CanAccess resource={scope === PICKLIST_SCOPE.RESOURCE ? resource : "picklist"} action="create">
      <Button leftSection={<IconPlus size={16} />} tt="capitalize" onClick={openCreateModal}>
        Add {featureName}
      </Button>
    </CanAccess>
  );
};

export default AddPicklistModalButton;
