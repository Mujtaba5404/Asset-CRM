import Picklists from "../../../features/picklists/Picklists";

const WarrantyProviders = () => {
  return (
    <Picklists featureName="warranty provider" resource="Asset" field="warranty.provider">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default WarrantyProviders;