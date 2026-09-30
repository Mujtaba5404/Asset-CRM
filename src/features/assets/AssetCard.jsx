import { Avatar, Badge, Group, Paper, Stack, Text } from "@mantine/core";
import { IconMapPin } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import PicklistBadge from "../../components/PicklistBadge";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import getAbbreviation from "../../utils/getAbbreviation";
import AssetTableRowMenu from "./AssetTableRowMenu";
import AssetWarrantyBadge from "./AssetWarrantyBadge";

/**
 * Phone-sized representation of one asset row. Used by the assets list below
 * the `sm` breakpoint, where a ten-column table would only scroll sideways.
 */
const AssetCard = ({ asset }) => (
  <Paper p="sm">
    <Group gap="sm" wrap="nowrap" align="flex-start">
      <Avatar size={42} radius="md" color={asset.category?.color || "gray"}>
        {getAbbreviation(asset.subCategory?.title || asset.serialNumber)}
      </Avatar>

      <Stack gap={6} flex={1} miw={0}>
        <Group justify="space-between" wrap="nowrap" gap="xs" align="flex-start">
          <Stack gap={2} miw={0}>
            <Text component={Link} to={`/assets/${asset._id}`} fz="sm" fw={600} c="inherit" lineClamp={1} style={{ textDecoration: "none" }}>
              {asset.serialNumber || "—"}
            </Text>

            <Text fz="xs" c="dimmed" lineClamp={2}>
              {asset.description || "No description"}
            </Text>
          </Stack>

          <AssetTableRowMenu asset={asset} />
        </Group>

        <Group gap={6} wrap="wrap">
          {asset.tag && (
            <Badge variant="outline" color="gray" size="sm">
              {asset.tag}
            </Badge>
          )}
          <PicklistBadge item={asset.status} />
          <PicklistBadge item={asset.condition} />
          <AssetWarrantyBadge warranty={asset.warranty} />
        </Group>

        <Group justify="space-between" wrap="nowrap" gap="xs">
          <Group gap={4} wrap="nowrap" miw={0} c="dimmed">
            <IconMapPin size={13} />
            <Text fz="xs" tt="capitalize" truncate>
              {asset.location?.title || "Unassigned"}
            </Text>
          </Group>

          <Text fz="xs" fw={600} style={{ flexShrink: 0 }}>
            {formatAmount(asset.purchaseAmount || 0)}
            <Text component="span" c="dimmed" fw={400}>
              {` · ${formatDate(asset.purchaseDate)}`}
            </Text>
          </Text>
        </Group>
      </Stack>
    </Group>
  </Paper>
);

export default AssetCard;
