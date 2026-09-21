import Picklists from "src/features/picklists/Picklists";

const ClientHealth = () => {
  return (
    <Picklists featureName="client health" resource="Client" field="health">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default ClientHealth;
