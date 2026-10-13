import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAssetMutation } from "../../api/asset";
import FormDrawer from "../../components/FormDrawer";
import toFormData from "../../utils/toFormData";
import AttachmentsUpload from "../attachments/AttachmentsUpload";
import { ASSET_INITIAL_VALUES, assetValidation, toAssetPayload } from "./assetFormValues";
import AssetForm from "./AssetForm";

const AddAssetModal = ({ isOpen = false, onClose = () => {} }) => {
  const createAssetMutation = useCreateAssetMutation();
  const navigate = useNavigate();


  const [images, setImages] = useState([]);

  const form = useForm({ initialValues: ASSET_INITIAL_VALUES, validate: assetValidation });

  // A different category invalidates whatever sub category was picked.
  form.watch("category", ({ value, previousValue }) => {
    if (value !== previousValue) form.setFieldValue("subCategory", null);
  });

  form.watch("hasExpiry", ({ value }) => {
    if (!value) form.setFieldValue("expiryDate", undefined);
  });



  const handleClose = () => {
    form.reset();
    setImages([]);
    onClose();
  };

  const handleSubmit = (values) => {
    // Multipart, so the picked images go up in the same request as the fields.
    createAssetMutation.mutate(toFormData({ ...toAssetPayload(values), images }), {
      onSuccess: ({ data }) => {
        form.reset();
        setImages([]);
        onClose();

        if (data?._id) navigate(`/assets/${data._id}`);
      },
    });
  };

  return (
    <FormDrawer
      opened={isOpen}
      onClose={handleClose}
      title="Add asset"
      description="Register a new asset in the register"
      submitLabel="Add asset"
      loading={createAssetMutation.isPending}
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <Stack gap="md">
        <AttachmentsUpload value={images} onChange={setImages} />

        <AssetForm form={form} />
      </Stack>
    </FormDrawer>
  );
};

export default AddAssetModal;
