import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import MaintenanceFormDrawer from "./MaintenanceFormDrawer";

const AddMaintenanceButton = ({ label = "Add maintenance", ...props }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <CanAccess resource="maintenance" action="create">
      <MaintenanceFormDrawer isOpen={opened} onClose={close} />

      <Button onClick={open} leftSection={<IconPlus size={16} />} {...props}>
        {label}
      </Button>
    </CanAccess>
  );
};

export default AddMaintenanceButton;
