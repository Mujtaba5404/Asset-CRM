import { ActionIcon, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useDeleteAssetMutation } from "../../api/asset";
import CanAccess from "../../components/CanAccess";
import DeleteItemButton from "../../components/DeleteItemButton";
import EditAssetModal from "./EditAssetModal";

const AssetTableRowMenu = ({ asset }) => {
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);

  return (
    <>
      <EditAssetModal asset={asset} isOpen={editOpened} onClose={closeEdit} />

      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon aria-label="Asset actions" onClick={(event) => event.stopPropagation()}>
            <IconDots size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <CanAccess resource="asset" action="read">
            <Menu.Item component={Link} to={`/assets/${asset._id}`} leftSection={<IconEye size={16} />}>
              View
            </Menu.Item>
          </CanAccess>

          <CanAccess resource="asset" action="update">
            <Menu.Item leftSection={<IconPencil size={16} />} onClick={openEdit}>
              Edit
            </Menu.Item>
          </CanAccess>

          <CanAccess resource="asset" action="delete">
            <Menu.Divider />

            <DeleteItemButton resource="asset" label="asset" mutationHook={useDeleteAssetMutation} itemId={asset._id}>
              <Menu.Item color="red" leftSection={<IconTrash size={16} />} onClick={(event) => event.stopPropagation()}>
                Delete
              </Menu.Item>
            </DeleteItemButton>
          </CanAccess>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default AssetTableRowMenu;
