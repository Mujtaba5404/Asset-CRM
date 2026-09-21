import Picklists from "src/features/picklists/Picklists";

const ProcurementPaymentStatus = () => {
  return (
    <Picklists featureName="procurement payment status" resource="Procurement" field="paymentStatus">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default ProcurementPaymentStatus;
