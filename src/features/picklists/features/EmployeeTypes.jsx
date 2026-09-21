import Picklists from "src/features/picklists/Picklists";

const EmployeeTypes = () => {
  return (
    <Picklists featureName="employee type" resource="Employee" field="employment.type">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default EmployeeTypes;
