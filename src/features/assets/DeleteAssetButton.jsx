import { useDeleteAssetMutation } from "../../api/asset";
import DeleteItemButton from "../../components/DeleteItemButton";

const DeleteAssetButton = ({ assetId, redirect = false, ...props }) => (
  <DeleteItemButton
    resource="asset"
    label="asset"
    mutationHook={useDeleteAssetMutation}
    itemId={assetId}
    navigateTo={redirect ? "/assets" : undefined}
    tooltip={{ label: "Delete asset", withArrow: true }}
    {...props}
  />
);

export default DeleteAssetButton;
