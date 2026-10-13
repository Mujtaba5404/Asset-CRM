import PageHeader from "../components/PageHeader";
import AddRoleButton from "../features/roles/AddRoleButton";
import RolesList from "../features/roles/RolesList";

const RolesPage = () => (
  <>
    <PageHeader title="Roles" description="Decide what each kind of user can see and change, and which records it reaches." actions={<AddRoleButton />} />

    <RolesList />
  </>
);

export default RolesPage;
