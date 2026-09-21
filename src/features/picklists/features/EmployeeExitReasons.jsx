import Picklists from "src/features/picklists/Picklists";

const EmployeeExitReasons = () => {
  return (
    <Picklists featureName="employee exit reason" resource="Employee" field="employment.exitReason">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default EmployeeExitReasons;
