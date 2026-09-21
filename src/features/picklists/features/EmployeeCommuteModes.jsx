import Picklists from "src/features/picklists/Picklists";

const EmployeeCommuteModes = () => {
  return (
    <Picklists featureName="employee commute mode" resource="Employee" field="organization.commuteMode">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default EmployeeCommuteModes;
