import Picklists from "src/features/picklists/Picklists";

const ProcurementBillingStatus = () => {
  return (
    <Picklists featureName="procurement billing status" resource="Procurement" field="billingStatus">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default ProcurementBillingStatus;
