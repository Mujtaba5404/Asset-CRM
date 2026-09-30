import { Anchor, Avatar, Badge, Group, Stack, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { useGetAssetsWithPaginationQuery } from "../../api/asset";
import PaginatedTable from "../../components/PaginatedTable";
import PicklistBadge from "../../components/PicklistBadge";
import useFilters from "../../hooks/useFilters";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import getAbbreviation from "../../utils/getAbbreviation";
import AssetCard from "./AssetCard";
import AssetTableRowMenu from "./AssetTableRowMenu";
import AssetWarrantyBadge from "./AssetWarrantyBadge";

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

/**
 * Filtering lives in the <AssetFilters /> drawer rather than per-column popovers,
 * so there is one place that owns the query and one place that shows what is on.
 */
const ASSET_COLUMNS = [
  {
    accessor: "asset",
    title: "Asset",
    width: 280,
    noWrap: true,
    render: (asset) => (
      <Group gap="sm" wrap="nowrap" miw={0}>
        <Avatar size={34} radius="md" color={asset.category?.color || "gray"}>
          {getAbbreviation(asset.subCategory?.title || asset.serialNumber)}
        </Avatar>

        <Stack gap={0} miw={0}>
          <Anchor component={Link} to={`/assets/${asset._id}`} fz="sm" fw={600} c="inherit" truncate>
            {asset.serialNumber || "—"}
          </Anchor>

          <Text fz="xs" c="dimmed" truncate>
            {asset.description || "No description"}
          </Text>
        </Stack>
      </Group>
    ),
  },
  {
    accessor: "tag",
    title: "Tag",
    width: 140,
    textAlign: "center",
    sortable: true,
    render: (asset) =>
      asset.tag ? (
        <Badge variant="outline" color="gray">
          {asset.tag}
        </Badge>
      ) : (
        <Text fz="sm" c="dimmed">
          —
        </Text>
      ),
  },
  {
    accessor: "category",
    title: "Category",
    width: 170,
    render: (asset) => <TwoLine top={asset.subCategory?.title} bottom={asset.category?.title} />,
  },
  {
    accessor: "location",
    title: "Location",
    width: 170,
    render: (asset) => <TwoLine top={asset.location?.title} bottom={asset.company?.title} />,
  },
  {
    accessor: "status",
    title: "Status",
    width: 130,
    textAlign: "center",
    render: (asset) => <PicklistBadge item={asset.status} />,
  },
  {
    accessor: "condition",
    title: "Condition",
    width: 130,
    textAlign: "center",
    render: (asset) => <PicklistBadge item={asset.condition} />,
  },
  {
    accessor: "purchaseAmount",
    title: "Purchase",
    width: 150,
    sortable: true,
    render: (asset) => <TwoLine top={formatAmount(asset.purchaseAmount || 0)} bottom={formatDate(asset.purchaseDate)} />,
  },
  {
    accessor: "warranty",
    title: "Warranty",
    width: 150,
    render: (asset) => <AssetWarrantyBadge warranty={asset.warranty} />,
  },
  {
    accessor: "expiryDate",
    title: "Expiry",
    width: 130,
    textAlign: "center",
    sortable: true,
    render: (asset) =>
      asset.hasExpiry ? (
        formatDate(asset.expiryDate)
      ) : (
        <Text fz="sm" c="dimmed">
          —
        </Text>
      ),
  },
  {
    accessor: "createdAt",
    title: "Created",
    width: 130,
    textAlign: "center",
    sortable: true,
    render: (asset) => formatDate(asset.createdAt),
  },
  {
    accessor: "menu",
    title: "Menu",
    width: 80,
    textAlign: "center",
    render: (asset) => <AssetTableRowMenu asset={asset} />,
  },
];

const AssetTable = ({ query, hideColumns = [], emptyAction }) => {
  const [globalFilters] = useLocalStorage({ key: "globalFilters", getInitialValueInEffect: false });
  const { filters } = useFilters();

  return (
    <PaginatedTable
      queryHook={useGetAssetsWithPaginationQuery}
      columns={ASSET_COLUMNS}
      queryParams={{ ...globalFilters, ...filters, ...query }}
      hideColumns={hideColumns}
      renderCard={(asset) => <AssetCard asset={asset} />}
      emptyTitle="No assets match this view"
      emptyDescription="Try widening or clearing the filters, or register your first asset."
      emptyAction={emptyAction}
      tableProps={{ pinFirstColumn: true }}
    />
  );
};

export default AssetTable;
