import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import EditAssetModal from "./EditAssetModal";

const EditAssetModalButton = ({ asset, label = "Edit", ...props }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <CanAccess resource="asset" action="update">
      <EditAssetModal asset={asset} isOpen={opened} onClose={close} />

      <Button variant="default" onClick={open} leftSection={<IconPencil size={16} />} {...props}>
        {label}
      </Button>
    </CanAccess>
  );
};

export default EditAssetModalButton;
