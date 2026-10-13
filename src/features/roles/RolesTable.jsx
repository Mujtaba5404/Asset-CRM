import { ActionIcon, Badge, Box, Code, Group, Paper, Table, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { IconPencil, IconShieldCheck } from "@tabler/icons-react";
import { memo } from "react";
import capitalizeLetters from "../../utils/capitalizeLetters";
import formatDate from "../../utils/formatDate";
import DeleteRoleButton from "./DeleteRoleButton";
import { PERMISSION_ACTIONS, SCOPE_BY_VALUE, getResourceIcon, sortActions } from "./rolePermissions";


const ACCESS_LEVELS = {
  full: { label: "Full access", color: "teal" },
  custom: { label: "Custom", color: "orange" },
  read: { label: "Read only", color: "blue" },
};

const levelOf = (actions) => {
  if (actions.length === PERMISSION_ACTIONS.length) return "full";
  if (actions.length === 1 && actions[0] === "read") return "read";

  return "custom";
};


const describeActions = (actions) => `Can ${actions.length > 1 ? `${actions.slice(0, -1).join(", ")} and ${actions.at(-1)}` : actions[0]}`;

const headingStyle = { letterSpacing: "0.05em" };

const Dot = ({ color, size = 7 }) => <Box w={size} h={size} style={{ borderRadius: 999, background: `var(--mantine-color-${color}-filled)`, flexShrink: 0 }} />;

export const AccessLegend = () => (
  <Group gap="md" wrap="wrap">
    {Object.values(ACCESS_LEVELS).map(({ label, color }) => (
      <Group key={label} gap={6} wrap="nowrap">
        <Dot color={color} />

        <Text fz="xs" c="dimmed">
          {label}
        </Text>
      </Group>
    ))}
  </Group>
);

const ResourceChip = ({ resource, icon: Icon, actions }) => {
  const level = ACCESS_LEVELS[levelOf(actions)];

  return (
    <Tooltip label={`${resource} · ${describeActions(actions)}`} withArrow openDelay={150}>
      <Badge variant="light" color={level.color} size="md" radius="sm" tt="none" fw={500} leftSection={<Icon size={12} />} style={{ cursor: "default" }}>
        {resource}
      </Badge>
    </Tooltip>
  );
};

const RoleRow = memo(({ role, onEdit, canEdit, canDelete }) => {
  const scope = SCOPE_BY_VALUE.get(role.scope);
  const granted = (role.permissions ?? [])
    .map(({ resource, actions }) => ({ resource, icon: getResourceIcon(resource), actions: sortActions(actions) }))
    .filter(({ actions }) => actions.length);

  return (
    <Table.Tr>
      <Table.Td>
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={38} radius="md" variant="light" color={scope?.color ?? "gray"}>
            <IconShieldCheck size={20} />
          </ThemeIcon>

          <Box miw={0}>
            <Text fz="sm" fw={650} truncate>
              {capitalizeLetters(role.title)}
            </Text>

            <Text fz="xs" c="dimmed">
              {granted.length ? `${granted.length} ${granted.length === 1 ? "resource" : "resources"}` : "No access granted"}
            </Text>
          </Box>
        </Group>
      </Table.Td>

      <Table.Td>
        {scope ? (
          <Tooltip label={scope.description} withArrow>
            <Badge variant="dot" color={scope.color} size="md" tt="none" fw={500} style={{ cursor: "default" }}>
              {scope.label}
            </Badge>
          </Tooltip>
        ) : (
          <Text fz="sm" c="dimmed">
            —
          </Text>
        )}
      </Table.Td>

      <Table.Td>
        {granted.length ? (
          <Group gap={6} wrap="wrap">
            {granted.map((resource) => (
              <ResourceChip key={resource.resource} {...resource} />
            ))}
          </Group>
        ) : (
          <Text fz="sm" c="dimmed">
            —
          </Text>
        )}
      </Table.Td>

      <Table.Td>
        <Code fz="xs">{role.indexPath || "/"}</Code>
      </Table.Td>

      <Table.Td>
        <Text fz="sm" c="dimmed" style={{ whiteSpace: "nowrap" }}>
          {formatDate(role.updatedAt)}
        </Text>
      </Table.Td>

      <Table.Td>
        <Group gap={2} wrap="nowrap" justify="flex-end">
          {canEdit && (
            <Tooltip label="Edit role" withArrow>
              <ActionIcon variant="subtle" color="gray" onClick={() => onEdit(role)} aria-label="Edit role">
                <IconPencil size={18} />
              </ActionIcon>
            </Tooltip>
          )}

          {canDelete && <DeleteRoleButton roleId={role._id} tooltip={{ label: "Delete role", withArrow: true }} />}
        </Group>
      </Table.Td>
    </Table.Tr>
  );
});

RoleRow.displayName = "RoleRow";

const RolesTable = ({ roles, onEdit, canEdit, canDelete, dimmed = false }) => (
  <Paper p={0} style={{ overflow: "hidden", opacity: dimmed ? 0.6 : 1, transition: "opacity 150ms ease" }}>
    <Table.ScrollContainer minWidth={860} type="native">
      <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
        <Table.Thead bg="var(--mantine-color-default-hover)">
          <Table.Tr>
            {["Role", "Scope", "Access", "Landing page", "Updated"].map((heading) => (
              <Table.Th key={heading} fz="xs" fw={650} c="dimmed" tt="uppercase" style={headingStyle}>
                {heading}
              </Table.Th>
            ))}

            <Table.Th w={90} />
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {roles.map((role) => (
            <RoleRow key={role._id} role={role} onEdit={onEdit} canEdit={canEdit} canDelete={canDelete} />
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  </Paper>
);

export default RolesTable;
