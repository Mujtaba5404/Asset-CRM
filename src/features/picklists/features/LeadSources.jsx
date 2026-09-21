import Picklists from "src/features/picklists/Picklists";

const LeadSources = () => {
  return (
    <Picklists featureName="lead source" resource="Lead" field="source">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default LeadSources;
