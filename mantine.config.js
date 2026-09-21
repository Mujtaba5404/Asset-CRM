import { ActionIcon, Avatar, Badge, Button, Drawer, Loader, Modal, MultiSelect, NumberInput, Paper, Popover, Select, Tabs, TagsInput, Tooltip } from "@mantine/core";
import { DatePicker, MonthPicker } from "@mantine/dates";

export default {
  colors: {
    dark: ["#f3f4f6", "#e5e7eb", "#a1a5ab", "#3f4a5d", "#374151", "#4b5563", "#1f2937", "#111827", "#111827", "#030712"],
    // redwine: ["#FBE9EC", "#F3C6CE", "#E79FAC", "#D97186", "#C74863", "#A83250", "#8C2743", "#701F36", "#5C1A2E", "#4A1526"],
    orange: ["#FFF4E6", "#FFE8CC", "#FFD8A8", "#FFC078", "#FFA94D", "#FF922B", "#FD7E14", "#F76707", "#E8590C", "#D9480F"],
  },
  cursorType: "pointer",
  defaultRadius: "md",
  fontFamily: "Inter, sans-serif",
  // primaryColor: "redwine",
  primaryColor: "orange",
  components: {
    ActionIcon: ActionIcon.extend({ defaultProps: { variant: "subtle" } }),
    Avatar: Avatar.extend({ defaultProps: { radius: "md" }, styles: { image: { objectFit: "contain" } } }),
    Badge: Badge.extend({ defaultProps: { variant: "light" } }),
    Button: Button.extend({ defaultProps: { miw: "max-content" } }),
    DatePicker: DatePicker.extend({ defaultProps: { allowSingleDateInRange: true } }),
    Drawer: Drawer.extend({ defaultProps: { position: "right", styles: { content: { display: "flex", flexDirection: "column" }, body: { height: "100%" } }, overlayProps: { blur: 2 } } }),
    Loader: Loader.extend({ defaultProps: { type: "dots", mx: "auto" } }),
    Paper: Paper.extend({ defaultProps: { withBorder: true } }),
    Modal: Modal.extend({ defaultProps: { centered: true, overlayProps: { blur: 2 } } }),
    MonthPicker: MonthPicker.extend({ defaultProps: { allowSingleDateInRange: true } }),
    MultiSelect: MultiSelect.extend({
      defaultProps: { hidePickedOptions: true, checkIconPosition: "right", searchable: true, clearable: true, limit: 20, nothingFoundMessage: "No results found", comboboxProps: { shadow: "md" } },
    }),
    NumberInput: NumberInput.extend({ defaultProps: { min: 0, allowNegative: false, thousandSeparator: true } }),
    Popover: Popover.extend({ defaultProps: { withArrow: true, shadow: "md" } }),
    Select: Select.extend({
      defaultProps: { allowDeselect: false, checkIconPosition: "right", searchable: true, limit: 20, nothingFoundMessage: "No results found", comboboxProps: { shadow: "md" } },
    }),
    Tabs: Tabs.extend({ defaultProps: { keepMounted: false } }),
    TagsInput: TagsInput.extend({ defaultProps: { acceptValueOnBlur: true, limit: 20, comboboxProps: { shadow: "md" } } }),
    Tooltip: Tooltip.extend({ defaultProps: { multiline: true, withArrow: true } }),
  },
};
