import { Box, Button, Drawer, Grid, Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconListSearch } from "@tabler/icons-react";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PicklistsNav from "../features/picklists/components/PicklistsNav";

/**
 * Settings shell: a persistent secondary navigation beside the active screen.
 *
 * Replaces the old horizontal tab strip, which could not scale past a handful of
 * entries — there are ~50 configurable lists.
 */
const Settings = () => {
  const [navOpened, { open: openNav, close: closeNav }] = useDisclosure(false);
  const { pathname } = useLocation();

  useEffect(() => closeNav(), [pathname, closeNav]);

  return (
    <>
      <PageHeader
        title="Picklists"
        description="Configure the option lists every module picks from."
        actions={
          <Button hiddenFrom="md" variant="default" leftSection={<IconListSearch size={16} />} onClick={openNav}>
            Browse lists
          </Button>
        }
      />

      <Drawer opened={navOpened} onClose={closeNav} title="Picklists" position="left" size="86%" hiddenFrom="md" styles={{ body: { padding: "var(--mantine-spacing-md)" } }}>
        <PicklistsNav onNavigate={closeNav} />
      </Drawer>

      <Grid gutter="md" align="flex-start">
        <Grid.Col span={{ base: 12, md: 4, lg: 3 }} visibleFrom="md">
          <Paper p="sm" pos="sticky" top={78}>
            <Box mah="calc(100vh - 140px)" style={{ display: "flex", flexDirection: "column" }}>
              <PicklistsNav />
            </Box>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>
          <Outlet />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Settings;
