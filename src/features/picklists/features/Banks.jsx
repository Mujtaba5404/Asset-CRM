import PICKLIST_SCOPE from "src/constants/PICKLIST_SCOPE";
import Picklists from "src/features/picklists/Picklists";

const Banks = () => {
  return (
    <Picklists featureName="bank" scope={PICKLIST_SCOPE.GLOBAL} field="bank">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default Banks;
