import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useUpdateAssetMutation } from "../../api/asset";
import FormDrawer from "../../components/FormDrawer";
import ImageUploadInput from "../../components/ImageUploadInput";
import { assetValidation, toAssetFormValues, toAssetPayload } from "./assetFormValues";
import AssetForm from "./AssetForm";

const EditAssetModal = ({ asset, isOpen = false, onClose = () => {} }) => {
  const updateAssetMutation = useUpdateAssetMutation();

  // Held outside the form: the update endpoint takes JSON, so the files are
  // collected here and uploaded separately once that endpoint exists. The seed
  // is reset during render rather than in an effect, so the drawer never paints
  // the previous record's photos for a frame.
  const seed = `${isOpen}:${asset?._id}:${asset?.updatedAt}`;
  const [imagesSeed, setImagesSeed] = useState(seed);
  const [images, setImages] = useState(asset?.images ?? []);

  if (imagesSeed !== seed) {
    setImagesSeed(seed);
    setImages(asset?.images ?? []);
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
    setImages(asset?.images ?? []);
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
        <ImageUploadInput value={images} onChange={setImages} />

        <AssetForm form={form} />
      </Stack>
    </FormDrawer>
  );
};

export default EditAssetModal;
