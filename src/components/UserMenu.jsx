import { ActionIcon, Avatar, Box, Menu, Text, Tooltip, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { IconLock, IconLogout, IconMoonStars, IconSunHigh, IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../features/auth/ChangePasswordModal";

const UserMenu = () => {
  const [auth, , removeAuth] = useLocalStorage({ key: "auth", getInitialValueInEffect: false });
  const [, , removeGlobalFilters] = useLocalStorage({ key: "globalFilters", getInitialValueInEffect: false });

  const navigate = useNavigate();

  const { toggleColorScheme } = useMantineColorScheme();
  const dark = useComputedColorScheme("light", { getInitialValueInEffect: true }) === "dark";

  const [changePasswordOpened, { open: openChangePassword, close: closeChangePassword }] = useDisclosure(false);

  const handleLogOut = () => {
    removeAuth();
    removeGlobalFilters();

    navigate("/login", { replace: true });
  };

  return (
    <>
      <ChangePasswordModal isOpen={changePasswordOpened} onClose={closeChangePassword} />

      <Menu width={236} position="bottom-end" shadow="md">
        <Menu.Target>
          <Tooltip label="Account" withArrow>
            <ActionIcon size="lg" radius="xl" variant="subtle" aria-label="Account menu">
              {auth?.name ? <Avatar size={30} radius="xl" color="initials" name={auth.name} /> : <IconUser size={20} />}
            </ActionIcon>
          </Tooltip>
        </Menu.Target>

        <Menu.Dropdown>
          <Box px="sm" py={8}>
            <Text fz="sm" fw={600} tt="capitalize" truncate>
              {auth?.name || "Signed in"}
            </Text>
            <Text fz="xs" c="dimmed" truncate>
              {auth?.email || auth?.effectiveScope || "—"}
            </Text>
          </Box>

          <Menu.Divider />

          {/* Configuration lives in the sidebar; this menu stays account-only. */}
          <Menu.Item leftSection={dark ? <IconSunHigh size={16} /> : <IconMoonStars size={16} />} onClick={toggleColorScheme} closeMenuOnClick={false}>
            {dark ? "Light mode" : "Dark mode"}
          </Menu.Item>

          <Menu.Item onClick={openChangePassword} leftSection={<IconLock size={16} />}>
            Change password
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item color="red" leftSection={<IconLogout size={16} />} onClick={handleLogOut}>
            Log out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default UserMenu;
