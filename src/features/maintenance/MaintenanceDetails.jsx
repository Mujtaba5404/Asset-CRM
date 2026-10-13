import { Anchor, Grid, Group, SimpleGrid, Skeleton, Stack, Table, Text } from "@mantine/core";
import {
  IconAlertTriangle,
  IconCalendarEvent,
  IconCalendarCheck,
  IconCash,
  IconChecklist,
  IconClockHour4,
  IconFlag,
  IconInfoCircle,
  IconNote,
  IconPackage,
  IconPhoto,
  IconTag,
  IconTool,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import { useDeleteMaintenanceMutation, useGetMaintenanceByIdQuery } from "../../api/maintenance";
import DataField from "../../components/DataField";
import DeleteItemButton from "../../components/DeleteItemButton";
import EmptyState from "../../components/EmptyState";
import InfoList from "../../components/InfoList";
import PageHeader from "../../components/PageHeader";
import PicklistBadge from "../../components/PicklistBadge";
import SectionCard from "../../components/SectionCard";
import StatCard from "../../components/StatCard";
import capitalizeLetters from "../../utils/capitalizeLetters";
import { daysUntil } from "../../utils/dateValue";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import CompleteMaintenanceButton from "./CompleteMaintenanceButton";
import ConditionGallery from "./ConditionGallery";
import EditMaintenanceButton from "./EditMaintenanceButton";
import { isCompleted } from "./maintenanceForm";
import MaintenanceStatusBadge from "./MaintenanceStatusBadge";

const headingStyle = { letterSpacing: "0.05em" };

const pluralize = (count, word) => `${count} ${count === 1 ? word : `${word}s`}`;

const MaintenanceDetailsSkeleton = () => (
  <Stack gap="md">
    <Skeleton height={34} width={260} radius="sm" />
    <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} height={116} radius="md" />
      ))}
    </SimpleGrid>
    <Grid>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Skeleton height={320} radius="md" />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Skeleton height={320} radius="md" />
      </Grid.Col>
    </Grid>
  </Stack>
);

