import { useForm } from "@mantine/form";
import { useEffect, useMemo } from "react";
import { useCreateRoleMutation, useGetAllRolesQuery, useGetRoleByIdQuery, useUpdateRoleMutation } from "../../api/role";
import FormDrawer from "../../components/FormDrawer";
import capitalizeLetters from "../../utils/capitalizeLetters";
import RoleForm from "./RoleForm";
import { buildResourceCatalog, getRoleFormInitialValues, roleFormValidate, toRolePayload } from "./rolePermissions";

const RoleFormDrawer = ({ role, isOpen = false, onClose = () => {} }) => {
  const isEdit = Boolean(role?._id);

  const { data: freshRole } = useGetRoleByIdQuery(isOpen && isEdit ? role._id : null);
  const source = isEdit ? (freshRole ?? role) : null;

  const { data: allRoles } = useGetAllRolesQuery();
  const catalog = useMemo(() => buildResourceCatalog([...(allRoles ?? []), source]), [allRoles, source]);

  const createMutation = useCreateRoleMutation();
  const updateMutation = useUpdateRoleMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  const form = useForm({ initialValues: getRoleFormInitialValues(source, catalog), validate: roleFormValidate });

  useEffect(() => {
    if (!isOpen) return;

    const values = getRoleFormInitialValues(source, catalog);

    form.setInitialValues(values);
    form.setValues(values);
    form.clearErrors();
  }, [isOpen, source?._id, source?.updatedAt, allRoles]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    const payload = toRolePayload(values);

    mutation.mutate(isEdit ? { roleId: role._id, payload } : payload, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  };

  return (
    <FormDrawer
      opened={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit role" : "New role"}
      description={isEdit ? capitalizeLetters(role.title) : "Decide what its users can see and do"}
      submitLabel={isEdit ? "Save changes" : "Create role"}
      loading={mutation.isPending}
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <RoleForm form={form} catalog={catalog} />
    </FormDrawer>
  );
};

export default RoleFormDrawer;
