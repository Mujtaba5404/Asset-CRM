import { Anchor, Badge, Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { useGetMaintenanceWithPaginationQuery } from "../../api/maintenance";
import PaginatedTable from "../../components/PaginatedTable";
import PicklistBadge from "../../components/PicklistBadge";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import MaintenanceStatusBadge from "./MaintenanceStatusBadge";
import MaintenanceTableRowMenu from "./MaintenanceTableRowMenu";

const photoCount = (row) => (row.conditionBefore?.length || 0) + (row.conditionAfter?.length || 0);

const Dash = () => (
  <Text fz="sm" c="dimmed">
    —
  </Text>
);

const TwoLine = ({ top, bottom }) => (
  <Stack gap={0} miw={0}>
    <Text fz="sm" fw={500} tt="capitalize" truncate>
      {top || "—"}
    </Text>
    <Text fz="xs" c="dimmed" tt="capitalize" truncate>
      {bottom || "—"}
    </Text>
  </Stack>
);

const AssetLink = ({ asset }) =>
  asset?._id ? (
    <Stack gap={0} miw={0}>
      <Anchor component={Link} to={`/assets/${asset._id}`} fz="sm" fw={600} c="inherit" truncate>
        {asset.serialNumber || "—"}
      </Anchor>
      <Text fz="xs" c="dimmed" truncate>
        {asset.tag || "No tag"}
      </Text>
    </Stack>
  ) : (
    <Dash />
  );

const MAINTENANCE_COLUMNS = [
  {
    accessor: "asset",
    title: "Asset",
    width: 200,
    noWrap: true,
    render: (row) => <AssetLink asset={row.asset} />,
  },
  {
    accessor: "type",
    title: "Type",
    width: 160,
    render: (row) => (
      <Anchor component={Link} to={`/maintenance/${row._id}`} c="inherit" underline="never">
        <TwoLine top={row.type?.title} bottom={row.vendor?.title || "No vendor"} />
      </Anchor>
    ),
  },
  {
    accessor: "status",
    title: "Status",
    width: 140,
    textAlign: "center",
    sortable: true,
    render: (row) => <MaintenanceStatusBadge status={row.status} />,
  },
  {
    accessor: "priority",
    title: "Priority",
    width: 120,
    textAlign: "center",
    render: (row) => <PicklistBadge item={row.priority} />,
  },
  {
    accessor: "startDate",
    title: "Schedule",
    width: 160,
    sortable: true,
    render: (row) => <TwoLine top={formatDate(row.startDate)} bottom={row.endDate ? `Ends ${formatDate(row.endDate)}` : "Open"} />,
  },
  {
    accessor: "photos",
    title: "Photos",
    width: 110,
    textAlign: "center",
    render: (row) => (photoCount(row) ? <TwoLine top={`${row.conditionBefore?.length || 0} before`} bottom={`${row.conditionAfter?.length || 0} after`} /> : <Dash />),
  },
  {
    accessor: "checklist",
    title: "Checklist",
    width: 200,
    render: (row) =>
      row.checklist?.length ? (
        <Group gap={4}>
          {row.checklist.map((check, index) => (
            <Badge key={index} variant="light" color={check.condition?.color || "gray"} tt="capitalize">
              {check.item?.title || "—"}
            </Badge>
          ))}
        </Group>
      ) : (
        <Dash />
      ),
  },
  {
    accessor: "cost",
    title: "Cost",
    width: 140,
    sortable: true,
    render: (row) => formatAmount(row.cost || 0),
  },
  {
    accessor: "createdAt",
    title: "Logged",
    width: 130,
    textAlign: "center",
    sortable: true,
    render: (row) => formatDate(row.createdAt),
  },
  {
    accessor: "menu",
    title: "Menu",
    width: 80,
    textAlign: "center",
    render: (row) => <MaintenanceTableRowMenu maintenance={row} />,
  },
];

/** Phone-sized representation of one maintenance job. */
const MaintenanceCard = ({ row }) => (
  <Paper p="sm">
    <Stack gap="sm">
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <Stack gap={4} miw={0}>
          <Text component={Link} to={`/maintenance/${row._id}`} fz="sm" fw={600} c="inherit" tt="capitalize" truncate style={{ textDecoration: "none" }}>
            {row.type?.title || "Maintenance job"}
          </Text>

          <Text fz="xs" c="dimmed" truncate>
            {[row.asset?.serialNumber, row.vendor?.title].filter(Boolean).join(" · ") || "No asset"}
          </Text>
        </Stack>

        <MaintenanceTableRowMenu maintenance={row} />
      </Group>

      <Group gap={6}>
        <MaintenanceStatusBadge status={row.status} />
        {row.priority?.title && <PicklistBadge item={row.priority} />}

        {photoCount(row) > 0 && (
          <Badge size="sm" variant="light" color="gray">
            {photoCount(row)} photos
          </Badge>
        )}
      </Group>

      <SimpleGrid cols={3} spacing="xs">
        <TwoLine top={formatAmount(row.cost || 0)} bottom="Cost" />
        <TwoLine top={formatDate(row.startDate)} bottom="Started" />
        <TwoLine top={row.endDate ? formatDate(row.endDate) : "Open"} bottom="Ends" />
      </SimpleGrid>
    </Stack>
  </Paper>
);

/** `query` locks the list to a subset (e.g. one asset's jobs). */
const MaintenanceTable = ({ query, hideColumns = [], emptyAction }) => (
  <PaginatedTable
    queryHook={useGetMaintenanceWithPaginationQuery}
    columns={MAINTENANCE_COLUMNS}
    queryParams={query}
    hideColumns={hideColumns}
    renderCard={(row) => <MaintenanceCard row={row} />}
    emptyTitle="No maintenance jobs yet"
    emptyDescription="Log a service job to track its checks, cost and the asset's condition before and after."
    emptyAction={emptyAction}
    tableProps={{ pinFirstColumn: true }}
  />
);

export default MaintenanceTable;
