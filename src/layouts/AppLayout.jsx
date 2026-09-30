import { AppShell } from "@mantine/core";
import { useDisclosure, useLocalStorage, useMediaQuery } from "@mantine/hooks";
import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PageLoader from "../components/PageLoader";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

const NAVBAR_WIDTH = 268;
const NAVBAR_COLLAPSED_WIDTH = 76;
const HEADER_HEIGHT = 62;

// Matches the AppShell navbar breakpoint below (Mantine's `md`).
const DESKTOP_QUERY = "(min-width: 62em)";

const AppLayout = () => {
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false);
  const [collapsed, setCollapsed] = useLocalStorage({ key: "sidebarCollapsed", defaultValue: false, getInitialValueInEffect: false });

  const isDesktop = useMediaQuery(DESKTOP_QUERY, true, { getInitialValueInEffect: false });

  // Collapsing is a desktop affordance. On a phone the navbar is a slide-over, so
  // it always opens at full width rather than as a 76px icon rail.
  const railCollapsed = isDesktop && collapsed;

  const { pathname } = useLocation();

  // Navigating on a phone should dismiss the slide-over navbar.
  useEffect(() => closeMobile(), [pathname, closeMobile]);

  return (
    <AppShell
      layout="alt"
      header={{ height: HEADER_HEIGHT }}
      navbar={{
        width: { base: NAVBAR_WIDTH, md: collapsed ? NAVBAR_COLLAPSED_WIDTH : NAVBAR_WIDTH },
        breakpoint: "md",
        collapsed: { mobile: !mobileOpened },
      }}
      padding={{ base: "sm", sm: "md", lg: "lg" }}
    >
      <AppShell.Navbar>
        <AppSidebar collapsed={railCollapsed} onToggleCollapse={() => setCollapsed((value) => !value)} />
      </AppShell.Navbar>

      <AppShell.Header px={{ base: "sm", sm: "md", lg: "lg" }}>
        <AppHeader navbarOpened={mobileOpened} onToggleNavbar={toggleMobile} />
      </AppShell.Header>

      <AppShell.Main>
        {/* Covers every lazily loaded route, including nested ones. */}
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
};

export default AppLayout;
