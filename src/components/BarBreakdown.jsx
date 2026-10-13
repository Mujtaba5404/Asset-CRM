import { Box, Group, Progress, Stack, Text, Tooltip } from "@mantine/core";

const BAR_HEIGHT = 16;

// A segment narrower than this cannot fit its name, so it relies on the tooltip and legend.
const MIN_LABEL_SHARE = 12;

// Rows without a configured colour still need distinct segments.
const FALLBACK_COLORS = [
  "blue",
  "teal",
  "grape",
  "orange",
  "cyan",
  "pink",
  "indigo",
  "lime",
];

/**
 * Part-to-whole breakdown as one segmented Mantine progress bar.
 *
 * When a row carries its own colour — a picklist's configured colour — the
 * segment follows the entity; otherwise it takes the next fallback hue.
 *
 * The legend below repeats every name, value and share as text, so small
 * segments and colour alone never carry the information.
 */
const BarBreakdown = ({
  data = [],
  emptyMessage = "No data yet",
  valueFormatter = (value) => value,
}) => {
  if (!data.length) {
    return (
      <Text fz="sm" c="dimmed" py="lg" ta="center">
        {emptyMessage}
      </Text>
    );
  }

  const total = data.reduce((sum, row) => sum + (Number(row.value) || 0), 0);

  let fallbackIndex = 0;

  const rows = data.map((row) => {
    const value = Number(row.value) || 0;

    return {
      ...row,
      value,
      share: total ? (value / total) * 100 : 0,
      color:
        row.color ||
        (row.key === "other" || row.key === "unassigned"
          ? "gray"
          : FALLBACK_COLORS[fallbackIndex++ % FALLBACK_COLORS.length]),
    };
  });

  return (
    <Stack gap="md">
      {/* <Stack gap={4}>
        {rows.map((row) => (
          <Group key={row.key ?? row.label} gap="xs" wrap="nowrap">
            <Box
              w={8}
              h={8}
              style={{
                borderRadius: 999,
                background: `var(--mantine-color-${row.color}-filled)`,
                flexShrink: 0,
              }}
            />

            <Text fz="sm" tt="capitalize" truncate flex={1}>
              {row.label}
            </Text>

            <Text
              fz="sm"
              fw={600}
              style={{ flexShrink: 0, fontVariantNumeric: "tabular-nums" }}
            >
              {valueFormatter(row.value)}
            </Text>

            <Text
              fz="xs"
              c="dimmed"
              w={38}
              ta="right"
              style={{ flexShrink: 0, fontVariantNumeric: "tabular-nums" }}
            >
              {Math.round(row.share)}%
            </Text>
          </Group>
        ))}
      </Stack> */}

      <Progress.Root size={BAR_HEIGHT} radius="xl">
        {rows.map((row) => (
          <Tooltip
            key={row.key ?? row.label}
            tt={"capitalize"}
            label={`${row.label} · ${valueFormatter(row.value)}`}
            withArrow
            position="top"
          >
            <Progress.Section value={row.share} color={row.color}>
              {row.share >= MIN_LABEL_SHARE && (
                <Progress.Label tt="capitalize">
                  {Math.round(row.share)}%
                </Progress.Label>
              )}
            </Progress.Section>
          </Tooltip>
        ))}
      </Progress.Root>
    </Stack>
  );
};

export default BarBreakdown;
