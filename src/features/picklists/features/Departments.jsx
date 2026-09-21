import PICKLIST_SCOPE from "src/constants/PICKLIST_SCOPE";
import Picklists from "src/features/picklists/Picklists";

const Departments = () => {
  return (
    <Picklists featureName="department" scope={PICKLIST_SCOPE.GLOBAL} field="department">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default Departments;
