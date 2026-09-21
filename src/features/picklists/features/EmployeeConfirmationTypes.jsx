import Picklists from "src/features/picklists/Picklists";

const EmployeeConfirmationTypes = () => {
  return (
    <Picklists featureName="employee confirmation type" resource="Employee" field="employment.confirmationType">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default EmployeeConfirmationTypes;
