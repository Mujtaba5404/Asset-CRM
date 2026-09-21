import Picklists from "src/features/picklists/Picklists";

const ProcurementCategories = () => {
  return (
    <Picklists featureName="procurement category" resource="Procurement" field="category">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default ProcurementCategories;
