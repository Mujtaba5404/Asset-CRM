import { Anchor, Box, Button, Checkbox, Chip, Collapse, Group, Paper, Progress, Stack, Table, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";
import { PERMISSION_ACTIONS, describeAccess, getResourceIcon, sortActions } from "./rolePermissions";

const headingStyle = { letterSpacing: "0.05em" };


const humanize = (field) =>
  upperFirst(
    field
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/\./g, " · ")
      .toLowerCase(),
  );

const toggleItem = (list, item) => (list.includes(item) ? list.filter((value) => value !== item) : [...list, item]);

const ResourceRow = ({ resource, icon: Icon, knownFields, permission, expanded, onToggleExpanded, onChange }) => {
  const { actions, allowedUpdateFields } = permission;

  const fields = [...new Set([...knownFields, ...allowedUpdateFields])];
  const canUpdate = actions.includes("update");
  const allGranted = actions.length === PERMISSION_ACTIONS.length;

  const setActions = (nextActions) => onChange({ ...permission, actions: sortActions(nextActions) });
  const setFields = (nextFields) => onChange({ ...permission, allowedUpdateFields: fields.filter((field) => nextFields.includes(field)) });

  return (
    <>
      <Table.Tr style={canUpdate && expanded ? { borderBottom: 0 } : undefined}>
        <Table.Td>
          <Group gap="sm" wrap="nowrap">
            <Checkbox
              size="xs"
              checked={allGranted}
              indeterminate={!!actions.length && !allGranted}
              onChange={() => setActions(allGranted ? [] : PERMISSION_ACTIONS)}
              aria-label={`Toggle every ${resource} action`}
            />

            <ThemeIcon size={34} variant={actions.length ? "light" : "default"} color={actions.length ? undefined : "gray"}>
              <Icon size={18} />
            </ThemeIcon>

            <Box miw={0}>
              <Text fz="sm" fw={600} truncate>
                {resource}
              </Text>

              {canUpdate ? (
                <UnstyledButton onClick={onToggleExpanded} aria-expanded={expanded} display="block">
                  <Group gap={4} wrap="nowrap">
                    <Text fz="xs" fw={500} c="var(--mantine-primary-color-filled)" style={{ whiteSpace: "nowrap" }}>
                      Editable fields · {allowedUpdateFields.length}/{fields.length}
                    </Text>

                    <IconChevronDown
                      size={14}
                      color="var(--mantine-primary-color-filled)"
                      style={{ flexShrink: 0, transform: expanded ? "rotate(180deg)" : undefined, transition: "transform 150ms ease" }}
                    />
                  </Group>
                </UnstyledButton>
              ) : (
                <Text fz="xs" c="dimmed" truncate>
                  {describeAccess(actions)}
                </Text>
              )}
            </Box>
          </Group>
        </Table.Td>

        {PERMISSION_ACTIONS.map((action) => (
          <Table.Td key={action}>
            <Checkbox
              checked={actions.includes(action)}
              onChange={() => setActions(toggleItem(actions, action))}
              aria-label={`${upperFirst(action)} ${resource}`}
              styles={{ body: { justifyContent: "center" } }}
            />
          </Table.Td>
        ))}
      </Table.Tr>

      {canUpdate && (
        <Table.Tr>
          <Table.Td colSpan={PERMISSION_ACTIONS.length + 1} p={0}>
            <Collapse expanded={expanded}>
              <Box px="md" pb="md" pt={4}>
                <Paper p="sm" radius="md" bg="var(--mantine-color-default-hover)" withBorder={false}>
                  <Group justify="space-between" mb="xs" gap="xs">
                    <Text fz="xs" fw={650} c="dimmed" tt="uppercase" style={headingStyle}>
                      Fields this role may update
                    </Text>

                    <Group gap="sm">
                      <Anchor component="button" type="button" fz="xs" onClick={() => setFields(fields)}>
                        Select all
                      </Anchor>

                      <Anchor component="button" type="button" fz="xs" c="dimmed" onClick={() => setFields([])}>
                        Clear
                      </Anchor>
                    </Group>
                  </Group>

                  <Chip.Group multiple value={allowedUpdateFields} onChange={setFields}>
                    <Group gap={6}>
                      {fields.map((field) => (
                        <Chip key={field} value={field} size="xs" variant="outline">
                          {humanize(field)}
                        </Chip>
                      ))}
                    </Group>
                  </Chip.Group>
                </Paper>
              </Box>
            </Collapse>
          </Table.Td>
        </Table.Tr>
      )}
    </>
  );
};

