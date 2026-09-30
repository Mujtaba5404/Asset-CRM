import { Box, Button, Drawer, Group, ScrollArea, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

/** Wide enough for two columns of sections, but never wider than the viewport. */
const DEFAULT_SIZE = "min(1040px, 96vw)";

const CLOSE_BUTTON_PROPS = {
  size: "lg",
  radius: "md",
  style: { border: "1px solid var(--mantine-color-default-border)" },
};

/**
 * The standard shell for every create/edit form.
 *
 * Owns the <form> element, a scrolling body and a footer pinned to the bottom of
 * the viewport, so the primary action is always reachable without scrolling past
 * a long form. The body sits on the page canvas colour so the sections inside
 * read as raised cards. Goes full-screen below `sm`, where a wide panel cannot fit.
 */
const FormDrawer = ({
  opened = false,
  onClose = () => {},
  title,
  description,
  size = DEFAULT_SIZE,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  loading = false,
  disabled = false,
  onSubmit,
  children,
  footer,
  ...props
}) => {
  const isMobile = useMediaQuery("(max-width: 48em)");

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size={isMobile ? "100%" : size}
      offset={isMobile ? 0 : 8}
      radius={isMobile ? 0 : "md"}
      closeButtonProps={CLOSE_BUTTON_PROPS}
      title={
        <Box>
          <Text fz="md" fw={650} tt="capitalize" lh={1.3}>
            {title}
          </Text>

          {description && (
            <Text fz="xs" c="dimmed" fw={400} tt="initial">
              {description}
            </Text>
          )}
        </Box>
      }
      {...props}
    >
      <Box component="form" onSubmit={onSubmit} noValidate style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        <ScrollArea scrollbars="y" offsetScrollbars style={{ flex: 1, minHeight: 0, background: "var(--app-bg)" }}>
          <Box p="md">{children}</Box>
        </ScrollArea>

        <Box
          p="md"
          style={{
            flexShrink: 0,
            borderTop: "1px solid var(--mantine-color-default-border)",
            background: "var(--mantine-color-body)",
            paddingBottom: "max(var(--mantine-spacing-md), env(safe-area-inset-bottom))",
          }}
        >
          {footer ?? (
            <Group gap="sm" justify="flex-end" wrap="nowrap">
              <Button variant="default" onClick={onClose} disabled={loading} flex={{ base: 1, sm: "0 0 auto" }}>
                {cancelLabel}
              </Button>

              <Button type="submit" loading={loading} disabled={disabled} flex={{ base: 1, sm: "0 0 auto" }}>
                {submitLabel}
              </Button>
            </Group>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default FormDrawer;
