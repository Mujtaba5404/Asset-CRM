import { Stack, Text } from "@mantine/core";

const EM_DASH = "—";

/**
 * A label/value pair. Strings and numbers get the standard value treatment;
 * anything else (badges, links, groups) renders as given.
 */
const DataField = ({ label, children, fallback = EM_DASH, ...props }) => {
  const isEmpty = children === null || children === undefined || children === "";
  const content = isEmpty ? fallback : children;

  return (
    <Stack gap={3} miw={0} {...props}>
      <Text fz="xs" c="dimmed" fw={500}>
        {label}
      </Text>

      {typeof content === "string" || typeof content === "number" ? (
        <Text fz="sm" fw={550} c={isEmpty ? "dimmed" : undefined} style={{ wordBreak: "break-word" }}>
          {content}
        </Text>
      ) : (
        content
      )}
    </Stack>
  );
};

export default DataField;
