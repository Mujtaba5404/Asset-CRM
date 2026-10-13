import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCircleCheck } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import { isCompleted } from "./maintenanceForm";
import MaintenanceFormDrawer from "./MaintenanceFormDrawer";

/** Opens the edit form pre-set to Completed, ready for the after photos. */
const CompleteMaintenanceButton = ({ maintenance }) => {
  const [opened, { open, close }] = useDisclosure(false);

  if (isCompleted(maintenance?.status)) return null;

  return (
    <CanAccess resource="maintenance" action="update">
      <MaintenanceFormDrawer maintenance={maintenance} isOpen={opened} onClose={close} completing />

      <Button color="teal" onClick={open} leftSection={<IconCircleCheck size={16} />}>
        Mark completed
      </Button>
    </CanAccess>
  );
};

export default CompleteMaintenanceButton;
