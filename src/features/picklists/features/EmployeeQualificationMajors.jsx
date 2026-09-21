import Picklists from "src/features/picklists/Picklists";

const EmployeeQualificationMajors = () => {
  return (
    <Picklists featureName="employee qualification majors" resource="Employee" field="qualification.major">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default EmployeeQualificationMajors;
