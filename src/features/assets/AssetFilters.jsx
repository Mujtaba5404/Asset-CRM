import { Badge, Button, Drawer, Group, Pill, Stack, Text, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconFilter, IconX } from "@tabler/icons-react";
import PicklistsMultiSelect from "../picklists/components/PicklistsMultiSelect";
import { ASSET_FILTER_FIELDS, describeFilter, emptyValueFor, useAssetFilterState } from "./assetFilterFields";

/** Removable chips for whatever is currently filtering the list. */
export const ActiveAssetFilters = () => {
  const { filters, setFilters, resetFilters, activeFields } = useAssetFilterState();

  if (!activeFields.length) return null;

  return (
    <Group gap="xs" wrap="wrap">
      <Text fz="xs" c="dimmed" fw={600} tt="uppercase" style={{ letterSpacing: "0.05em" }}>
        Filters
      </Text>

      {activeFields.map((field) => (
        <Pill key={field.key} withRemoveButton onRemove={() => setFilters({ [field.key]: emptyValueFor(field, filters[field.key]) })}>
          {field.label}: {describeFilter(field, filters[field.key])}
        </Pill>
      ))}

      <Button size="compact-xs" variant="subtle" color="red" leftSection={<IconX size={13} />} onClick={() => resetFilters()}>
        Clear all
      </Button>
    </Group>
  );
};

/** The filter button plus the panel it opens. */
const AssetFilters = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 48em)");

  const { filters, setFilters, resetFilters, activeCount } = useAssetFilterState();

  const renderField = (field) => {
    if (field.type === "text") {
      return (
        <TextInput
          key={field.key}
          label={field.label}
          placeholder={field.placeholder}
          value={filters[field.key] || ""}
          onChange={(event) => setFilters({ [field.key]: event.currentTarget.value })}
        />
      );
    }

    if (field.type === "dateRange") {
      return (
        <DatePickerInput
          key={field.key}
          type="range"
          label={field.label}
          placeholder="Pick a date range"
          value={filters[field.key] ?? [null, null]}
          onChange={(value) => setFilters({ [field.key]: value })}
        />
      );
    }

    return (
      <PicklistsMultiSelect
        key={field.key}
        queryObject={{ resource: "Asset", field: field.key }}
        multiSelectProps={{
          label: field.label,
          placeholder: `Any ${field.label.toLowerCase()}`,
          value: filters[field.key] || [],
          onChange: (value) => setFilters({ [field.key]: value }),
        }}
      />
    );
  };

  return (
    <>
      <Button
        variant={activeCount ? "light" : "default"}
        leftSection={<IconFilter size={16} />}
        rightSection={
          activeCount ? (
            <Badge size="sm" circle variant="filled">
              {activeCount}
            </Badge>
          ) : null
        }
        onClick={open}
      >
        Filters
      </Button>

      <Drawer
        opened={opened}
        onClose={close}
        title="Filter assets"
        position="right"
        size={isMobile ? "100%" : "md"}
        offset={isMobile ? 0 : 8}
        radius={isMobile ? 0 : "md"}
      >
        <Stack gap="md" p="md" style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {ASSET_FILTER_FIELDS.map(renderField)}
        </Stack>

        <Group
          p="md"
          gap="sm"
          justify="flex-end"
          style={{
            flexShrink: 0,
            borderTop: "1px solid var(--mantine-color-default-border)",
            paddingBottom: "max(var(--mantine-spacing-md), env(safe-area-inset-bottom))",
          }}
        >
          <Button variant="default" flex={{ base: 1, sm: "0 0 auto" }} onClick={() => resetFilters()} disabled={!activeCount}>
            Reset
          </Button>

          <Button flex={{ base: 1, sm: "0 0 auto" }} onClick={close}>
            Show results
          </Button>
        </Group>
      </Drawer>
    </>
  );
};

export default AssetFilters;
