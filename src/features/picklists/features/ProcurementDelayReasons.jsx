import Picklists from "src/features/picklists/Picklists";

const ProcurementDelayReasons = () => {
  return (
    <Picklists featureName="procurement delay reason" resource="Procurement" field="delayReason">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default ProcurementDelayReasons;
