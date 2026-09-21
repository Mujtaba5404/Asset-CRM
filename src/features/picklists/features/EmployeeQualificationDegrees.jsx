import Picklists from "src/features/picklists/Picklists";

const EmployeeQualificationDegrees = () => {
  return (
    <Picklists featureName="employee qualification degrees" resource="Employee" field="qualification.degree">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default EmployeeQualificationDegrees;
