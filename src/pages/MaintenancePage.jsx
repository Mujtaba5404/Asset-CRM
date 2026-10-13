import PageHeader from "../components/PageHeader";
import AddMaintenanceButton from "../features/maintenance/AddMaintenanceButton";
import MaintenanceTable from "../features/maintenance/MaintenanceTable";

const MaintenancePage = () => (
  <>
    <PageHeader title="Maintenance" description="Service jobs on your assets, with their checks, cost and condition before and after." actions={<AddMaintenanceButton />} />

    <MaintenanceTable emptyAction={<AddMaintenanceButton label="Log the first job" />} />
  </>
);

export default MaintenancePage;
