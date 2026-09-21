import Picklists from "src/features/picklists/Picklists";

const ProcurementStatus = () => {
  return (
    <Picklists featureName="procurement status" resource="Procurement" field="status">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default ProcurementStatus;
