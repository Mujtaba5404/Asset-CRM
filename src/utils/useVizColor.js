import { useComputedColorScheme, useMantineTheme } from "@mantine/core";

/**
 * Resolves a picklist's configured colour to the shade a chart should paint with.
 *
 * Shade 6 reads well on white; shade 4 keeps >= 3:1 on the dark card surface.
 * Anything without a colour falls back to the single-hue viz fill, so a chart
 * never invents an identity for a bucket that has none.
 */
const useVizColor = () => {
  const theme = useMantineTheme();
  const dark = useComputedColorScheme("light", { getInitialValueInEffect: true }) === "dark";

  return (color) => {
    const swatches = color && theme.colors[color];

    if (!swatches) return "var(--viz-fill)";

    return dark ? swatches[4] : swatches[6];
  };
};

export default useVizColor;
