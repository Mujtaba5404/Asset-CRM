import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import AccessFormDrawer from "./AccessFormDrawer";

const AddAccessButton = ({ label = "Give access", ...props }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <CanAccess resource="access" action="create">
      <AccessFormDrawer isOpen={opened} onClose={close} />

      <Button onClick={open} leftSection={<IconPlus size={16} />} {...props}>
        {label}
      </Button>
    </CanAccess>
  );
};

export default AddAccessButton;
