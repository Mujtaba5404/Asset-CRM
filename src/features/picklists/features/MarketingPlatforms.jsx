import Picklists from "src/features/picklists/Picklists";

const MarketingPlatforms = () => {
  return (
    <Picklists featureName="marketing platform" resource="Marketing" field="platform">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default MarketingPlatforms;
