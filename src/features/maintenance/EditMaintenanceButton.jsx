import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import MaintenanceFormDrawer from "./MaintenanceFormDrawer";

const EditMaintenanceButton = ({ maintenance, label = "Edit", ...props }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <CanAccess resource="maintenance" action="update">
      <MaintenanceFormDrawer maintenance={maintenance} isOpen={opened} onClose={close} />

      <Button variant="default" onClick={open} leftSection={<IconPencil size={16} />} {...props}>
        {label}
      </Button>
    </CanAccess>
  );
};

export default EditMaintenanceButton;
