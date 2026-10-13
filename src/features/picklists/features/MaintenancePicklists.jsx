import Picklists from "../../../features/picklists/Picklists";

/** One screen per Maintenance picklist field; only `field` and the label differ. */
const maintenancePicklist = (featureName, field) => {
  const MaintenancePicklist = () => (
    <Picklists featureName={featureName} resource="Maintenance" field={field}>
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );

  MaintenancePicklist.displayName = `MaintenancePicklist(${field})`;

  return MaintenancePicklist;
};

export const MaintenanceTypes = maintenancePicklist("maintenance type", "type");

export const MaintenancePriorities = maintenancePicklist("maintenance priority", "priority");

export const MaintenanceVendors = maintenancePicklist("maintenance vendor", "vendor");

export const MaintenanceChecklistItems = maintenancePicklist("checklist item", "checklist.item");

export const MaintenanceChecklistConditions = maintenancePicklist("checklist condition", "checklist.condition");
