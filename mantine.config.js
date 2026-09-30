import {
  ActionIcon,
  Alert,
  Anchor,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Divider,
  Drawer,
  Fieldset,
  Input,
  Loader,
  Menu,
  Modal,
  MultiSelect,
  NavLink,
  NumberInput,
  Paper,
  Pill,
  Popover,
  Select,
  Switch,
  Table,
  Tabs,
  TagsInput,
  Textarea,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { DatePicker, DatePickerInput, DateInput, MonthPicker } from "@mantine/dates";

/**
 * Asset360 design system.
 *
 * Everything visual is centralised here so screens stay declarative:
 * surfaces, radii, typography scale and per-component defaults.
 */
const theme = {
  colors: {
    // Cool neutral greys — reads more "product" than Mantine's default dark scale.
    dark: ["#f3f4f6", "#e5e7eb", "#a1a5ab", "#6b7280", "#374151", "#2b3444", "#1f2937", "#151d2b", "#111827", "#0b0f19"],
    orange: ["#FFF4E6", "#FFE8CC", "#FFD8A8", "#FFC078", "#FFA94D", "#FF922B", "#FD7E14", "#F76707", "#E8590C", "#D9480F"],
  },

  primaryColor: "orange",
  primaryShade: { light: 6, dark: 5 },

  cursorType: "pointer",
  defaultRadius: "md",
  focusRing: "auto",

  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
  fontFamilyMonospace: "ui-monospace, SFMono-Regular, 'JetBrains Mono', Menlo, monospace",

  headings: {
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
    fontWeight: "650",
    sizes: {
      h1: { fontSize: "1.75rem", lineHeight: "1.25", fontWeight: "700" },
      h2: { fontSize: "1.375rem", lineHeight: "1.3", fontWeight: "680" },
      h3: { fontSize: "1.125rem", lineHeight: "1.35", fontWeight: "650" },
      h4: { fontSize: "1rem", lineHeight: "1.4", fontWeight: "620" },
      h5: { fontSize: "0.875rem", lineHeight: "1.45", fontWeight: "600" },
      h6: { fontSize: "0.8125rem", lineHeight: "1.45", fontWeight: "600" },
    },
  },

  radius: { xs: "0.25rem", sm: "0.375rem", md: "0.625rem", lg: "0.875rem", xl: "1.25rem" },

  shadows: {
    xs: "0 1px 2px rgba(11, 15, 25, 0.06)",
    sm: "0 1px 3px rgba(11, 15, 25, 0.08), 0 1px 2px rgba(11, 15, 25, 0.04)",
    md: "0 4px 12px rgba(11, 15, 25, 0.08), 0 2px 4px rgba(11, 15, 25, 0.04)",
    lg: "0 12px 28px rgba(11, 15, 25, 0.12), 0 4px 8px rgba(11, 15, 25, 0.05)",
    xl: "0 24px 48px rgba(11, 15, 25, 0.16), 0 8px 16px rgba(11, 15, 25, 0.06)",
  },

  components: {
    ActionIcon: ActionIcon.extend({ defaultProps: { variant: "subtle", color: "gray" } }),

    Alert: Alert.extend({ defaultProps: { variant: "light", radius: "md" } }),

    Anchor: Anchor.extend({ defaultProps: { underline: "never" } }),

    Avatar: Avatar.extend({ defaultProps: { radius: "md" }, styles: { image: { objectFit: "contain" } } }),

    Badge: Badge.extend({ defaultProps: { variant: "light", radius: "sm" }, styles: { label: { fontWeight: 600 } } }),

    Breadcrumbs: Breadcrumbs.extend({ defaultProps: { separatorMargin: "xs" } }),

    Button: Button.extend({ defaultProps: { radius: "md" }, styles: { label: { fontWeight: 550 } } }),

    Card: Card.extend({ defaultProps: { withBorder: true, radius: "md", padding: "md" } }),

    Checkbox: Checkbox.extend({ defaultProps: { radius: "sm" } }),

    DateInput: DateInput.extend({ defaultProps: { valueFormat: "DD MMM YYYY", clearable: true, popoverProps: { shadow: "md" } } }),

    DatePicker: DatePicker.extend({ defaultProps: { allowSingleDateInRange: true } }),

    DatePickerInput: DatePickerInput.extend({ defaultProps: { valueFormat: "DD MMM YYYY", clearable: true, popoverProps: { shadow: "md" } } }),

    Divider: Divider.extend({ defaultProps: { color: "var(--mantine-color-default-border)" } }),

    Drawer: Drawer.extend({
      defaultProps: {
        position: "right",
        overlayProps: { blur: 3, backgroundOpacity: 0.45 },
        transitionProps: { duration: 220, timingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" },
      },
      styles: {
        // Column layout lets screens pin a sticky footer under a scrolling body.
        content: { display: "flex", flexDirection: "column" },
        header: { minHeight: 60, borderBottom: "1px solid var(--mantine-color-default-border)" },
        title: { fontWeight: 650, fontSize: "var(--mantine-font-size-md)" },
        body: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: 0 },
      },
    }),

    Fieldset: Fieldset.extend({ defaultProps: { variant: "filled", radius: "md" }, styles: { legend: { fontWeight: 600, fontSize: "var(--mantine-font-size-sm)" } } }),

    Input: Input.extend({ defaultProps: { radius: "md" } }),

    Loader: Loader.extend({ defaultProps: { type: "dots", mx: "auto" } }),

    Menu: Menu.extend({ defaultProps: { shadow: "md", radius: "md", withinPortal: true } }),

    Modal: Modal.extend({
      defaultProps: {
        centered: true,
        radius: "lg",
        overlayProps: { blur: 3, backgroundOpacity: 0.45 },
        transitionProps: { duration: 180 },
      },
      styles: {
        header: { borderBottom: "1px solid var(--mantine-color-default-border)" },
        title: { fontWeight: 650, fontSize: "var(--mantine-font-size-md)" },
      },
    }),

    MonthPicker: MonthPicker.extend({ defaultProps: { allowSingleDateInRange: true } }),

    MultiSelect: MultiSelect.extend({
      defaultProps: {
        hidePickedOptions: true,
        checkIconPosition: "right",
        searchable: true,
        clearable: true,
        limit: 20,
        nothingFoundMessage: "No results found",
        comboboxProps: { shadow: "md" },
      },
    }),

    NavLink: NavLink.extend({ defaultProps: { variant: "light" } }),

    NumberInput: NumberInput.extend({ defaultProps: { min: 0, allowNegative: false, thousandSeparator: "," } }),

    Paper: Paper.extend({ defaultProps: { withBorder: true, radius: "md" } }),

    Pill: Pill.extend({ defaultProps: { radius: "sm" } }),

    Popover: Popover.extend({ defaultProps: { withArrow: true, shadow: "md", radius: "md" } }),

    Select: Select.extend({
      defaultProps: {
        allowDeselect: false,
        checkIconPosition: "right",
        searchable: true,
        limit: 20,
        nothingFoundMessage: "No results found",
        comboboxProps: { shadow: "md" },
      },
    }),

    Switch: Switch.extend({ defaultProps: { size: "md" } }),

    Table: Table.extend({ defaultProps: { verticalSpacing: "sm", horizontalSpacing: "md" } }),

    Tabs: Tabs.extend({ defaultProps: { keepMounted: false } }),

    TagsInput: TagsInput.extend({ defaultProps: { acceptValueOnBlur: true, limit: 20, clearable: true, comboboxProps: { shadow: "md" } } }),

    Textarea: Textarea.extend({ defaultProps: { autosize: true, minRows: 3, maxRows: 6 } }),

    ThemeIcon: ThemeIcon.extend({ defaultProps: { radius: "md" } }),

    Title: Title.extend({ styles: { root: { letterSpacing: "-0.015em" } } }),

    Tooltip: Tooltip.extend({ defaultProps: { multiline: true, withArrow: true, radius: "sm", openDelay: 250 } }),
  },
};

export default theme;
