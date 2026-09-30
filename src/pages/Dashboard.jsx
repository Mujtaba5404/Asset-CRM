import {
  Anchor,
  Badge,
  Grid,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCash,
  IconCategory,
  IconMapPin,
  IconPackage,
  IconProgressCheck,
  IconShieldCheck,
  IconShieldExclamation,
  IconSparkles,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useGetAllAssetsQuery } from "../api/asset";
import BarBreakdown from "../components/BarBreakdown";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import PicklistBadge from "../components/PicklistBadge";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";
import { WARRANTY_EXPIRY_WINDOW_DAYS } from "../features/assets/AssetWarrantyBadge";
import {
  daysUntil,
  describeDueDate,
  isDueSoon,
  isPast,
} from "../utils/dateValue";
import formatAmount, { formatAmountCompact } from "../utils/formatAmount";
import formatDate from "../utils/formatDate";
import formatNumber from "../utils/formatNumber";

const EXPIRY_WINDOW_DAYS = 30;
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

const DashboardSkeleton = () => (
  <Stack gap="md">
    <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} height={116} radius="md" />
      ))}
    </SimpleGrid>
    <Grid>
      <Grid.Col span={{ base: 12, lg: 6 }}>
        <Skeleton height={300} radius="md" />
      </Grid.Col>
      <Grid.Col span={{ base: 12, lg: 6 }}>
        <Skeleton height={300} radius="md" />
      </Grid.Col>
    </Grid>
  </Stack>
);

