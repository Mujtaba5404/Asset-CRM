import { Group, Stack } from "@mantine/core";
import { ActiveAssetFilters } from "./AssetFilters";
import AddAssetModalButton from "./AddAssetModalButton";
import AssetFilters from "./AssetFilters";
import AssetTable from "./AssetTable";

/**
 * The reusable assets list: toolbar, active-filter chips and the responsive
 * data view. `query` locks the list to a subset (e.g. one location), so this can
 * be embedded on other records' detail screens.
 */
const AssetsList = ({ query, hideColumns = [], withToolbar = true }) => (
  <Stack gap="sm">
    {withToolbar && (
      <>
        <Group justify="space-between" gap="sm" wrap="wrap">
          <AssetFilters />

          <AddAssetModalButton />
        </Group>

        <ActiveAssetFilters />
      </>
    )}

    <AssetTable query={query} hideColumns={hideColumns} emptyAction={<AddAssetModalButton />} />
  </Stack>
);

export default AssetsList;
