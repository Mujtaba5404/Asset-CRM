import PICKLIST_SCOPE from "src/constants/PICKLIST_SCOPE";
import Picklists from "src/features/picklists/Picklists";

const Locations = () => {
  return (
    <Picklists featureName="location" scope={PICKLIST_SCOPE.GLOBAL} field="location">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default Locations;