const Dashboard = () => {
  const { data, isLoading, isError, error } = useGetAllAssetsQuery();

  const assets = Array.isArray(data) ? data : (data?.data ?? []);

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Dashboard"
          description="Your asset register at a glance."
        />
        <DashboardSkeleton />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <PageHeader
          title="Dashboard"
          description="Your asset register at a glance."
        />
        <EmptyState
          variant="error"
          title="Could not load dashboard data"
          description={error?.message}
          icon={<IconAlertTriangle size={26} />}
        />
      </>
    );
  }

  const totalValue = assets.reduce(
    (sum, asset) => sum + (Number(asset.purchaseAmount) || 0),
    0,
  );

  const covered = assets.filter(
    (asset) => asset.warranty?.hasWarranty && !isPast(asset.warranty?.endDate),
  );
  const coveragePercent = assets.length
    ? Math.round((covered.length / assets.length) * 100)
    : 0;

  const attention = assets
    .map((asset) => {
      if (asset.warranty?.hasWarranty && isPast(asset.warranty.endDate)) {
        return {
          asset,
          kind: "Warranty expired",
          date: asset.warranty.endDate,
          tone: "red",
        };
      }

      if (asset.hasExpiry && isPast(asset.expiryDate)) {
        return {
          asset,
          kind: "Asset expired",
          date: asset.expiryDate,
          tone: "red",
        };
      }

      if (
        asset.warranty?.hasWarranty &&
        isDueSoon(asset.warranty.endDate, WARRANTY_EXPIRY_WINDOW_DAYS)
      ) {
        return {
          asset,
          kind: "Warranty ending",
          date: asset.warranty.endDate,
          tone: "orange",
        };
      }

      if (asset.hasExpiry && isDueSoon(asset.expiryDate, EXPIRY_WINDOW_DAYS)) {
        return {
          asset,
          kind: "Expiring",
          date: asset.expiryDate,
          tone: "orange",
        };
      }

      return null;
    })
    .filter(Boolean)
    .sort((a, b) => (daysUntil(a.date) ?? 0) - (daysUntil(b.date) ?? 0));

  const recent = [...assets]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your asset register at a glance."
      />

      {!assets.length ? (
        <EmptyState
          title="No assets yet"
          description="Once assets are registered, this dashboard fills in: portfolio value, warranty coverage and everything that needs attention."
          icon={<IconPackage size={26} />}
        />
      ) : (
        <Stack gap="md">
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
            <StatCard
              label="Total assets"
              value={formatNumber(assets.length, "standard")}
              hint="In the register"
              icon={<IconPackage size={18} />}
              tone="orange"
            />

            <StatCard
              label="Portfolio value"
              value={formatAmountCompact(totalValue)}
              hint={`${formatAmount(totalValue)} at purchase`}
              icon={<IconCash size={18} />}
              tone="teal"
            />

            <StatCard
              label="Under warranty"
              value={`${coveragePercent}%`}
              hint={`${covered.length} of ${assets.length} assets`}
              icon={<IconShieldCheck size={18} />}
              tone={coveragePercent >= 50 ? "teal" : "orange"}
            />

            <StatCard
              label="Needs attention"
              value={formatNumber(attention.length, "standard")}
              hint="Expired or expiring soon"
              icon={<IconShieldExclamation size={18} />}
              tone={attention.length ? "red" : "gray"}
            />
          </SimpleGrid>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <SectionCard
                icon={<IconCategory size={16} />}
                title="Assets by category"
                description="Count of assets in each category."
              >
                <BarBreakdown
                  data={breakdownBy(assets, (asset) => asset.category)}
                />
              </SectionCard>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 6 }}>
              <SectionCard
                icon={<IconProgressCheck size={16} />}
                title="Assets by status"
                description="Each bar uses the colour configured for that status."
              >
                <BarBreakdown
                  data={breakdownBy(assets, (asset) => asset.status)}
                />
              </SectionCard>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 6 }}>
              <SectionCard
                icon={<IconSparkles size={16} />}
                title="Assets by condition"
              >
                <BarBreakdown
                  data={breakdownBy(assets, (asset) => asset.condition)}
                />
              </SectionCard>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 6 }}>
              <SectionCard
                icon={<IconMapPin size={16} />}
                title="Assets by location"
              >
                <BarBreakdown
                  data={breakdownBy(assets, (asset) => asset.location, 6)}
                />
              </SectionCard>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 7 }}>
              <SectionCard
                icon={<IconShieldExclamation size={16} />}
                title="Needs attention"
                description="Warranties and expiry dates that have passed or are close."
              >
                {attention.length ? (
                  <Stack gap={0}>
                    {attention
                      .slice(0, 6)
                      .map(({ asset, kind, date, tone }) => (
                        <Group
                          key={`${asset._id}-${kind}`}
                          justify="space-between"
                          wrap="nowrap"
                          gap="sm"
                          py="xs"
                          style={{
                            borderTop:
                              "1px solid var(--mantine-color-default-border)",
                          }}
                        >
                          <Stack gap={2} miw={0}>
                            <Anchor
                              component={Link}
                              to={`/assets/${asset._id}`}
                              fz="sm"
                              fw={600}
                              c="inherit"
                              truncate
                            >
                              {asset.serialNumber ||
                                asset.tag ||
                                "Untitled asset"}
                            </Anchor>
                            <Text fz="xs" c="dimmed" truncate>
                              {asset.subCategory?.title ||
                                asset.category?.title ||
                                "Uncategorised"}
                            </Text>
                          </Stack>

                          <Group
                            gap="xs"
                            wrap="nowrap"
                            style={{ flexShrink: 0 }}
                          >
                            <Text fz="xs" c="dimmed" visibleFrom="sm">
                              {describeDueDate(date)}
                            </Text>

                            <Badge
                              size="sm"
                              color={tone}
                              variant="light"
                              leftSection={<IconAlertTriangle size={11} />}
                            >
                              {kind}
                            </Badge>
                          </Group>
                        </Group>
                      ))}

                    {attention.length > 6 && (
                      <Text fz="xs" c="dimmed" pt="sm">
                        + {attention.length - 6} more
                      </Text>
                    )}
                  </Stack>
                ) : (
                  <Text fz="sm" c="dimmed">
                    Nothing expiring. Every warranty and expiry date is
                    comfortably in the future.
                  </Text>
                )}
              </SectionCard>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 5 }}>
              <SectionCard
                icon={<IconPackage size={16} />}
                title="Recently added"
              >
                <Stack gap={0}>
                  {recent.map((asset) => (
                    <Group
                      key={asset._id}
                      justify="space-between"
                      wrap="nowrap"
                      gap="sm"
                      py="xs"
                      style={{
                        borderTop:
                          "1px solid var(--mantine-color-default-border)",
                      }}
                    >
                      <Stack gap={2} miw={0}>
                        <Anchor
                          component={Link}
                          to={`/assets/${asset._id}`}
                          fz="sm"
                          fw={600}
                          c="inherit"
                          truncate
                        >
                          {asset.serialNumber || asset.tag || "Untitled asset"}
                        </Anchor>
                        <Text fz="xs" c="dimmed">
                          {formatDate(asset.createdAt)}
                        </Text>
                      </Stack>

                      <PicklistBadge item={asset.status} />
                    </Group>
                  ))}
                </Stack>
              </SectionCard>
            </Grid.Col>
          </Grid>
        </Stack>
      )}
    </>
  );
};

export default Dashboard;
