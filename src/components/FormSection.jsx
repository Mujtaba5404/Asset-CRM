import { Box, Divider, Group, Paper, Text, ThemeIcon } from "@mantine/core";
import classes from "./FormSection.module.css";

/**
 * A titled block of form fields: tinted icon tile, heading, one line of help
 * text, then the fields. Gives long forms a scannable structure instead of a
 * single undifferentiated column of inputs.
 */
const FormSection = ({ icon, title, description, children, ...props }) => (
  <Paper p="md" {...props}>
    <Group gap="sm" wrap="nowrap" align="flex-start">
      {icon && (
        <ThemeIcon size={38} radius="md" variant="light">
          {icon}
        </ThemeIcon>
      )}

      <Box miw={0}>
        <Text fz="sm" fw={650} lh={1.35}>
          {title}
        </Text>

        {description && (
          <Text fz="xs" c="dimmed" lh={1.4}>
            {description}
          </Text>
        )}
      </Box>
    </Group>

    <Divider my="md" />

    {children}
  </Paper>
);

/** Side-by-side columns of sections; stacks on a narrow panel. */
export const FormColumns = ({ children }) => (
  <div className={classes.root}>
    <div className={classes.columns}>{children}</div>
  </div>
);

/** One column — wrap several sections to stack them within a column. */
export const FormColumn = ({ children }) => <div className={classes.column}>{children}</div>;

export default FormSection;
