import Picklists from "../../../features/picklists/Picklists";

const AssetCategories = () => {
  return (
    <Picklists featureName="asset category" resource="Asset" field="category">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false, acronym: true }} />

      <Picklists.List />
    </Picklists>
  );
};

export default AssetCategories;
