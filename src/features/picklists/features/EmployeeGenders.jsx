import Picklists from "src/features/picklists/Picklists";

const EmployeeGenders = () => {
  return (
    <Picklists featureName="employee gender" resource="Employee" field="personal.gender">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default EmployeeGenders;
