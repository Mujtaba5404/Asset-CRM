import { useDeleteAssetMutation } from "../../api/asset";
import DeleteItemButton from "../../components/DeleteItemButton";

const DeleteAssetButton = ({ assetId, redirect = false }) => {
  return <DeleteItemButton label="asset" mutationHook={useDeleteAssetMutation} itemId={assetId} navigateTo={redirect ? "/assets" : undefined} />;
};

export default DeleteAssetButton;
