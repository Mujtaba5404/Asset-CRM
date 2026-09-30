import { Box, Group, Paper, Skeleton, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { IconMinus, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

const SPARK_WIDTH = 96;
const SPARK_HEIGHT = 28;

/**
 * 12-point sparkline: 2px line in the de-emphasis grey with the current point
 * in the accent, ringed in the surface colour so it stays legible on the line.
 */
const Sparkline = ({ points = [] }) => {
  if (points.length < 2) return null;

  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;

  const step = SPARK_WIDTH / (points.length - 1);
  const y = (value) => SPARK_HEIGHT - 3 - ((value - min) / span) * (SPARK_HEIGHT - 6);

  const path = points.map((value, index) => `${index === 0 ? "M" : "L"}${(index * step).toFixed(1)} ${y(value).toFixed(1)}`).join(" ");

  const lastX = SPARK_WIDTH;
  const lastY = y(points[points.length - 1]);

  return (
    <svg width={SPARK_WIDTH} height={SPARK_HEIGHT} viewBox={`0 0 ${SPARK_WIDTH + 5} ${SPARK_HEIGHT}`} aria-hidden="true" style={{ overflow: "visible", flexShrink: 0 }}>
      <path d={path} fill="none" stroke="var(--viz-axis)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="4" fill="var(--viz-fill)" stroke="var(--app-surface)" strokeWidth="2" />
    </svg>
  );
};

const DELTA_ICONS = { up: IconTrendingUp, down: IconTrendingDown, flat: IconMinus };

/**
 * Stat tile — the right form for a single headline number.
 *
 * label   sentence case, no trailing colon
 * value   large, semibold, proportional figures (never tabular at display size)
 * delta   optional, signed and always paired with an arrow + the period it compares to
 * tone    severity for the icon only; the value keeps text ink so colour is never the message
 */
const StatCard = ({ label, value, hint, icon, tone = "gray", delta, deltaLabel, deltaGoodWhen = "up", trend, loading = false, onClick, ...props }) => {
  const direction = delta === undefined || delta === null ? null : delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const DeltaIcon = direction ? DELTA_ICONS[direction] : null;

  const deltaColor = direction === null || direction === "flat" ? "dimmed" : direction === deltaGoodWhen ? "teal.7" : "red.7";

  const interactive = typeof onClick === "function";

  return (
    <Paper
      p="md"
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (event) => (event.key === "Enter" || event.key === " ") && onClick(event) : undefined}
      style={interactive ? { cursor: "pointer" } : undefined}
      {...props}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="xs" mb="sm">
        <Text fz="xs" c="dimmed" fw={550} style={{ lineHeight: 1.3 }}>
          {label}
        </Text>

        {icon && (
          <ThemeIcon size={34} radius="md" variant="light" color={tone}>
            {icon}
          </ThemeIcon>
        )}
      </Group>

      <Group justify="space-between" align="flex-end" wrap="nowrap" gap="sm">
        <Box miw={0}>
          {loading ? (
            <Skeleton height={30} width={88} radius="sm" />
          ) : (
            <Text fz={28} fw={680} lh={1.1} style={{ letterSpacing: "-0.02em" }}>
              {value}
            </Text>
          )}

          {(hint || direction) && (
            <Group gap={6} wrap="nowrap" mt={6}>
              {direction && (
                <Tooltip label={deltaLabel ? `Change ${deltaLabel}` : "Change"} withArrow disabled={!deltaLabel}>
                  <Group gap={2} wrap="nowrap" c={deltaColor}>
                    <DeltaIcon size={14} />
                    <Text fz="xs" fw={600}>
                      {delta > 0 ? "+" : ""}
                      {delta}%
                    </Text>
                  </Group>
                </Tooltip>
              )}

              {hint && (
                <Text fz="xs" c="dimmed" truncate>
                  {hint}
                </Text>
              )}
            </Group>
          )}
        </Box>

        {trend && !loading && <Sparkline points={trend} />}
      </Group>
    </Paper>
  );
};

export default StatCard;
