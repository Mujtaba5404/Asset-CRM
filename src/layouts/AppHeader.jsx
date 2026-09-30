import { ActionIcon, Burger, Group, Modal, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHexagonLetterA, IconSearch } from "@tabler/icons-react";
import UserMenu from "../components/UserMenu";
import AssetQuickSearch from "../features/assets/AssetQuickSearch";

const AppHeader = ({ navbarOpened = false, onToggleNavbar }) => {
  const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);

  return (
    <>
      <Modal opened={searchOpened} onClose={closeSearch} title="Quick find" size="lg">
        <AssetQuickSearch autoFocus onNavigate={closeSearch} />
      </Modal>

      <Group h="100%" gap="sm" justify="space-between" wrap="nowrap">
        <Group gap="sm" wrap="nowrap" miw={0}>
          <Burger opened={navbarOpened} onClick={onToggleNavbar} hiddenFrom="md" size="sm" aria-label="Toggle navigation" />

          {/* The sidebar owns the brand on desktop; the header takes over once it hides. */}
          <Group gap={8} wrap="nowrap" hiddenFrom="md">
            <ThemeIcon size={30} radius="md" variant="filled">
              <IconHexagonLetterA size={18} />
            </ThemeIcon>
            <Text fz="sm" fw={700}>
              Asset360
            </Text>
          </Group>
        </Group>

        <Group gap="xs" wrap="nowrap" flex={1} justify="flex-end" miw={0}>
          <AssetQuickSearch visibleFrom="sm" flex={1} maw={420} />

          <Tooltip label="Quick find" withArrow>
            <ActionIcon hiddenFrom="sm" size="lg" variant="subtle" onClick={openSearch} aria-label="Quick find">
              <IconSearch size={18} />
            </ActionIcon>
          </Tooltip>

          {/* Light/dark switching lives in the account menu. */}
          <UserMenu />
        </Group>
      </Group>
    </>
  );
};

export default AppHeader;
