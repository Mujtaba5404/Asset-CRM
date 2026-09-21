import Picklists from "src/features/picklists/Picklists";

const EmployeeDesignations = () => {
  return (
    <Picklists featureName="employee designation" resource="Employee" field="organization.designation">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default EmployeeDesignations;
