import { Badge, Button, Stack, Text, TextInput, UnstyledButton } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useLocalStorage } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { useGetAssetsWithPaginationQuery } from "../../api/asset";
import PaginatedTable from "../../components/PaginatedTable";
import useFilters from "../../hooks/useFilters";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import AssetTableRowMenu from "./AssetTableRowMenu";

const TwoLine = ({ top, bottom }) => (
  <Stack gap={0}>
    <Text size="sm" tt="capitalize">{top || "-"}</Text>
    <Text size="xs" c="dimmed" tt="capitalize">{bottom || "-"}</Text>
  </Stack>
);


// const picklistFilter = (field, filters, setFilters) => ({
//   filter: (
//     <PicklistsMultiSelect
//       queryObject={{ resource: "Asset", field }}
//       multiSelectProps={{
//         size: "xs",
//         placeholder: `Select ${field}`,
//         value: filters[field] || [],
//         onChange: (value) => setFilters({ [field]: value }),
//         comboboxProps: { withinPortal: false },
//       }}
//     />
//   ),
//   filtering: filters[field]?.length,
// });

const DEFAULT_COLUMNS = (filters, setFilters) => [
  {
    accessor: "createdAt",
    title: "Date",
    width: 120,
    textAlign: "center",
    sortable: true,
    filter: ({ close }) => (
      <Stack gap="xs">
        <DatePicker size="xs" type="range" value={filters.createdAt} onChange={(value) => setFilters({ createdAt: value })} />
        <Button size="xs" onClick={() => { setFilters({ createdAt: [] }); close(); }}>Clear</Button>
      </Stack>
    ),
    filtering: filters.createdAt?.length,
    render: (row) => formatDate(row.createdAt),
  },
  {
    accessor: "tag",
    width: 160,
    textAlign: "center",
    sortable: true,
    filter: <TextInput size="xs" placeholder="Search by tag" value={filters.tag || ""} onChange={(e) => setFilters({ tag: e.target.value })} />,
    filtering: filters.tag,
    render: (row) => <Badge variant="light">{row.tag}</Badge>,
  },
  {
    accessor: "asset",
    width: 240,
    filter: <TextInput size="xs" placeholder="Search by serial number" value={filters.serialNumber || ""} onChange={(e) => setFilters({ serialNumber: e.target.value })} />,
    filtering: filters.serialNumber,
    render: (row) => (
      <UnstyledButton component={Link} to={`/assets/${row._id}`}>
        <Text size="sm">{row.serialNumber}</Text>
        <Text size="xs" c="dimmed" lineClamp={1}>{row.description || "-"}</Text>
      </UnstyledButton>
    ),
  },
  {
    accessor: "category",
    width: 150,
    // ...picklistFilter("category", filters, setFilters),
    render: (row) => <TwoLine top={row.subCategory?.title} bottom={row.category?.title} />,
  },
  {
    accessor: "location",
    width: 150,
    // ...picklistFilter("location", filters, setFilters),
    render: (row) => <TwoLine top={row.location?.title} bottom={row.company?.title} />,
  },
  {
    accessor: "status",
    width: 130,
    textAlign: "center",
    // ...picklistFilter("status", filters, setFilters),
    render: (row) => <Badge color={row.status?.color} tt="capitalize">{row.status?.title || "-"}</Badge>,
  },
  {
    accessor: "condition",
    width: 120,
    textAlign: "center",
    render: (row) => <Badge color={row.condition?.color} tt="capitalize">{row.condition?.title || "-"}</Badge>,
  },
  {
    accessor: "purchaseAmount",
    title: "Purchase",
    width: 140,
    textAlign: "left",
    sortable: true,
    render: (row) => <TwoLine top={formatAmount(row.purchaseAmount || 0)} bottom={formatDate(row.purchaseDate)} />,
  },
  {
    accessor: "warranty",
    width: 140,
    textAlign: "left",
    render: ({ warranty }) => (warranty?.isWarrantied ? <TwoLine top={formatDate(warranty.endDate)} bottom={warranty.provider?.title} /> : <Text size="sm" c="dimmed">No warranty</Text>),
  },
  {
    accessor: "expiryDate",
    title: "Expiry",
    width: 120,
    textAlign: "center",
    sortable: true,
    render: (row) => (row.hasExpiry ? formatDate(row.expiryDate) : "-"),
  },
  {
    accessor: "menu",
    width: 60,
    textAlign: "center",
    render: (row) => <AssetTableRowMenu asset={row} compact />,
  },
];

const AssetTable = ({ query, hideColumns = [] }) => {
  const [globalFilters] = useLocalStorage({ key: "globalFilters", getInitialValueInEffect: false });
  const { filters, setFilters } = useFilters({});

  return (
    <PaginatedTable
      queryHook={useGetAssetsWithPaginationQuery}
      columns={DEFAULT_COLUMNS(filters, setFilters)}
      queryParams={{ ...globalFilters, ...filters, ...query }}
      hideColumns={hideColumns}
    />
  );
};

export default AssetTable;