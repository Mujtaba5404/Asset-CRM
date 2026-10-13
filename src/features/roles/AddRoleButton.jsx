import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import RoleFormDrawer from "./RoleFormDrawer";

const AddRoleButton = ({ label = "New role", ...props }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <CanAccess resource="role" action="create">
      <RoleFormDrawer isOpen={opened} onClose={close} />

      <Button onClick={open} leftSection={<IconPlus size={16} />} {...props}>
        {label}
      </Button>
    </CanAccess>
  );
};

export default AddRoleButton;
