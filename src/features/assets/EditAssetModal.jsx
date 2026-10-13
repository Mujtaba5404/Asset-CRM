import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useUpdateAssetMutation } from "../../api/asset";
import FormDrawer from "../../components/FormDrawer";
import AttachmentsUpload from "../attachments/AttachmentsUpload";
import { assetValidation, toAssetFormValues, toAssetPayload } from "./assetFormValues";
import AssetForm from "./AssetForm";

const EditAssetModal = ({ asset, isOpen = false, onClose = () => {} }) => {
  const updateAssetMutation = useUpdateAssetMutation();

  // Held outside the form: the update endpoint takes JSON, so the newly picked
  // files are collected here and uploaded separately once that endpoint exists.
  // AttachmentsUpload only handles `File`s, so this starts empty rather than
  // with the stored attachments. The seed is reset during render rather than in
  // an effect, so the drawer never paints the previous record's files for a frame.
  const seed = `${isOpen}:${asset?._id}:${asset?.updatedAt}`;
  const [imagesSeed, setImagesSeed] = useState(seed);
  const [images, setImages] = useState([]);

  if (imagesSeed !== seed) {
    setImagesSeed(seed);
    setImages([]);
  }

  const form = useForm({ initialValues: toAssetFormValues(asset), validate: assetValidation });

  // Re-seed whenever the drawer opens or the underlying record changes, so
  // "reset" goes back to the saved record rather than the first one loaded.
  useEffect(() => {
    if (!isOpen || !asset) return;

    const values = toAssetFormValues(asset);

    form.setInitialValues(values);
    form.setValues(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, asset?._id, asset?.updatedAt]);

  form.watch("category", ({ value, previousValue }) => {
    if (previousValue && value !== previousValue) form.setFieldValue("subCategory", null);
  });

  const handleClose = () => {
    form.reset();
    setImages([]);
    onClose();
  };

  const handleSubmit = (values) => {
    updateAssetMutation.mutate({ assetId: asset._id, payload: toAssetPayload(values) }, { onSuccess: () => onClose() });
  };

  return (
    <FormDrawer
      opened={isOpen}
      onClose={handleClose}
      title="Update asset"
      description={asset?.serialNumber}
      submitLabel="Save changes"
      loading={updateAssetMutation.isPending}
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <Stack gap="md">
        <AttachmentsUpload value={images} onChange={setImages} />

        <AssetForm form={form} />
      </Stack>
    </FormDrawer>
  );
};

export default EditAssetModal;
