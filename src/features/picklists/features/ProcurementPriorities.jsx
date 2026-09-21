import Picklists from "src/features/picklists/Picklists";

const ProcurementPriorities = () => {
  return (
    <Picklists featureName="procurement priority" resource="Procurement" field="priority">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default ProcurementPriorities;
