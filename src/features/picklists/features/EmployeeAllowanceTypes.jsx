import Picklists from "src/features/picklists/Picklists";

const EmployeeAllowanceTypes = () => {
  return (
    <Picklists featureName="employee allowance type" resource="EmployeeAllowance" field="type">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default EmployeeAllowanceTypes;
