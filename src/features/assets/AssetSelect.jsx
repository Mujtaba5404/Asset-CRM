import { Loader } from "@mantine/core";
import { useGetAllAssetsQuery } from "../../api/asset";
import Select from "../../components/Select";

/**
 * Single-asset picker, for screens that reference an asset (maintenance,
 * assignments, procurement). `queryObject` narrows the options server-side.
 */
const AssetSelect = ({ selectProps = {}, queryObject = {} }) => {
  const assets = useGetAllAssetsQuery({ query: queryObject });

  return (
    <Select
      data={Array.isArray(assets.data) ? assets.data : []}
      selectLabel="serialNumber"
      selectValue="_id"
      capitalizeLabel={false}
      label="Asset"
      placeholder="Select asset"
      rightSection={assets.isLoading ? <Loader size={16} /> : undefined}
      {...selectProps}
      {...(assets.isError && { disabled: true, placeholder: "Error loading assets" })}
    />
  );
};

export default AssetSelect;
