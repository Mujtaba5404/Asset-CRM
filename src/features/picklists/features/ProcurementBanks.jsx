import Picklists from "src/features/picklists/Picklists";

const ProcurementBanks = () => {
  return (
    <Picklists featureName="procurement bank" resource="Procurement" field="bank">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default ProcurementBanks;
