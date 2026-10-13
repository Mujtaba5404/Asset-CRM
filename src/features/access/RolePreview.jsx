import { Badge, Group, Paper, Stack, Text, Tooltip } from "@mantine/core";
import { describeAccess, getResourceIcon, sortActions } from "../roles/rolePermissions";

/** What a role lets its users see and do, one chip per resource. */
const RolePreview = ({ role }) => {
  const granted = (role?.permissions ?? []).map(({ resource, actions }) => ({ resource, actions: sortActions(actions) })).filter(({ actions }) => actions.length);

  return (
    <Paper p="sm" withBorder>
      <Stack gap={8}>
        <Text fz="xs" c="dimmed" fw={500}>
          {granted.length ? `This user will be able to use ${granted.length} ${granted.length === 1 ? "resource" : "resources"}` : "This role grants no access yet"}
        </Text>

        {granted.length > 0 && (
          <Group gap={6} wrap="wrap">
            {granted.map(({ resource, actions }) => {
              const Icon = getResourceIcon(resource);

              return (
                <Tooltip key={resource} label={`${describeAccess(actions)} · ${actions.join(", ")}`} withArrow>
                  <Badge variant="light" tt="none" fw={500} leftSection={<Icon size={12} />} style={{ cursor: "default" }}>
                    {resource}
                  </Badge>
                </Tooltip>
              );
            })}
          </Group>
        )}
      </Stack>
    </Paper>
  );
};

export default RolePreview;
