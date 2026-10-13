import { Anchor, Grid, Paper, Progress, SimpleGrid, Skeleton, Stack, Table, Text, ThemeIcon, Group } from "@mantine/core";
import {
  IconAlertTriangle,
  IconCalendarEvent,
  IconCash,
  IconClockHour4,
  IconInfoCircle,
  IconPackage,
  IconPercentage,
  IconReceipt,
  IconRecycle,
  IconTable,
  IconTrendingDown,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useDeleteDepreciationMutation, useGetDepreciationByIdQuery } from "../../api/depreciation";
import DataField from "../../components/DataField";
import DeleteItemButton from "../../components/DeleteItemButton";
import EmptyState from "../../components/EmptyState";
import InfoList from "../../components/InfoList";
import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";
import StatCard from "../../components/StatCard";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import DepreciationMethodBadge from "./DepreciationMethodBadge";
import { buildMonthlySchedule, currentBookValue, monthsElapsed, toYearlySchedule } from "./depreciationSchedule";
import EditDepreciationButton from "./EditDepreciationButton";
import useAssetLookup from "./useAssetLookup";

const headingStyle = { letterSpacing: "0.05em" };

const formatLife = (months) => (months ? `${months} ${months === 1 ? "month" : "months"}` : "—");

const formatRate = (rate) => (rate === null || rate === undefined || rate === "" ? "—" : `${rate}%`);

const DepreciationDetailsSkeleton = () => (
  <Stack gap="md">
    <Skeleton height={34} width={260} radius="sm" />
    <Skeleton height={88} radius="md" />
    <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} height={116} radius="md" />
      ))}
    </SimpleGrid>
    <Grid>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Skeleton height={300} radius="md" />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Skeleton height={300} radius="md" />
      </Grid.Col>
    </Grid>
  </Stack>
);

