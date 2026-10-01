import { Box, Text } from "@mantine/core";
import useVizColor from "../utils/useVizColor";

const GAP = 2;

/**
 * Donut for a part-to-whole split.
 *
 * Form: a ring, because the question is composition of one total — never for
 * comparing unrelated quantities, which is what bars are for.
 * Colour: each slice carries the entity's own picklist colour, so the same value
 * is the same hue everywhere on the screen.
 *
 * The centre holds the total, so the headline figure is not gated behind a
 * tooltip, and the legend beside it names every slice with its value.
 */
const DonutChart = ({ data = [], size = 180, thickness = 20, centerValue, centerLabel }) => {
  const vizColor = useVizColor();

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, row) => sum + (Number(row.value) || 0), 0);

  let offset = 0;

  return (
    <Box pos="relative" w={size} h={size} style={{ flexShrink: 0 }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--viz-grid)" strokeWidth={thickness} />

        {total > 0 &&
          data.map((row) => {
            const value = Number(row.value) || 0;

            if (value <= 0) return null;

            const length = (value / total) * circumference;
            // A hairline between slices, but never so wide it eats a small one.
            const dash = Math.max(length - (length > GAP * 2 ? GAP : 0), 0.5);
            const segment = (
              <circle
                key={row.key ?? row.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={vizColor(row.color)}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: "stroke-dasharray 320ms cubic-bezier(0.32, 0.72, 0, 1)" }}
              />
            );

            offset += length;

            return segment;
          })}
      </svg>

      <Box
        pos="absolute"
        style={{ inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}
      >
        <Text fz={24} fw={700} lh={1.1} style={{ letterSpacing: "-0.02em" }}>
          {centerValue}
        </Text>

        {centerLabel && (
          <Text fz="xs" c="dimmed">
            {centerLabel}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default DonutChart;
