import { ActionIcon, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCircleCheck, IconDots, IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteMaintenanceMutation } from "../../api/maintenance";
import CanAccess from "../../components/CanAccess";
import DeleteItemButton from "../../components/DeleteItemButton";
import { isCompleted } from "./maintenanceForm";
import MaintenanceFormDrawer from "./MaintenanceFormDrawer";

const MaintenanceTableRowMenu = ({ maintenance }) => {
  const [editOpened, { open, close }] = useDisclosure(false);
  // Edit and "mark completed" share one drawer; this picks how it opens.
  const [completing, setCompleting] = useState(false);

  const openEdit = (asCompleting) => {
    setCompleting(asCompleting);
    open();
  };

  return (
    <>
      <MaintenanceFormDrawer maintenance={maintenance} isOpen={editOpened} onClose={close} completing={completing} />

      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon aria-label="Maintenance actions" onClick={(event) => event.stopPropagation()}>
            <IconDots size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <CanAccess resource="maintenance" action="read">
            <Menu.Item component={Link} to={`/maintenance/${maintenance._id}`} leftSection={<IconEye size={16} />}>
              View
            </Menu.Item>
          </CanAccess>

          <CanAccess resource="maintenance" action="update">
            <Menu.Item leftSection={<IconPencil size={16} />} onClick={() => openEdit(false)}>
              Edit
            </Menu.Item>

            {!isCompleted(maintenance.status) && (
              <Menu.Item color="teal" leftSection={<IconCircleCheck size={16} />} onClick={() => openEdit(true)}>
                Mark completed
              </Menu.Item>
            )}
          </CanAccess>

          <CanAccess resource="maintenance" action="delete">
            <Menu.Divider />

            <DeleteItemButton resource="maintenance" label="maintenance job" mutationHook={useDeleteMaintenanceMutation} itemId={maintenance._id}>
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

export default MaintenanceTableRowMenu;
