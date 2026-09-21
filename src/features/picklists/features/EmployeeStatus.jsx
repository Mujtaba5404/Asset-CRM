import Picklists from "src/features/picklists/Picklists";

const EmployeeStatus = () => {
  return (
    <Picklists featureName="employee status" resource="Employee" field="employment.status">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default EmployeeStatus;
