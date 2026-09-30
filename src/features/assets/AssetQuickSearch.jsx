import { Box, CloseButton, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Header "quick find". Submits into the assets list as a serial-number filter,
 * so the result is a normal, shareable, filterable URL rather than a dead end.
 */
const AssetQuickSearch = ({ onNavigate, autoFocus = false, ...props }) => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const term = value.trim();

    if (!term) return;

    navigate(`/assets?serialNumber=${encodeURIComponent(JSON.stringify(term))}`);

    onNavigate?.();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} {...props}>
      <TextInput
        autoFocus={autoFocus}
        type="search"
        aria-label="Search assets by serial number"
        placeholder="Search assets by serial number…"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
        rightSection={value ? <CloseButton size="sm" onClick={() => setValue("")} aria-label="Clear search" /> : null}
      />
    </Box>
  );
};

export default AssetQuickSearch;
