import {
  ActionIcon,
  Badge,
  Box,
  Grid,
  Group,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconArrowsExchange,
  IconArrowsSort,
  IconCash,
  IconChevronDown,
  IconChevronUp,
  IconMapPin,
  IconPackage,
  IconReceipt,
} from "@tabler/icons-react";
import { Fragment, useState } from "react";
import { useGetAssetsSummaryByGroupQuery } from "../../api/asset";
import ColumnChart, { ChartLegend } from "../../components/ColumnChart";
import DonutChart from "../../components/DonutChart";
import EmptyState from "../../components/EmptyState";
import SectionCard from "../../components/SectionCard";
import StatCard from "../../components/StatCard";
import useFilters from "../../hooks/useFilters";
import formatAmount, { formatAmountCompact } from "../../utils/formatAmount";
import formatNumber from "../../utils/formatNumber";
import {
  ASSET_GROUP_OPTIONS,
  DEFAULT_PRIMARY_GROUP,
  DEFAULT_SECONDARY_GROUP,
  groupLabel,
  resolveGroup,
} from "./assetSummaryGroups";

const UNASSIGNED = "Unassigned";

const count = (bucket) => Number(bucket?.count) || 0;
const value = (bucket) => Number(bucket?.purchaseAmount) || 0;
const average = (bucket) => (count(bucket) ? value(bucket) / count(bucket) : 0);

/** Count and value are the two ways to weigh a bucket; both charts follow this choice. */
const METRICS = {
  count: { label: "Count", read: count, format: (amount) => formatNumber(amount, "standard"), axis: (amount) => formatNumber(amount, "compact") },
  value: { label: "Value", read: value, format: formatAmount, axis: formatAmountCompact },
};

/** A numeric column heading that sorts the report by its own figure. */
const SortableHeader = ({ active, direction, onClick, children }) => (
  <UnstyledButton onClick={onClick} w="100%" style={{ cursor: "pointer" }}>
    <Group gap={4} wrap="nowrap" justify="flex-end">
      {children}

      <Box c={active ? undefined : "dimmed"} opacity={active ? 1 : 0.4} style={{ display: "flex", flexShrink: 0 }}>
        {!active ? <IconArrowsSort size={12} /> : direction === "desc" ? <IconChevronDown size={12} /> : <IconChevronUp size={12} />}
      </Box>
    </Group>
  </UnstyledButton>
);

const SummarySkeleton = () => (
  <Stack gap="md">
    <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} height={116} radius="md" />
      ))}
    </SimpleGrid>

    <Grid>
      <Grid.Col span={{ base: 12, lg: 8 }}>
        <Skeleton height={340} radius="md" />
      </Grid.Col>
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <Skeleton height={340} radius="md" />
      </Grid.Col>
    </Grid>

    <Skeleton height={260} radius="md" />
  </Stack>
);

/**
 * The register summarised: headline figures, the two groupings charted against
 * each other, then the full report underneath.
 *
 * Both groupings live in the URL, so a view is shareable and the back button
 * walks through it — nothing about the pairing is baked into the screen.
 */
