import Picklists from "../../../features/picklists/Picklists";

const AssetConditions = () => {
  return (
    <Picklists featureName="asset condition" resource="Asset" field="condition">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default AssetConditions;