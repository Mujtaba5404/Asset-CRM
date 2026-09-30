import { Box, Divider, Group, Paper, Stack, Text } from "@mantine/core";
import { Children, Fragment } from "react";

/** A divided list of icon + label + value rows. */
const InfoList = ({ children, p = "md", ...props }) => {
  const items = Children.toArray(children);

  return (
    <Paper p={p} {...props}>
      <Stack gap="sm">
        {items.map((item, index) => (
          <Fragment key={index}>
            {item}

            {index !== items.length - 1 && <Divider />}
          </Fragment>
        ))}
      </Stack>
    </Paper>
  );
};

const InfoListItem = ({ icon, label, fallback = "—", children }) => {
  const content = children ?? fallback;

  return (
    <Group gap="sm" wrap="nowrap" justify="space-between">
      <Group gap="sm" wrap="nowrap" miw={0}>
        {icon && (
          <Box c="dimmed" style={{ display: "flex", flexShrink: 0 }}>
            {icon}
          </Box>
        )}

        <Text fz="xs" c="dimmed" tt="capitalize">
          {label}
        </Text>
      </Group>

      <Box style={{ flexShrink: 0, textAlign: "right" }}>
        {typeof content === "string" || typeof content === "number" ? (
          <Text fz="sm" fw={550} tt="capitalize">
            {content}
          </Text>
        ) : (
          content
        )}
      </Box>
    </Group>
  );
};

InfoList.Item = InfoListItem;

export default InfoList;
