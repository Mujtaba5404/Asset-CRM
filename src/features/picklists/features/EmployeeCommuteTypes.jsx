import Picklists from "src/features/picklists/Picklists";

const EmployeeCommuteTypes = () => {
  return (
    <Picklists featureName="employee commute type" resource="Employee" field="organization.commuteType">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default EmployeeCommuteTypes;