const AssetSummary = () => {
  const { filters, setFilters } = useFilters();
  const [metric, setMetric] = useState("count");
  const [sort, setSort] = useState({ key: "count", direction: "desc" });

  const primaryGroup = resolveGroup(filters.primaryGroup, DEFAULT_PRIMARY_GROUP);
  const secondaryGroup = resolveGroup(filters.secondaryGroup, DEFAULT_SECONDARY_GROUP);

  const { data, isLoading, isError, error } = useGetAssetsSummaryByGroupQuery({ primaryGroup, secondaryGroup });

  const { read, format, axis } = METRICS[metric];

  const totalCount = Number(data?.totalCount) || 0;
  const totalValue = Number(data?.totalPurchaseAmount) || 0;
  const metricTotal = metric === "count" ? totalCount : totalValue;

  const toRow = (bucket) => ({
    key: bucket._id,
    label: bucket.title || UNASSIGNED,
    color: bucket.color,
    count: count(bucket),
    value: value(bucket),
    average: average(bucket),
  });

  // Sorting a row and its children through the same comparator keeps the report
  // consistent: whatever orders the groups also orders what sits inside them.
  const compare = (a, b) => {
    const delta = a[sort.key] - b[sort.key];

    if (delta !== 0) return sort.direction === "desc" ? -delta : delta;

    return a.label.localeCompare(b.label);
  };

  const rows = (data?.primaryGroupWise ?? [])
    .map((bucket) => ({ ...toRow(bucket), children: (bucket.secondaryGroupWise ?? []).map(toRow).sort(compare) }))
    .sort(compare);

  // One series per secondary value, so every column in the chart shares a legend.
  const series = (data?.secondaryGroupWise ?? [])
    .map((bucket) => ({ key: bucket._id, label: bucket.title || UNASSIGNED, color: bucket.color, value: read(bucket) }))
    .sort((a, b) => b.value - a.value);

  const chartGroups = (data?.primaryGroupWise ?? [])
    .map((bucket) => ({
      key: bucket._id,
      label: bucket.title || UNASSIGNED,
      total: read(bucket),
      values: Object.fromEntries((bucket.secondaryGroupWise ?? []).map((cell) => [cell._id, read(cell)])),
    }))
    .sort((a, b) => b.total - a.total);

  const largest = chartGroups[0];

  const toggleSort = (key) =>
    setSort((current) => (current.key === key ? { key, direction: current.direction === "desc" ? "asc" : "desc" } : { key, direction: "desc" }));

  const swap = () => setFilters({ primaryGroup: secondaryGroup, secondaryGroup: primaryGroup });

  const controls = (
    <Paper p="md">
      <Group gap="sm" align="flex-end" wrap="wrap">
        <Select
          label="Group by"
          data={ASSET_GROUP_OPTIONS}
          value={primaryGroup}
          onChange={(next) => next && setFilters({ primaryGroup: next, ...(next === secondaryGroup && { secondaryGroup: primaryGroup }) })}
          searchable={false}
          w={{ base: "100%", xs: 190 }}
        />

        <Tooltip label="Swap groupings" withArrow>
          <ActionIcon size="lg" variant="default" mb={2} onClick={swap} aria-label="Swap groupings">
            <IconArrowsExchange size={18} />
          </ActionIcon>
        </Tooltip>

        <Select
          label="Then by"
          data={ASSET_GROUP_OPTIONS.filter((option) => option.value !== primaryGroup)}
          value={secondaryGroup}
          onChange={(next) => next && setFilters({ secondaryGroup: next })}
          searchable={false}
          w={{ base: "100%", xs: 190 }}
        />

        <SegmentedControl
          value={metric}
          onChange={setMetric}
          data={Object.entries(METRICS).map(([key, { label }]) => ({ value: key, label }))}
          ml={{ base: 0, sm: "auto" }}
        />
      </Group>
    </Paper>
  );

  if (isError) {
    return (
      <Stack gap="md">
        {controls}

        <EmptyState
          variant="error"
          title="Could not load the summary"
          description={error?.response?.data?.message || error?.message}
          icon={<IconAlertTriangle size={26} />}
        />
      </Stack>
    );
  }

  if (isLoading) {
    return (
      <Stack gap="md">
        {controls}
        <SummarySkeleton />
      </Stack>
    );
  }

  if (!rows.length) {
    return (
      <Stack gap="md">
        {controls}

        <EmptyState
          title="Nothing to summarise yet"
          description={`No assets carry a ${groupLabel(primaryGroup).toLowerCase()} value, so there is nothing to group.`}
          icon={<IconPackage size={26} />}
        />
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      {controls}

      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        <StatCard
          label="Total assets"
          value={formatNumber(totalCount, "standard")}
          hint={`In ${rows.length} ${groupLabel(primaryGroup).toLowerCase()} ${rows.length === 1 ? "group" : "groups"}`}
          icon={<IconPackage size={18} />}
          tone="orange"
        />

        <StatCard
          label="Purchase value"
          value={formatAmountCompact(totalValue)}
          hint={`${formatAmount(totalValue)} at purchase`}
          icon={<IconCash size={18} />}
          tone="teal"
        />

        <StatCard
          label="Average per asset"
          value={formatAmountCompact(totalCount ? totalValue / totalCount : 0)}
          hint="Across the register"
          icon={<IconReceipt size={18} />}
          tone="grape"
        />

        <StatCard
          label={`Largest ${groupLabel(primaryGroup).toLowerCase()}`}
          value={largest?.label ?? "—"}
          hint={metricTotal ? `${format(largest.total)} · ${Math.round((largest.total / metricTotal) * 100)}% of total` : "No assets yet"}
          icon={<IconMapPin size={18} />}
          tone="blue"
        />
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <SectionCard
            title={`${groupLabel(primaryGroup)} by ${groupLabel(secondaryGroup).toLowerCase()}`}
            h="100%"
            actions={<ChartLegend series={series} />}
          >
            <ColumnChart groups={chartGroups} series={series} valueFormatter={axis} height={260} minStep={metric === "count" ? 1 : 1000} />
          </SectionCard>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <SectionCard title={`Split by ${groupLabel(secondaryGroup).toLowerCase()}`} h="100%">
            <Stack gap="lg" align="center">
              <DonutChart data={series} size={190} centerValue={axis(metricTotal)} centerLabel={metric === "count" ? "assets" : "at purchase"} />

              <Stack gap="xs" w="100%">
                {series.map((slice) => (
                  <Group key={slice.key} gap="xs" wrap="nowrap">
                    <Box w={8} h={8} style={{ borderRadius: 999, background: `var(--mantine-color-${slice.color || "gray"}-6)`, flexShrink: 0 }} />

                    <Text fz="sm" tt="capitalize" truncate flex={1}>
                      {slice.label}
                    </Text>

                    <Text fz="sm" fw={600} style={{ flexShrink: 0 }}>
                      {format(slice.value)}
                    </Text>

                    <Text fz="xs" c="dimmed" w={38} ta="right" style={{ flexShrink: 0 }}>
                      {Math.round(metricTotal ? (slice.value / metricTotal) * 100 : 0)}%
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </SectionCard>
        </Grid.Col>
      </Grid>

      <SectionCard
        title={`${groupLabel(primaryGroup)} × ${groupLabel(secondaryGroup)}`}
        actions={
          <Text fz="xs" c="dimmed">
            {rows.length} groups · {series.length} {groupLabel(secondaryGroup).toLowerCase()} values
          </Text>
        }
      >
        <Table.ScrollContainer minWidth={720}>
          <Table withRowBorders={false} highlightOnHover verticalSpacing="xs" horizontalSpacing="sm" style={{ fontVariantNumeric: "tabular-nums" }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={240}>{groupLabel(primaryGroup)}</Table.Th>

                <Table.Th w={110}>
                  <SortableHeader active={sort.key === "count"} direction={sort.direction} onClick={() => toggleSort("count")}>
                    Assets
                  </SortableHeader>
                </Table.Th>

                <Table.Th w={170} ta="right">
                  Share
                </Table.Th>

                <Table.Th w={160}>
                  <SortableHeader active={sort.key === "value"} direction={sort.direction} onClick={() => toggleSort("value")}>
                    Purchase value
                  </SortableHeader>
                </Table.Th>

                <Table.Th w={150}>
                  <SortableHeader active={sort.key === "average"} direction={sort.direction} onClick={() => toggleSort("average")}>
                    Average
                  </SortableHeader>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {rows.map((row, index) => (
                <Fragment key={row.key}>
                  {/* The rule sits on the group row, so each block reads as one unit
                      instead of every line being boxed off from its neighbours. */}
                  <Table.Tr style={index ? { borderTop: "1px solid var(--mantine-color-default-border)" } : undefined}>
                    <Table.Td>
                      <Badge variant="light" size="sm" color={row.color || "gray"} tt="capitalize">
                        {row.label}
                      </Badge>
                    </Table.Td>

                    <Table.Td ta="right" fw={650}>
                      {formatNumber(row.count, "standard")}
                    </Table.Td>

                    <Table.Td>
                      <Group gap={10} wrap="nowrap" justify="flex-end">
                        <Box flex={1} h={6} miw={44} maw={90} style={{ background: "var(--viz-grid)", borderRadius: 999, overflow: "hidden" }}>
                          <Box
                            h="100%"
                            w={`${totalCount ? Math.max((row.count / totalCount) * 100, row.count > 0 ? 2 : 0) : 0}%`}
                            style={{ background: "var(--viz-fill)", borderRadius: "0 4px 4px 0", transition: "width 320ms cubic-bezier(0.32, 0.72, 0, 1)" }}
                          />
                        </Box>

                        <Text fz="xs" c="dimmed" w={32} ta="right" style={{ flexShrink: 0 }}>
                          {Math.round(totalCount ? (row.count / totalCount) * 100 : 0)}%
                        </Text>
                      </Group>
                    </Table.Td>

                    <Table.Td ta="right" fw={650}>
                      {formatAmount(row.value)}
                    </Table.Td>

                    <Table.Td ta="right">{formatAmount(row.average)}</Table.Td>
                  </Table.Tr>

                  {row.children.map((child) => (
                    <Table.Tr key={`${row.key}-${child.key}`}>
                      <Table.Td pl={28}>
                        <Group gap={8} wrap="nowrap">
                          <Box w={10} h={1} bg="var(--mantine-color-default-border)" style={{ flexShrink: 0 }} />

                          <Badge variant="dot" size="sm" color={child.color || "gray"} tt="capitalize" fw={500}>
                            {child.label}
                          </Badge>
                        </Group>
                      </Table.Td>

                      <Table.Td ta="right" c="dimmed">
                        {formatNumber(child.count, "standard")}
                      </Table.Td>

                      <Table.Td ta="right">
                        <Text fz="xs" c="dimmed">
                          {Math.round(row.count ? (child.count / row.count) * 100 : 0)}% of {row.label}
                        </Text>
                      </Table.Td>

                      <Table.Td ta="right" c="dimmed">
                        {formatAmount(child.value)}
                      </Table.Td>

                      <Table.Td ta="right" c="dimmed">
                        {formatAmount(child.average)}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Fragment>
              ))}
            </Table.Tbody>

            <Table.Tfoot style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}>
              <Table.Tr>
                <Table.Th>Total</Table.Th>
                <Table.Th ta="right">{formatNumber(totalCount, "standard")}</Table.Th>
                <Table.Th />
                <Table.Th ta="right">{formatAmount(totalValue)}</Table.Th>
                <Table.Th ta="right">{formatAmount(totalCount ? totalValue / totalCount : 0)}</Table.Th>
              </Table.Tr>
            </Table.Tfoot>
          </Table>
        </Table.ScrollContainer>
      </SectionCard>
    </Stack>
  );
};

export default AssetSummary;
