import { Box, Button, Divider, Group, Paper, PasswordInput, SimpleGrid, Stack, Text, TextInput, ThemeIcon, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import { IconAt, IconHexagonLetterA, IconLock, IconPackage, IconShieldCheck, IconTrendingUp } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allAccessQuery, authUserId, findAccessOf } from "../../api/access";
import { useLoginMutation } from "../../api/auth";
import { toSessionAccess } from "../../hooks/useSessionAccess";

const HIGHLIGHTS = [
  { icon: IconPackage, label: "Assets tracked", value: "1,284" },
  { icon: IconShieldCheck, label: "Under warranty", value: "64%" },
  { icon: IconTrendingUp, label: "Utilisation", value: "92%" },
];

const glass = { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" };

const ring = (size, position) => ({
  position: "absolute",
  width: size,
  height: size,
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.15)",
  ...position,
});

const BrandPanel = memo(() => (
  <Box
    visibleFrom="md"
    pos="relative"
    p={40}
    c="white"
    style={{ overflow: "hidden", background: "linear-gradient(150deg, var(--mantine-color-orange-5), var(--mantine-color-orange-9) 70%, #7a2f06)" }}
  >
    <Box style={ring(420, { top: -170, left: -150 })} />
    <Box style={ring(300, { bottom: -120, left: 60 })} />

    <Stack h="100%" justify="space-between" pos="relative" gap="xl">
      <Group gap="sm">
        <ThemeIcon size={36} radius="md" variant="white" c="orange.7">
          <IconHexagonLetterA size={22} />
        </ThemeIcon>

        <Box>
          <Text fw={750} fz="lg" lh={1.1}>
            Asset360
          </Text>
          <Text fz={10.5} opacity={0.75} tt="uppercase" style={{ letterSpacing: "0.1em" }}>
            CRM
          </Text>
        </Box>
      </Group>

      <Stack gap="md">
        <Title order={2} c="white" fz={30} lh={1.2}>
          Every asset, its whole story, in one place.
        </Title>

        <Text opacity={0.85} fz="sm">
          Track purchases, warranties, conditions and lifecycle from acquisition to disposal.
        </Text>

        <Paper radius="md" p="md" style={glass} withBorder={false}>
          <SimpleGrid cols={3} spacing="sm">
            {HIGHLIGHTS.map(({ icon: Icon, label, value }) => (
              <Stack key={label} gap={4}>
                <Icon size={18} stroke={1.6} />
                <Text fw={700} fz="lg" c="white" lh={1.1}>
                  {value}
                </Text>
                <Text fz="xs" opacity={0.8} lh={1.2}>
                  {label}
                </Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Paper>
      </Stack>

      <Text fz="xs" opacity={0.7}>
        © {new Date().getFullYear()} Asset360 CRM
      </Text>
    </Stack>
  </Box>
));

BrandPanel.displayName = "BrandPanel";

const Login = () => {
  const [, setAuth] = useLocalStorage({ key: "auth", getInitialValueInEffect: false });
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const queryClient = useQueryClient();
  // Signed in, still fetching permissions: keep the button busy.
  const [opening, setOpening] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", password: "" },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Enter a valid email address"),
      password: (value) => (value.length >= 4 ? null : "Password is too short"),
    },
  });

  // The response is the profile. Permissions come from the user's Access record,
  // fetched before leaving so the app opens with its menu and pages in place
  // instead of blank. If that fails, RequireAuth asks again and explains.
  const handleSubmit = (values) => {
    loginMutation.mutate(values, {
      onSuccess: async ({ data }) => {
        let session = data;

        // Stored first: the API layer reads the token from it for the access call.
        setAuth(data);
        setOpening(true);

        try {
          // Cached, so the app shell reuses this list instead of asking again on arrival.
          const list = await queryClient.fetchQuery(allAccessQuery());
          session = { ...data, ...toSessionAccess(findAccessOf(list, authUserId(data))) };
        } catch {
          // Left to RequireAuth.
        }

        setAuth(session);
        setOpening(false);

        // The role's landing page; "/" picks the first screen the role can read.
        navigate(session?.indexPath || "/", { replace: true });
      },
    });
  };

  return (
    <Box mih="100vh" p={{ base: "md", sm: "xl" }} className="pattern-bg" style={{ display: "grid", placeItems: "center" }}>
      <Paper w="100%" maw={980} radius="lg" shadow="xl" style={{ overflow: "hidden" }}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0} mih={580}>
          <BrandPanel />

          <Stack justify="center" p={{ base: "lg", xs: "xl", sm: 56 }} gap="xl">
            <Stack gap={6}>
              <ThemeIcon hiddenFrom="md" size={44} radius="md" mb="sm">
                <IconHexagonLetterA size={24} />
              </ThemeIcon>

              <Title order={1} fz={28}>
                Welcome back
              </Title>

              <Text c="dimmed" fz="sm">
                Sign in to your Asset360 workspace to continue.
              </Text>
            </Stack>

            <Stack component="form" gap="md" onSubmit={form.onSubmit(handleSubmit)} noValidate>
              <TextInput
                required
                type="email"
                autoFocus
                autoComplete="email"
                label="Email address"
                placeholder="johndoe@example.com"
                leftSection={<IconAt size={16} stroke={1.6} />}
                leftSectionPointerEvents="none"
                key={form.key("email")}
                {...form.getInputProps("email")}
              />

              <PasswordInput
                required
                autoComplete="current-password"
                label="Password"
                placeholder="Your password"
                leftSection={<IconLock size={16} stroke={1.6} />}
                leftSectionPointerEvents="none"
                key={form.key("password")}
                {...form.getInputProps("password")}
              />

              <Button type="submit" mt="xs" fullWidth loading={loginMutation.isPending || opening}>
                Login
              </Button>

              <Divider label="Asset360 CRM" labelPosition="center" />

              <Text fz="xs" c="dimmed" ta="center">
                Trouble signing in? Contact your workspace administrator.
              </Text>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Paper>
    </Box>
  );
};

export default Login;
