import { ActionIcon, Avatar, Box, Menu, Text, Tooltip, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { IconLock, IconLogout, IconMoonStars, IconSunHigh, IconUser, IconUserShield } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../api/auth";
import ChangePasswordModal from "../features/auth/ChangePasswordModal";
import CanAccess from "./CanAccess";

const UserMenu = () => {
  const [auth, , removeAuth] = useLocalStorage({ key: "auth", getInitialValueInEffect: false });
  const [, , removeGlobalFilters] = useLocalStorage({ key: "globalFilters", getInitialValueInEffect: false });

  const navigate = useNavigate();

  const { toggleColorScheme } = useMantineColorScheme();
  const dark = useComputedColorScheme("light", { getInitialValueInEffect: true }) === "dark";

  const [changePasswordOpened, { open: openChangePassword, close: closeChangePassword }] = useDisclosure(false);

  const logoutMutation = useLogoutMutation();
  const queryClient = useQueryClient();

  /**
   * Auth360 clears the session cookies; this side drops the stored profile
   * either way, so a failed call can never strand someone in a signed-in shell.
   */
  const handleLogOut = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        removeAuth();
        removeGlobalFilters();
        queryClient.clear();

        navigate("/login", { replace: true });
      },
    });
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
            {auth?.accessRoles?.length > 0 && (
              <Text fz="xs" c="dimmed" tt="capitalize" truncate>
                Role · {auth.accessRoles.map((role) => role.title).join(", ")}
              </Text>
            )}
          </Box>

          <Menu.Divider />

          <Menu.Item leftSection={dark ? <IconSunHigh size={16} /> : <IconMoonStars size={16} />} onClick={toggleColorScheme} closeMenuOnClick={false}>
            {dark ? "Light mode" : "Dark mode"}
          </Menu.Item>

          {/* Who can sign in, and with which role — shown only to roles that may manage it. */}
          <CanAccess resource="access" action="read">
            <Menu.Item component={Link} to="/access" leftSection={<IconUserShield size={16} />}>
              Access
            </Menu.Item>
          </CanAccess>

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
