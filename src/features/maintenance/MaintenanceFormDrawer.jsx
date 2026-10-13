import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateMaintenanceMutation, useUpdateMaintenanceMutation } from "../../api/maintenance";
import FormDrawer from "../../components/FormDrawer";
import ENUMS from "../../constants/ENUMS";
import { toDateValue } from "../../utils/dateValue";
import { getMaintenanceInitialValues, maintenanceToFormData, maintenanceToFormValues, maintenanceValidation, photosForStatus } from "./maintenanceForm";
import MaintenanceFormFields from "./MaintenanceFormFields";
import useConditionPhotos from "./useConditionPhotos";

/**
 * Creates a maintenance job, or edits `maintenance` when one is passed.
 *
 * @param {Object}  props
 * @param {Object}  [props.maintenance]
 * @param {boolean} [props.completing] Open pre-set to Completed (with today as
 *   the end date), for the "Mark completed" action.
 */
const MaintenanceFormDrawer = ({ maintenance, isOpen = false, onClose = () => {}, completing = false }) => {
  const isEdit = Boolean(maintenance?._id);
  const navigate = useNavigate();

  const createMutation = useCreateMaintenanceMutation();
  const updateMutation = useUpdateMaintenanceMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  const { photos, setPhotoField, resetPhotos } = useConditionPhotos(`${isOpen}:${maintenance?._id}`);

  const form = useForm({ initialValues: getMaintenanceInitialValues(), validate: maintenanceValidation });

  // Refill from the latest record every time the drawer opens, so "reset"
  // goes back to the saved record rather than the first one loaded.
  useEffect(() => {
    if (!isOpen) return;

    const values = isEdit ? maintenanceToFormValues(maintenance) : getMaintenanceInitialValues();
    const next = completing ? { ...values, status: ENUMS.MAINTENANCE.STATUSES.COMPLETED, endDate: values.endDate || toDateValue(new Date()) } : values;

    form.setInitialValues(next);
    form.setValues(next);
    form.clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, completing, maintenance?._id, maintenance?.updatedAt]);

  const handleClose = () => {
    form.reset();
    resetPhotos();
    onClose();
  };

  const handleSubmit = (values) => {
    const payload = maintenanceToFormData(values, photosForStatus(values.status, photos));

    mutation.mutate(isEdit ? { maintenanceId: maintenance._id, payload } : payload, {
      onSuccess: ({ data }) => {
        form.reset();
        resetPhotos();
        onClose();

        if (!isEdit && data?._id) navigate(`/maintenance/${data._id}`);
      },
    });
  };

  const title = completing ? "Complete maintenance" : isEdit ? "Edit maintenance" : "Add maintenance";

  const description = completing
    ? "Confirm the end date and add photos of the asset after service"
    : isEdit
      ? [maintenance.asset?.serialNumber, maintenance.type?.title].filter(Boolean).join(" · ") || "Update this service job's details"
      : "Record a service job, its checks and the asset's condition";

  return (
    <FormDrawer
      opened={isOpen}
      onClose={handleClose}
      title={title}
      description={description}
      submitLabel={completing ? "Mark completed" : isEdit ? "Save changes" : "Add maintenance"}
      loading={mutation.isPending}
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <MaintenanceFormFields form={form} photos={photos} onPhotosChange={setPhotoField} job={isEdit ? maintenance : undefined} />
    </FormDrawer>
  );
};

export default MaintenanceFormDrawer;
