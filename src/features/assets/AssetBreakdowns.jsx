import { Grid, Skeleton } from "@mantine/core";
import { IconCategory, IconMapPin, IconProgressCheck, IconSparkles } from "@tabler/icons-react";
import { useGetAllAssetsQuery } from "../../api/asset";
import BarBreakdown from "../../components/BarBreakdown";
import SectionCard from "../../components/SectionCard";
import { toStatusItem } from "./assetStatus";

const MAX_BREAKDOWN_ROWS = 7;

/**
 * Count assets per picklist reference, biggest first, with the tail folded into
 * "Other" rather than growing more colour classes.
 */
const breakdownBy = (assets, accessor, limit = MAX_BREAKDOWN_ROWS) => {
  const buckets = new Map();

  assets.forEach((asset) => {
    const item = accessor(asset);
    const key = item?._id || "unassigned";

    const existing = buckets.get(key);

    if (existing) {
      existing.value += 1;
      return;
    }

    buckets.set(key, {
      key,
      label: item?.title || "Unassigned",
      color: item?.color,
      value: 1,
    });
  });

  const rows = [...buckets.values()].sort((a, b) => b.value - a.value);

  if (rows.length <= limit) return rows;

  const head = rows.slice(0, limit);
  const tail = rows.slice(limit);

  return [
    ...head,
    {
      key: "other",
      label: `Other (${tail.length})`,
      value: tail.reduce((sum, row) => sum + row.value, 0),
    },
  ];
};

const BREAKDOWNS = [
  { key: "category", title: "Assets by category", icon: IconCategory, accessor: (asset) => asset.category },
  { key: "status", title: "Assets by status", icon: IconProgressCheck, accessor: (asset) => toStatusItem(asset.status) },
  { key: "condition", title: "Assets by condition", icon: IconSparkles, accessor: (asset) => asset.condition },
  { key: "location", title: "Assets by location", icon: IconMapPin, accessor: (asset) => asset.location, limit: 6 },
];

const AssetBreakdowns = () => {
  const { data, isLoading, isError } = useGetAllAssetsQuery();

  const assets = Array.isArray(data) ? data : (data?.data ?? []);

  if (isError) return null;

  return (
    <Grid gutter="md">
      {BREAKDOWNS.map(({ key, title, icon: Icon, accessor, limit }) => (
        <Grid.Col key={key} span={{ base: 12, lg: 6 }}>
          {isLoading ? (
            <Skeleton height={120} radius="md" />
          ) : (
            <SectionCard icon={<Icon size={16} />} title={title}>
              <BarBreakdown data={breakdownBy(assets, accessor, limit)} />
            </SectionCard>
          )}
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default AssetBreakdowns;
