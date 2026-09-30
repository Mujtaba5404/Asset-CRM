import { Loader } from "@mantine/core";
import { useGetAllAssetsQuery } from "../../api/asset";
import MultiSelect from "../../components/MultiSelect";

/** Multi-asset picker — the filtering counterpart to <AssetSelect />. */
const AssetMultiSelect = ({ multiSelectProps = {}, queryObject = {} }) => {
  const assets = useGetAllAssetsQuery({ query: queryObject });

  return (
    <MultiSelect
      data={Array.isArray(assets.data) ? assets.data : []}
      selectLabel="serialNumber"
      selectValue="_id"
      capitalizeLabel={false}
      label="Assets"
      placeholder="Select assets"
      rightSection={assets.isLoading ? <Loader size={16} /> : undefined}
      {...multiSelectProps}
      {...(assets.isError && { disabled: true, placeholder: "Error loading assets" })}
    />
  );
};

export default AssetMultiSelect;
