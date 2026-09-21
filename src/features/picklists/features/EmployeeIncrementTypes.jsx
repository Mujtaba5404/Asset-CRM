import Picklists from "src/features/picklists/Picklists";

const EmployeeIncrementTypes = () => {
  return (
    <Picklists featureName="employee increment type" resource="EmployeeIncrement" field="type">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default EmployeeIncrementTypes;
