import { Button, Group } from "@mantine/core";
import AddAssetModalButton from "../../features/assets/AddAssetModalButton";
import useFilters from "../../hooks/useFilters";
import TabbedLayout from "../../layouts/TabbedLayout";

const AssetsLayout = () => {
  const { filters, resetFilters } = useFilters();

  return (
    <TabbedLayout
      tabs={[
        { value: "dashboard", label: "Dashboard", path: "dashboard" },
        { value: "assets", label: "Assets" },
      ]}
      rightSlots={{
        assets: (
          <Group>
            {Object.keys(filters).length > 0 && (
              <Button color="red" onClick={() => resetFilters()}>
                Clear filters
              </Button>
            )}
            <AddAssetModalButton />
          </Group>
        ),
      }}
    />
  );
};

export default AssetsLayout;