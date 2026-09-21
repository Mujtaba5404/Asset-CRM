import { ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import EditAssetModal from "./EditAssetModal";

const EditAssetModalButton = ({ asset }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    // <CanAccess resource="asset" action="update">
    <>
      <EditAssetModal asset={asset} isOpen={opened} onClose={close} />

      <ActionIcon onClick={open}>
        <IconPencil size={18} />
      </ActionIcon>
    {/* </CanAccess> */}
    </>
  );
};

export default EditAssetModalButton;