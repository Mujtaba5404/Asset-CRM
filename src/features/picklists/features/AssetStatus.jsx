import Picklists from "../../../features/picklists/Picklists";

const AssetStatus = () => {
  return (
    <Picklists featureName="asset status" resource="Asset" field="status">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default AssetStatus;
