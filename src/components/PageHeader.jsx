import { ActionIcon, Anchor, Box, Breadcrumbs, Group, Stack, Text, Title, Tooltip } from "@mantine/core";
import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Standard page masthead: optional breadcrumbs, a back affordance, the title,
 * a one-line description and right-aligned actions.
 *
 * Actions drop under the title on narrow screens instead of squeezing it.
 */
const PageHeader = ({ title, description, breadcrumbs = [], actions, backTo, meta }) => {
  const navigate = useNavigate();

  return (
    <Stack gap="xs" mb="md">
      {breadcrumbs.length > 0 && (
        <Breadcrumbs separator={<IconChevronRight size={13} style={{ color: "var(--mantine-color-dimmed)" }} />} separatorMargin={6}>
          {breadcrumbs.map((crumb) =>
            crumb.to ? (
              <Anchor key={crumb.label} component={Link} to={crumb.to} fz="xs" c="dimmed">
                {crumb.label}
              </Anchor>
            ) : (
              <Text key={crumb.label} fz="xs" c="dimmed" fw={500}>
                {crumb.label}
              </Text>
            ),
          )}
        </Breadcrumbs>
      )}

      <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
        <Group gap="sm" wrap="nowrap" align="flex-start" miw={0} style={{ flex: "1 1 260px" }}>
          {backTo !== undefined && (
            <Tooltip label="Back" withArrow>
              <ActionIcon size="lg" variant="default" mt={2} onClick={() => (backTo ? navigate(backTo) : navigate(-1))} aria-label="Go back">
                <IconArrowLeft size={18} />
              </ActionIcon>
            </Tooltip>
          )}

          <Box miw={0}>
            <Group gap="sm" wrap="wrap" align="center">
              <Title order={1} fz={{ base: "h3", sm: "h2" }}>
                {title}
              </Title>

              {meta}
            </Group>

            {description && (
              <Text fz="sm" c="dimmed" mt={4}>
                {description}
              </Text>
            )}
          </Box>
        </Group>

        {actions && (
          <Group gap="xs" wrap="wrap" style={{ flexShrink: 0 }}>
            {actions}
          </Group>
        )}
      </Group>
    </Stack>
  );
};

export default PageHeader;
