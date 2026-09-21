import Picklists from "../../../features/picklists/Picklists";

const AssetLocations = () => {
  return (
    <Picklists featureName="asset location" resource="Asset" field="location">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default AssetLocations;