/**
 * Resource × action matrix for a role.
 *
 * @param {Object} props
 * @param {Array} props.catalog - Every resource and its updatable fields: [{ resource, fields }]
 * @param {Object} props.value - Form permissions keyed by resource: { [resource]: { actions, allowedUpdateFields } }
 * @param {Function} props.onChange - Called with the next permissions object
 * @param {string} [props.error]
 */
const PermissionsEditor = ({ catalog = [], value = {}, onChange, error }) => {
  const [expanded, setExpanded] = useState([]);
  const fieldsByResource = new Map(catalog.map(({ resource, fields }) => [resource, fields]));

  const resources = Object.keys(value);
  const grantedCount = resources.reduce((total, resource) => total + value[resource].actions.length, 0);
  const maxCount = resources.length * PERMISSION_ACTIONS.length;

  const updateResource = (resource, permission) => onChange({ ...value, [resource]: permission });

  const setAllActions = (actions) => onChange(Object.fromEntries(resources.map((resource) => [resource, { ...value[resource], actions }])));

  const toggleColumn = (action, grantedEverywhere) =>
    onChange(
      Object.fromEntries(
        resources.map((resource) => {
          const { actions } = value[resource];
          const nextActions = grantedEverywhere ? actions.filter((current) => current !== action) : [...actions, action];

          return [resource, { ...value[resource], actions: sortActions(nextActions) }];
        }),
      ),
    );

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="flex-end" gap="xs">
        <Box miw={180} flex={1} maw={320}>
          <Text fz="xs" c="dimmed" mb={6}>
            {grantedCount} of {maxCount} actions granted
          </Text>

          <Progress value={maxCount ? (grantedCount / maxCount) * 100 : 0} size={6} radius="xl" />
        </Box>

        <Group gap={4}>
          <Button size="compact-xs" variant="subtle" onClick={() => setAllActions(PERMISSION_ACTIONS)}>
            Grant all
          </Button>

          <Button size="compact-xs" variant="subtle" color="gray" onClick={() => setAllActions([])}>
            Clear all
          </Button>
        </Group>
      </Group>

      <Paper withBorder p={0} style={{ overflow: "hidden", ...(error && { borderColor: "var(--mantine-color-error)" }) }}>
        <Table.ScrollContainer minWidth={560} type="native">
          <Table highlightOnHover={false} verticalSpacing="xs">
            <Table.Thead bg="var(--mantine-color-default-hover)">
              <Table.Tr>
                <Table.Th miw={230} fz="xs" fw={650} c="dimmed" tt="uppercase" style={headingStyle}>
                  Resource
                </Table.Th>

                {PERMISSION_ACTIONS.map((action) => {
                  const grantedIn = resources.filter((resource) => value[resource].actions.includes(action)).length;
                  const grantedEverywhere = !!resources.length && grantedIn === resources.length;

                  return (
                    <Table.Th key={action} w={84}>
                      <Stack gap={6} align="center">
                        <Text fz="xs" fw={650} c="dimmed" tt="uppercase" style={headingStyle}>
                          {action}
                        </Text>

                        <Checkbox
                          size="xs"
                          checked={grantedEverywhere}
                          indeterminate={!!grantedIn && !grantedEverywhere}
                          onChange={() => toggleColumn(action, grantedEverywhere)}
                          aria-label={`Toggle ${action} on every resource`}
                        />
                      </Stack>
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {resources.map((resource) => (
                <ResourceRow
                  key={resource}
                  resource={resource}
                  icon={getResourceIcon(resource)}
                  knownFields={fieldsByResource.get(resource) ?? []}
                  permission={value[resource]}
                  expanded={expanded.includes(resource)}
                  onToggleExpanded={() => setExpanded((current) => toggleItem(current, resource))}
                  onChange={(permission) => updateResource(resource, permission)}
                />
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>

      {error && (
        <Text fz="xs" c="red">
          {error}
        </Text>
      )}
    </Stack>
  );
};

export default PermissionsEditor;
