import { Button, Group, Stack, Text, Title, rem } from "@mantine/core";
import { IconArrowLeft, IconLayoutDashboard } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Stack mih="100vh" align="center" justify="center" px="md" gap={0} className="pattern-bg">
      <Stack align="center" gap="xs" ta="center">
        <Title fz={rem(96)} lh={1} c="dimmed" style={{ letterSpacing: "-0.04em" }}>
          404
        </Title>

        <Text tt="uppercase" fw={700} fz="sm" style={{ letterSpacing: rem(5) }}>
          Page not found
        </Text>

        <Text c="dimmed" fz="sm" maw={420} mt="xs">
          The page you are looking for has been moved, renamed, or never existed.
        </Text>

        <Group gap="sm" mt="xl" wrap="wrap" justify="center">
          <Button variant="default" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate(-1)}>
            Go back
          </Button>

          <Button component={Link} to="/dashboard" leftSection={<IconLayoutDashboard size={16} />}>
            Go to dashboard
          </Button>
        </Group>
      </Stack>
    </Stack>
  );
};

export default NotFound;