const ScheduleTable = ({ years, elapsed }) => (
  <Table.ScrollContainer minWidth={560} type="native">
    <Table verticalSpacing="xs" horizontalSpacing="sm" highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          {["Year", "Period", "Opening", "Depreciation", "Closing"].map((heading) => (
            <Table.Th key={heading} fz="xs" fw={650} c="dimmed" tt="uppercase" style={headingStyle} ta={heading === "Year" || heading === "Period" ? "left" : "right"}>
              {heading}
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {years.map((row) => {
          const firstMonth = (row.year - 1) * 12 + 1;
          const isCurrent = elapsed >= firstMonth && elapsed < firstMonth + row.months;

          return (
            <Table.Tr key={row.year} bg={isCurrent ? "var(--mantine-primary-color-light)" : undefined}>
              <Table.Td fz="sm" fw={600}>
                Year {row.year}
              </Table.Td>
              <Table.Td fz="sm" c="dimmed" style={{ whiteSpace: "nowrap" }}>
                {row.from ? `${formatDate(row.from, "MMM YYYY")} – ${formatDate(row.to, "MMM YYYY")}` : `${row.months} months`}
              </Table.Td>
              <Table.Td fz="sm" ta="right">
                {formatAmount(row.opening)}
              </Table.Td>
              <Table.Td fz="sm" ta="right" c="red.7">
                −{formatAmount(row.depreciation)}
              </Table.Td>
              <Table.Td fz="sm" ta="right" fw={600}>
                {formatAmount(row.closing)}
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  </Table.ScrollContainer>
);

const DepreciationDetails = () => {
  const { id } = useParams();

  const { data: depreciation, isLoading, isError, error } = useGetDepreciationByIdQuery(id);
  const lookupAsset = useAssetLookup();

  const monthly = useMemo(() => (depreciation ? buildMonthlySchedule(depreciation) : []), [depreciation]);
  const years = useMemo(() => toYearlySchedule(monthly), [monthly]);

  if (isLoading) return <DepreciationDetailsSkeleton />;

  if (isError || !depreciation) {
    return (
      <>
        <PageHeader
          title="Depreciation"
          backTo="/depreciations"
          breadcrumbs={[{ label: "Depreciations", to: "/depreciations" }, { label: "Not found" }]}
        />

        <EmptyState
          variant="error"
          title="This depreciation could not be loaded"
          description={error?.response?.data?.message || error?.message || "It may have been deleted, or you may not have access to it."}
          icon={<IconAlertTriangle size={26} />}
        />
      </>
    );
  }

  const asset = lookupAsset(depreciation.asset);
  const title = asset?.serialNumber || "Depreciation";

  const cost = Number(depreciation.acquisitionCost) || 0;
  const salvage = Number(depreciation.salvageValue) || 0;
  const bookValue = currentBookValue(depreciation, monthly);
  const depreciatedSoFar = cost - bookValue;
  const depreciable = cost - salvage;
  const progress = depreciable > 0 ? Math.min((depreciatedSoFar / depreciable) * 100, 100) : 0;

  const elapsed = monthsElapsed(depreciation.startDate, depreciation.usefulLifeMonths);
  const totalMonths = Number(depreciation.usefulLifeMonths) || 0;
  const hasStarted = depreciation.startDate && !dayjs(depreciation.startDate).isAfter(dayjs(), "day");
  const endDate = depreciation.startDate && totalMonths ? dayjs(depreciation.startDate).add(totalMonths, "month").subtract(1, "day") : null;

  const details = [
    {
      icon: <IconPackage size={18} />,
      label: "asset",
      children: asset ? (
        <Anchor component={Link} to={`/assets/${asset._id}`} fz="sm" fw={600}>
          {asset.serialNumber || "View asset"}
        </Anchor>
      ) : (
        "No asset linked"
      ),
    },
    { icon: <IconTrendingDown size={18} />, label: "method", children: <DepreciationMethodBadge method={depreciation.method} /> },
    { icon: <IconPercentage size={18} />, label: "rate", children: formatRate(depreciation.depreciationRate) },
    { icon: <IconClockHour4 size={18} />, label: "useful life", children: formatLife(depreciation.usefulLifeMonths) },
    { icon: <IconCalendarEvent size={18} />, label: "start date", children: formatDate(depreciation.startDate) },
    { icon: <IconCalendarEvent size={18} />, label: "end date", children: formatDate(endDate) },
  ];

  return (
    <Stack gap="md">
      <PageHeader
        backTo="/depreciations"
        breadcrumbs={[{ label: "Depreciations", to: "/depreciations" }, { label: title }]}
        title={title}
        meta={<DepreciationMethodBadge method={depreciation.method} />}
        actions={
          <>
            <EditDepreciationButton depreciation={depreciation} />

            <DeleteItemButton
              resource="depreciation"
              label="depreciation"
              mutationHook={useDeleteDepreciationMutation}
              itemId={depreciation._id}
              navigateTo="/depreciations"
              variant="button"
              buttonText="Delete"
            />
          </>
        }
      />

      {/* Progress strip — how far through its useful life the asset is. */}
      <Paper p="md">
        <Group gap="md" wrap="nowrap" align="center">
          <ThemeIcon size={48} radius="md" variant="light">
            <IconTrendingDown size={24} />
          </ThemeIcon>

          <Stack gap={6} flex={1} miw={0}>
            <Group justify="space-between" gap="xs" wrap="wrap">
              <Text fz="sm" fw={600}>
                {hasStarted ? `${elapsed} of ${totalMonths} months elapsed` : `Starts ${formatDate(depreciation.startDate)}`}
              </Text>

              <Text fz="sm" c="dimmed">
                {Math.round(progress)}% depreciated
              </Text>
            </Group>

            <Progress value={progress} size="md" radius="xl" aria-label="Share of depreciable amount written off" />
          </Stack>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        <StatCard label="Acquisition cost" value={formatAmount(cost)} hint={`From ${formatDate(depreciation.startDate)}`} icon={<IconCash size={18} />} tone="orange" />

        <StatCard label="Current book value" value={formatAmount(bookValue)} hint="Estimated as of today" icon={<IconReceipt size={18} />} tone="teal" />

        <StatCard label="Depreciated so far" value={formatAmount(depreciatedSoFar)} hint={`of ${formatAmount(depreciable)} depreciable`} icon={<IconTrendingDown size={18} />} tone="red" />

        <StatCard label="Salvage value" value={formatAmount(salvage)} hint={endDate ? `At ${formatDate(endDate)}` : "End of useful life"} icon={<IconRecycle size={18} />} tone="gray" />
      </SimpleGrid>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            <SectionCard icon={<IconInfoCircle size={16} />} title="Details" padding="xs">
              <InfoList p="xs" withBorder={false}>
                {details.map((item) => (
                  <InfoList.Item key={item.label} icon={item.icon} label={item.label}>
                    {item.children}
                  </InfoList.Item>
                ))}
              </InfoList>
            </SectionCard>

            <SectionCard icon={<IconClockHour4 size={16} />} title="Record">
              <SimpleGrid cols={2} spacing="md">
                <DataField label="Created">{formatDate(depreciation.createdAt)}</DataField>
                <DataField label="Updated">{formatDate(depreciation.updatedAt)}</DataField>
              </SimpleGrid>
            </SectionCard>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <SectionCard
            icon={<IconTable size={16} />}
            title="Projected schedule"
            description="Estimated year by year from the values above. The current year is highlighted."
          >
            {years.length ? (
              <ScheduleTable years={years} elapsed={elapsed} />
            ) : (
              <Text fz="sm" c="dimmed">
                Set a useful life to see the schedule.
              </Text>
            )}
          </SectionCard>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default DepreciationDetails;
