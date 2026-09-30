import { Button, Group, Modal, PasswordInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useChangePasswordMutation } from "../../api/auth";

const MIN_LENGTH = 8;

const ChangePasswordModal = ({ isOpen = false, onClose = () => {} }) => {
  const changePasswordMutation = useChangePasswordMutation();

  const form = useForm({
    initialValues: { oldPassword: "", newPassword: "", confirmNewPassword: "" },
    validate: {
      oldPassword: (value) => (value ? null : "Enter your current password"),
      newPassword: (value, values) => {
        if (value.length < MIN_LENGTH) return `Use at least ${MIN_LENGTH} characters`;

        if (value === values.oldPassword) return "Pick a password you haven't used here before";

        return null;
      },
      confirmNewPassword: (value, values) => (value !== values.newPassword ? "Passwords do not match" : null),
    },
    validateInputOnBlur: true,
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    changePasswordMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  };

  return (
    <Modal opened={isOpen} onClose={handleClose} title="Change password">
      <Stack component="form" gap="md" onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <PasswordInput required label="Current password" placeholder="Your current password" data-autofocus {...form.getInputProps("oldPassword")} />

        <PasswordInput required label="New password" placeholder={`At least ${MIN_LENGTH} characters`} {...form.getInputProps("newPassword")} />

        <PasswordInput required label="Confirm new password" placeholder="Repeat the new password" {...form.getInputProps("confirmNewPassword")} />

        <Group gap="sm" justify="flex-end" mt="xs">
          <Button variant="default" onClick={handleClose} disabled={changePasswordMutation.isPending} flex={{ base: 1, sm: "0 0 auto" }}>
            Cancel
          </Button>

          <Button type="submit" loading={changePasswordMutation.isPending} flex={{ base: 1, sm: "0 0 auto" }}>
            Update password
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ChangePasswordModal;
