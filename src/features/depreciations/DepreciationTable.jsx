import { Anchor, Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconTrendingDown } from "@tabler/icons-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetDepreciationsWithPaginationQuery } from "../../api/depreciation";
import PaginatedTable from "../../components/PaginatedTable";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import DepreciationMethodBadge from "./DepreciationMethodBadge";
import DepreciationTableRowMenu from "./DepreciationTableRowMenu";
import useAssetLookup from "./useAssetLookup";

const TwoLine = ({ top, bottom }) => (
  <Stack gap={0} miw={0}>
    <Text fz="sm" fw={500} truncate>
      {top || "—"}
    </Text>
    <Text fz="xs" c="dimmed" truncate>
      {bottom || "—"}
    </Text>
  </Stack>
);

const AssetName = ({ asset }) =>
  asset ? (
    <Anchor component={Link} to={`/assets/${asset._id}`} fz="sm" fw={600} c="inherit" truncate>
      {asset.serialNumber || "—"}
    </Anchor>
  ) : (
    <Text fz="sm" c="dimmed">
      No asset
    </Text>
  );

const formatLife = (months) => (months ? `${months} ${months === 1 ? "month" : "months"}` : "—");

const formatRate = (rate) => (rate === null || rate === undefined || rate === "" ? "—" : `${rate}%`);

const buildColumns = (lookupAsset) => [
  {
    accessor: "asset",
    title: "Asset",
    width: 240,
    noWrap: true,
    render: (depreciation) => (
      <Group gap="sm" wrap="nowrap" miw={0}>
        <ThemeIcon size={34} radius="md" variant="light">
          <IconTrendingDown size={18} />
        </ThemeIcon>

        <AssetName asset={lookupAsset(depreciation.asset)} />
      </Group>
    ),
  },
  {
    accessor: "method",
    title: "Method",
    width: 170,
    sortable: true,
    render: (depreciation) => <DepreciationMethodBadge method={depreciation.method} />,
  },
  {
    accessor: "acquisitionCost",
    title: "Acquisition cost",
    width: 160,
    sortable: true,
    render: (depreciation) => formatAmount(depreciation.acquisitionCost || 0),
  },
  {
    accessor: "salvageValue",
    title: "Salvage value",
    width: 150,
    sortable: true,
    render: (depreciation) => formatAmount(depreciation.salvageValue || 0),
  },
  {
    accessor: "usefulLifeMonths",
    title: "Useful life",
    width: 130,
    textAlign: "center",
    sortable: true,
    render: (depreciation) => formatLife(depreciation.usefulLifeMonths),
  },
  {
    accessor: "depreciationRate",
    title: "Rate",
    width: 100,
    textAlign: "center",
    sortable: true,
    render: (depreciation) => formatRate(depreciation.depreciationRate),
  },
  {
    accessor: "startDate",
    title: "Start date",
    width: 130,
    textAlign: "center",
    sortable: true,
    render: (depreciation) => formatDate(depreciation.startDate),
  },
  {
    accessor: "createdAt",
    title: "Created",
    width: 130,
    textAlign: "center",
    sortable: true,
    render: (depreciation) => formatDate(depreciation.createdAt),
  },
  {
    accessor: "menu",
    title: "Menu",
    width: 80,
    textAlign: "center",
    render: (depreciation) => <DepreciationTableRowMenu depreciation={depreciation} />,
  },
];

/** Phone-sized representation of one depreciation row. */
const DepreciationCard = ({ depreciation, asset }) => (
  <Paper p="sm">
    <Stack gap={8}>
      <Group justify="space-between" wrap="nowrap" gap="xs" align="flex-start">
        <Stack gap={4} miw={0}>
          <AssetName asset={asset} />
          <DepreciationMethodBadge method={depreciation.method} />
        </Stack>

        <DepreciationTableRowMenu depreciation={depreciation} />
      </Group>

      <Group grow gap="xs" align="flex-start">
        <TwoLine top={formatAmount(depreciation.acquisitionCost || 0)} bottom="Acquisition cost" />
        <TwoLine top={formatAmount(depreciation.salvageValue || 0)} bottom="Salvage value" />
      </Group>

      <Group grow gap="xs" align="flex-start">
        <TwoLine top={formatLife(depreciation.usefulLifeMonths)} bottom={`Rate ${formatRate(depreciation.depreciationRate)}`} />
        <TwoLine top={formatDate(depreciation.startDate)} bottom="Start date" />
      </Group>
    </Stack>
  </Paper>
);

const DepreciationTable = ({ query, hideColumns = [], emptyAction }) => {
  const lookupAsset = useAssetLookup();
  const columns = useMemo(() => buildColumns(lookupAsset), [lookupAsset]);

  return (
    <PaginatedTable
      queryHook={useGetDepreciationsWithPaginationQuery}
      columns={columns}
      queryParams={query}
      hideColumns={hideColumns}
      renderCard={(depreciation) => <DepreciationCard depreciation={depreciation} asset={lookupAsset(depreciation.asset)} />}
      emptyTitle="No depreciations yet"
      emptyDescription="Set up a depreciation schedule for an asset to track how its value falls over time."
      emptyAction={emptyAction}
      tableProps={{ pinFirstColumn: true }}
    />
  );
};

export default DepreciationTable;
