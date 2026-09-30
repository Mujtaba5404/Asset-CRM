import { Box, Group, Stack, Text, Tooltip, useComputedColorScheme, useMantineTheme } from "@mantine/core";

const BAR_HEIGHT = 10;

/**
 * Horizontal bar breakdown.
 *
 * Form: bars, because the job is comparing magnitude across named classes.
 * Colour: one hue by default (magnitude needs no identity channel). When a row
 * carries its own colour — a picklist's configured colour — the bar follows the
 * entity, so filtering the list never repaints the survivors.
 *
 * Every row shows its name and value as text, so nothing is encoded in colour
 * alone and no value is gated behind the tooltip.
 */
const BarBreakdown = ({ data = [], emptyMessage = "No data yet", valueFormatter = (value) => value, max: maxOverride }) => {
  const theme = useMantineTheme();
  const dark = useComputedColorScheme("light", { getInitialValueInEffect: true }) === "dark";

  if (!data.length) {
    return (
      <Text fz="sm" c="dimmed" py="lg" ta="center">
        {emptyMessage}
      </Text>
    );
  }

  const values = data.map((row) => Number(row.value) || 0);
  const max = maxOverride ?? Math.max(...values, 1);
  const total = values.reduce((sum, value) => sum + value, 0);

  // Shade 6 reads well on white; shade 4 keeps >= 3:1 on the dark card surface.
  const resolveColor = (color) => {
    const swatches = color && theme.colors[color];

    if (!swatches) return "var(--viz-fill)";

    return dark ? swatches[4] : swatches[6];
  };

  return (
    <Stack gap="sm">
      {data.map((row) => {
        const value = Number(row.value) || 0;
        const share = total ? Math.round((value / total) * 100) : 0;
        const width = max ? Math.max((value / max) * 100, value > 0 ? 1.5 : 0) : 0;

        return (
          <Tooltip key={row.key ?? row.label} label={`${row.label} · ${valueFormatter(value)} · ${share}% of total`} withArrow position="top">
            <Box style={{ minHeight: 24, cursor: "default" }}>
              <Group justify="space-between" wrap="nowrap" gap="sm" mb={5}>
                <Text fz="sm" fw={500} tt="capitalize" truncate>
                  {row.label}
                </Text>

                <Text fz="sm" fw={600} c="dimmed" style={{ flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
                  {valueFormatter(value)}
                </Text>
              </Group>

              <Box h={BAR_HEIGHT} style={{ background: "var(--viz-grid)", borderRadius: 999, overflow: "hidden" }}>
                <Box
                  h="100%"
                  w={`${width}%`}
                  style={{
                    background: resolveColor(row.color),
                    // Square at the baseline, 4px rounded at the data end.
                    borderRadius: "0 4px 4px 0",
                    transition: "width 320ms cubic-bezier(0.32, 0.72, 0, 1)",
                  }}
                />
              </Box>
            </Box>
          </Tooltip>
        );
      })}
    </Stack>
  );
};

export default BarBreakdown;
