import { Button, Code, Group, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";
import { Component } from "react";

/**
 * Catches render errors so a failure shows a message instead of a blank page.
 *
 * The case this exists for: a lazily loaded route chunk that fails to download.
 * React.lazy rejections are thrown during render, and <Suspense> does not catch
 * them — only an error boundary does. That happens in development when the dev
 * server's module graph goes stale after files are renamed or deleted, and in
 * production when a visitor holds an old index.html after a redeploy, so the
 * hashed chunk it asks for no longer exists.
 */
const isChunkLoadError = (error) => /dynamically imported module|Loading chunk|Importing a module script failed|Failed to fetch/i.test(error?.message ?? "");

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info?.componentStack);
  }

  render() {
    const { error } = this.state;

    if (!error) return this.props.children;

    const stale = isChunkLoadError(error);

    return (
      <Stack align="center" justify="center" mih="100vh" p="xl" gap="md">
        <ThemeIcon size={56} radius="xl" variant="light" color="red">
          <IconAlertTriangle size={28} />
        </ThemeIcon>

        <Stack align="center" gap={6} ta="center" maw={560}>
          <Title order={2}>{stale ? "This page failed to load" : "Something went wrong"}</Title>

          <Text c="dimmed" fz="sm">
            {stale
              ? "Part of the app could not be downloaded. This usually means a newer version was deployed — reloading picks it up."
              : "An unexpected error stopped this screen from rendering. The details below are also in the browser console."}
          </Text>
        </Stack>

        <Code block maw={720} w="100%" style={{ whiteSpace: "pre-wrap", maxHeight: 220, overflow: "auto" }}>
          {error.message || String(error)}
        </Code>

        <Group gap="sm">
          <Button leftSection={<IconRefresh size={16} />} onClick={() => window.location.reload()}>
            Reload page
          </Button>

          <Button variant="default" onClick={() => this.setState({ error: null })}>
            Try again
          </Button>
        </Group>
      </Stack>
    );
  }
}

export default ErrorBoundary;
