import Picklists from "src/features/picklists/Picklists";

const InsuranceProviders = () => {
  return (
    <Picklists featureName="insurance provider" resource="Insurance" field="provider">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default InsuranceProviders;
