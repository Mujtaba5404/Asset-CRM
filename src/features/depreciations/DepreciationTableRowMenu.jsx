import { ActionIcon, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useDeleteDepreciationMutation } from "../../api/depreciation";
import CanAccess from "../../components/CanAccess";
import DeleteItemButton from "../../components/DeleteItemButton";
import DepreciationFormDrawer from "./DepreciationFormDrawer";

const DepreciationTableRowMenu = ({ depreciation }) => {
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);

  return (
    <>
      <DepreciationFormDrawer depreciation={depreciation} isOpen={editOpened} onClose={closeEdit} />

      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon aria-label="Depreciation actions" onClick={(event) => event.stopPropagation()}>
            <IconDots size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <CanAccess resource="depreciation" action="read">
            <Menu.Item component={Link} to={`/depreciations/${depreciation._id}`} leftSection={<IconEye size={16} />}>
              View
            </Menu.Item>
          </CanAccess>

          <CanAccess resource="depreciation" action="update">
            <Menu.Item leftSection={<IconPencil size={16} />} onClick={openEdit}>
              Edit
            </Menu.Item>
          </CanAccess>

          <CanAccess resource="depreciation" action="delete">
            <Menu.Divider />

            <DeleteItemButton resource="depreciation" label="depreciation" mutationHook={useDeleteDepreciationMutation} itemId={depreciation._id}>
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

export default DepreciationTableRowMenu;
