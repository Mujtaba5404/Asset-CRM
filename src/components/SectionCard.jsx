import { Box, Group, Paper, Text } from "@mantine/core";

/**
 * A titled content block. Used for every grouped region on a detail screen so
 * headings, icon treatment and padding stay identical everywhere.
 */
const SectionCard = ({ icon, title, description, actions, children, padding = "md", ...props }) => (
  <Paper p={padding} {...props}>
    {(title || actions) && (
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm" mb={description ? 4 : "md"}>
        <Group gap={8} wrap="nowrap" miw={0}>
          {icon && (
            <Box c="dimmed" style={{ display: "flex", flexShrink: 0 }}>
              {icon}
            </Box>
          )}

          <Text fz="xs" fw={650} tt="uppercase" c="dimmed" style={{ letterSpacing: "0.05em" }} truncate>
            {title}
          </Text>
        </Group>

        {actions}
      </Group>
    )}

    {description && (
      <Text fz="xs" c="dimmed" mb="md">
        {description}
      </Text>
    )}

    {children}
  </Paper>
);

export default SectionCard;
