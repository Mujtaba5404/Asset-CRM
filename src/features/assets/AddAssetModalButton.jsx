import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import AddAssetModal from "./AddAssetModal";

const AddAssetModalButton = ({ label = "Add asset", ...props }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <CanAccess resource="asset" action="create">
      <AddAssetModal isOpen={opened} onClose={close} />

      <Button onClick={open} leftSection={<IconPlus size={16} />} {...props}>
        {label}
      </Button>
    </CanAccess>
  );
};

export default AddAssetModalButton;
