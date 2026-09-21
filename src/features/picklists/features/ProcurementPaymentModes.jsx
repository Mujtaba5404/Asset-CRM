import Picklists from "src/features/picklists/Picklists";

const ProcurementPaymentModes = () => {
  return (
    <Picklists featureName="procurement payment mode" resource="Procurement" field="paymentMode">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default ProcurementPaymentModes;