const ChecklistTable = ({ checklist }) => (
  <Table.ScrollContainer minWidth={360} type="native">
    <Table verticalSpacing="xs" highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          {["Item", "Condition"].map((heading) => (
            <Table.Th key={heading} fz="xs" fw={650} c="dimmed" tt="uppercase" style={headingStyle}>
              {heading}
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {checklist.map((row, index) => (
          <Table.Tr key={row._id || index}>
            <Table.Td>
              <Text fz="sm" fw={500} tt="capitalize">
                {row.item?.title || "—"}
              </Text>
            </Table.Td>

            <Table.Td>
              <PicklistBadge item={row.condition} />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </Table.ScrollContainer>
);

const MaintenanceDetails = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useGetMaintenanceByIdQuery(id);

  if (isLoading) return <MaintenanceDetailsSkeleton />;

  if (isError || !data) {
    return (
      <>
        <PageHeader title="Maintenance" backTo="/maintenance" breadcrumbs={[{ label: "Maintenance", to: "/maintenance" }, { label: "Not found" }]} />

        <EmptyState
          variant="error"
          title="This maintenance job could not be loaded"
          description={error?.response?.data?.message || error?.message || "It may have been deleted, or you may not have access to it."}
          icon={<IconAlertTriangle size={26} />}
        />
      </>
    );
  }

  const asset = typeof data.asset === "object" ? data.asset : null;
  const checklist = data.checklist || [];
  const photosBefore = data.conditionBefore || [];
  const photosAfter = data.conditionAfter || [];
  const photoCount = photosBefore.length + photosAfter.length;
  const completed = isCompleted(data.status);

  // Inclusive day count from start to end (or to today while the job is open).
  const daysSinceStart = data.startDate ? -1 * (daysUntil(data.startDate) ?? 0) : null;
  const duration = data.startDate && data.endDate ? daysUntil(data.endDate) - daysUntil(data.startDate) + 1 : null;

  const title = capitalizeLetters(data.type?.title || "Maintenance job");

  const details = [
    {
      icon: <IconPackage size={18} />,
      label: "asset",
      children: asset ? (
        <Anchor component={Link} to={`/assets/${asset._id}`} fz="sm" fw={600}>
          {asset.serialNumber || "View asset"}
        </Anchor>
      ) : undefined,
    },
    { icon: <IconTag size={18} />, label: "asset tag", children: asset?.tag },
    { icon: <IconTool size={18} />, label: "type", children: <PicklistBadge item={data.type} /> },
    { icon: <IconFlag size={18} />, label: "priority", children: <PicklistBadge item={data.priority} /> },
    { icon: <IconTruckDelivery size={18} />, label: "vendor", children: <PicklistBadge item={data.vendor} /> },
    { icon: <IconCalendarEvent size={18} />, label: "start date", children: formatDate(data.startDate) },
    { icon: <IconCalendarCheck size={18} />, label: "end date", children: data.endDate ? formatDate(data.endDate) : "Open" },
  ];

  return (
    <Stack gap="md">
      <PageHeader
        backTo="/maintenance"
        breadcrumbs={[{ label: "Maintenance", to: "/maintenance" }, { label: asset?.serialNumber || title }]}
        title={title}
        meta={
          <Group gap="xs">
            <MaintenanceStatusBadge status={data.status} size="md" />
            {data.priority?.title && <PicklistBadge item={data.priority} size="md" variant="outline" />}
          </Group>
        }
        actions={
          <>
            <CompleteMaintenanceButton maintenance={data} />

            <EditMaintenanceButton maintenance={data} />

            <DeleteItemButton
              resource="maintenance"
              label="maintenance job"
              mutationHook={useDeleteMaintenanceMutation}
              itemId={data._id}
              navigateTo="/maintenance"
              variant="button"
              buttonText="Delete"
            />
          </>
        }
      />

      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        <StatCard label="Total cost" value={formatAmount(data.cost || 0)} hint={data.vendor?.title ? `Vendor · ${capitalizeLetters(data.vendor.title)}` : "No vendor"} icon={<IconCash size={18} />} tone="orange" />

        <StatCard
          label="Duration"
          value={duration !== null ? pluralize(duration, "day") : "Open"}
          hint={duration !== null ? "Start to completion" : daysSinceStart !== null && daysSinceStart >= 0 ? `In progress for ${pluralize(daysSinceStart, "day")}` : "Not started"}
          icon={<IconClockHour4 size={18} />}
          tone={completed ? "teal" : "blue"}
        />

        <StatCard label="Checklist" value={pluralize(checklist.length, "check")} hint={checklist.length ? "Inspected items" : "Nothing inspected"} icon={<IconChecklist size={18} />} tone="gray" />

        <StatCard label="Condition photos" value={photoCount} hint={`${photosBefore.length} before · ${photosAfter.length} after`} icon={<IconPhoto size={18} />} tone="gray" />
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

            <SectionCard icon={<IconNote size={16} />} title="Notes">
              <Text fz="sm" style={{ whiteSpace: "pre-wrap" }} c={data.notes ? undefined : "dimmed"}>
                {data.notes ? capitalizeLetters(data.notes) : "No notes added."}
              </Text>
            </SectionCard>

            <SectionCard icon={<IconClockHour4 size={16} />} title="Record">
              <SimpleGrid cols={2} spacing="md">
                <DataField label="Logged">{formatDate(data.createdAt)}</DataField>
                <DataField label="Updated">{formatDate(data.updatedAt)}</DataField>
              </SimpleGrid>
            </SectionCard>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <SectionCard
              icon={<IconPhoto size={16} />}
              title="Asset condition"
              actions={
                <Text fz="xs" c="dimmed">
                  {pluralize(photoCount, "photo")}
                </Text>
              }
            >
              <ConditionGallery before={photosBefore} after={photosAfter} completed={completed} />
            </SectionCard>

            <SectionCard
              icon={<IconChecklist size={16} />}
              title="Inspection checklist"
              actions={
                <Text fz="xs" c="dimmed">
                  {pluralize(checklist.length, "item")}
                </Text>
              }
            >
              {checklist.length ? (
                <ChecklistTable checklist={checklist} />
              ) : (
                <Text fz="sm" c="dimmed">
                  Nothing inspected.
                </Text>
              )}
            </SectionCard>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default MaintenanceDetails;
