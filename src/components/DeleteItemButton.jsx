import { ActionIcon, Button, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import capitalizeLetters from "../utils/capitalizeLetters";
import CanAccess from "./CanAccess";

/**
 * Generic delete button with a confirmation modal.
 *
 * Handles:
 * - Optional permission check via CanAccess (when `resource` is given)
 * - Confirmation modal before deletion
 * - Single or multiple deletion
 * - Button, icon or custom trigger
 * - Optional tooltip and post-delete navigation
 *
 * @param {Object} props
 * @param {string} [props.resource] - Resource name for CanAccess (e.g. "asset"). Omit to skip the check.
 * @param {string} props.label - Human-readable label for the modal, tooltip and button text
 * @param {string|number|Array} props.itemId - The id(s) of the item(s) to delete
 * @param {Function} props.mutationHook - React Query mutation hook
 * @param {string} [props.confirmText] - Optional confirmation modal text
 * @param {'button'|'icon'} [props.variant] - Render as button or icon (default: "icon")
 * @param {Function} [props.onSuccess] - Callback after successful deletion
 * @param {string} [props.navigateTo] - Optional route to navigate to after deletion
 * @param {boolean} [props.disabled] - Disable the trigger
 * @param {Object} [props.tooltip] - Optional tooltip props { label, withArrow }
 * @param {string} [props.buttonText] - Custom button text (for variant="button")
 * @param {React.ReactNode} [props.children] - Custom trigger rendered instead of the default
 */
const DeleteItemButton = ({
  resource,
  label,
  itemId,
  mutationHook,
  confirmText,
  variant = "icon",
  onSuccess = () => {},
  navigateTo,
  disabled = false,
  tooltip,
  buttonText,
  children,
}) => {
  const deleteMutation = mutationHook();
  const navigate = useNavigate();

  const count = Array.isArray(itemId) ? itemId.length : 1;

  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: capitalizeLetters(`delete ${label}`),
      centered: true,
      children: (
        <Text size="sm">
          {confirmText || `Are you sure you want to delete ${count > 1 ? `these ${count} ${label}s` : `this ${label}`}? This cannot be undone.`}
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () =>
        // `mutate` is fire-and-forget — the outcome has to come through callbacks,
        // not a try/catch around it.
        deleteMutation.mutate(itemId, {
          onSuccess: () => {
            onSuccess();

            if (navigateTo) navigate(navigateTo);
          },
        }),
    });
  };

  const triggerProps = { color: "red", onClick: openDeleteModal, loading: deleteMutation.isPending, disabled };

  let content;

  if (children) {
    content = React.cloneElement(children, { onClick: openDeleteModal, disabled });
  } else if (variant === "button") {
    content = <Button {...triggerProps}>{buttonText || `Delete ${count > 1 ? count : ""} ${label}`.replace(/\s+/g, " ")}</Button>;
  } else {
    content = (
      <ActionIcon variant="subtle" aria-label={`Delete ${label}`} {...triggerProps}>
        <IconTrash size={18} />
      </ActionIcon>
    );
  }

  const trigger = tooltip ? <Tooltip {...tooltip}>{content}</Tooltip> : content;

  if (!resource) return trigger;

  return (
    <CanAccess resource={resource} action="delete">
      {trigger}
    </CanAccess>
  );
};

export default DeleteItemButton;
