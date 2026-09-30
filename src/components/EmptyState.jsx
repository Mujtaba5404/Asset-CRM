import { Box, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconInbox } from "@tabler/icons-react";

/**
 * Empty / error / no-results state. `variant="error"` swaps the icon tint to red
 * so a failed fetch never looks like "nothing here yet".
 */
const EmptyState = ({ title = "Nothing to show", description, icon, action, variant = "empty", withBorder = true, py = 48, ...props }) => {
  const isError = variant === "error";

  return (
    <Paper withBorder={withBorder} py={py} px="md" {...props}>
      <Stack align="center" gap="sm" maw={420} mx="auto" ta="center">
        <ThemeIcon size={52} radius="xl" variant="light" color={isError ? "red" : "gray"}>
          {icon ?? <IconInbox size={26} />}
        </ThemeIcon>

        <Box>
          <Text fw={600}>{title}</Text>

          {description && (
            <Text fz="sm" c="dimmed" mt={4}>
              {description}
            </Text>
          )}
        </Box>

        {action}
      </Stack>
    </Paper>
  );
};

export default EmptyState;
