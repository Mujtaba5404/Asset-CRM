import { Badge, Text } from "@mantine/core";

/**
 * Renders a picklist reference in its configured colour. Falls back to a dash
 * so an unset reference never shows as an empty grey pill.
 */
const PicklistBadge = ({ item, size = "sm", variant = "light", fallback = "—", ...props }) => {
  if (!item?.title) {
    return (
      <Text fz="sm" c="dimmed">
        {fallback}
      </Text>
    );
  }

  return (
    <Badge variant={variant} size={size} color={item.color || "gray"} tt="capitalize" {...props}>
      {item.title}
    </Badge>
  );
};

export default PicklistBadge;
