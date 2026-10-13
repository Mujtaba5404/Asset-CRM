import { useDeleteRoleMutation } from "../../api/role";
import DeleteItemButton from "../../components/DeleteItemButton";

const DeleteRoleButton = ({ roleId, ...props }) => (
  <DeleteItemButton
    resource="role"
    label="role"
    mutationHook={useDeleteRoleMutation}
    itemId={roleId}
    confirmText="Users holding this role lose its permissions immediately. This cannot be undone."
    {...props}
  />
);

export default DeleteRoleButton;
