import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useCreateDepreciationMutation, useGetDepreciationByIdQuery, useUpdateDepreciationMutation } from "../../api/depreciation";
import FormDrawer from "../../components/FormDrawer";
import { DEPRECIATION_INITIAL_VALUES, depreciationValidation, toDepreciationFormValues, toDepreciationPayload } from "./depreciationFormValues";
import DepreciationForm from "./DepreciationForm";
import useAssetLookup from "./useAssetLookup";

/** Two short sections — no need for the default two-column width. */
const DRAWER_SIZE = "min(640px, 96vw)";

/** Creates a depreciation, or edits `depreciation` when one is passed. */
const DepreciationFormDrawer = ({ depreciation, isOpen = false, onClose = () => {} }) => {
  const isEdit = Boolean(depreciation?._id);

  const { data: freshDepreciation } = useGetDepreciationByIdQuery(isOpen && isEdit ? depreciation._id : null);
  const source = isEdit ? (freshDepreciation ?? depreciation) : null;

  const lookupAsset = useAssetLookup();
  const assetName = lookupAsset(source?.asset)?.serialNumber;

  const createMutation = useCreateDepreciationMutation();
  const updateMutation = useUpdateDepreciationMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  const form = useForm({ initialValues: DEPRECIATION_INITIAL_VALUES, validate: depreciationValidation });

  // Re-seed whenever the drawer opens or the underlying record changes, so
  // "reset" goes back to the saved record rather than the first one loaded.
  useEffect(() => {
    if (!isOpen) return;

    const values = source ? toDepreciationFormValues(source) : DEPRECIATION_INITIAL_VALUES;

    form.setInitialValues(values);
    form.setValues(values);
    form.clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, source?._id, source?.updatedAt]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    const payload = toDepreciationPayload(values);

    mutation.mutate(isEdit ? { depreciationId: depreciation._id, payload } : payload, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  };

  return (
    <FormDrawer
      opened={isOpen}
      onClose={handleClose}
      size={DRAWER_SIZE}
      title={isEdit ? "Edit depreciation" : "New depreciation"}
      description={isEdit ? assetName || "Update this depreciation schedule" :"Set up how an asset loses value over time"}
      submitLabel={isEdit ? "Save changes" : "Create depreciation"}
      loading={mutation.isPending}
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <DepreciationForm form={form} />
    </FormDrawer>
  );
};

export default DepreciationFormDrawer;
