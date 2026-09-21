import Picklists from "src/features/picklists/Picklists";

const EmployeeShiftTypes = () => {
  return (
    <Picklists featureName="employee shift type" resource="Employee" field="employment.shiftType">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default EmployeeShiftTypes;
