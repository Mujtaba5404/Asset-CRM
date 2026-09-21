import Picklists from "src/features/picklists/Picklists";

const EmployeeMaritalStatus = () => {
  return (
    <Picklists featureName="employee marital status" resource="Employee" field="personal.maritalStatus">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default EmployeeMaritalStatus;
