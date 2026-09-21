import Picklists from "src/features/picklists/Picklists";

const EmployeeSeparationTypes = () => {
  return (
    <Picklists featureName="employee separation type" resource="Employee" field="employment.separationType">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default EmployeeSeparationTypes;
