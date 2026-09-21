import Picklists from "src/features/picklists/Picklists";

const ClientStatus = () => {
  return (
    <Picklists featureName="client status" resource="Client" field="status">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default ClientStatus;
