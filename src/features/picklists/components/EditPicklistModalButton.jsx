import { ActionIcon, Tooltip } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import CanAccess from "../../../components/CanAccess";
import PICKLIST_SCOPE from "../../../constants/PICKLIST_SCOPE";
import { usePicklists } from "../../../context/PicklistContext";

const EditPicklistModalButton = ({ picklist }) => {
  const { scope, resource, featureName, openEditModal } = usePicklists();

  return (
    <CanAccess resource={scope === PICKLIST_SCOPE.RESOURCE ? resource : "picklist"} action="update">
      <Tooltip label={`Edit ${featureName}`} withArrow>
        <ActionIcon aria-label={`Edit ${picklist.title}`} onClick={() => openEditModal(picklist)}>
          <IconPencil size={17} />
        </ActionIcon>
      </Tooltip>
    </CanAccess>
  );
};

export default EditPicklistModalButton;
