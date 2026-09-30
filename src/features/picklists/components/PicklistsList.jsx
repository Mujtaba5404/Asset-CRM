import { Badge, Box, Group, Paper, Skeleton, Stack, Text, Tooltip } from "@mantine/core";
import { IconAlertTriangle, IconEyeOff, IconList, IconStarFilled } from "@tabler/icons-react";
import groupBy from "lodash/groupBy";
import { useGetAllPicklistsQuery } from "../../../api/picklist";
import EmptyState from "../../../components/EmptyState";
import PicklistBadge from "../../../components/PicklistBadge";
import { usePicklists } from "../../../context/PicklistContext";
import AddPicklistModalButton from "./AddPicklistModalButton";
import DeletePicklistButton from "./DeletePicklistButton";
import EditPicklistModalButton from "./EditPicklistModalButton";

function groupPicklistsByParentPicklist(picklists = []) {
  const grouped = groupBy(picklists, (picklist) => picklist.parentPicklist?._id || null);

  return Object.values(grouped)
    .map((children) => ({ parentPicklist: children[0].parentPicklist, picklists: children }))
    .sort((a, b) => (a.parentPicklist?.title || "").localeCompare(b.parentPicklist?.title || ""));
}

const PicklistRow = ({ picklist, renderItem, withDivider }) => (
  <Group gap="sm" wrap="nowrap" px="sm" py={10} style={withDivider ? { borderTop: "1px solid var(--mantine-color-default-border)" } : undefined}>
    <Group gap="xs" wrap="wrap" mr="auto" miw={0}>
      {renderItem ? renderItem(picklist) : <PicklistBadge item={picklist} />}

      {picklist.isDefault && (
        <Tooltip label="Default value for new records" withArrow>
          <Badge size="sm" variant="light" color="orange" leftSection={<IconStarFilled size={10} />}>
            Default
          </Badge>
        </Tooltip>
      )}

      {picklist.isActive === false && (
        <Tooltip label="Hidden from new records" withArrow>
          <Badge size="sm" variant="light" color="gray" leftSection={<IconEyeOff size={11} />}>
            Inactive
          </Badge>
        </Tooltip>
      )}

      {picklist.acronym && (
        <Text fz="xs" c="dimmed" ff="monospace">
          {picklist.acronym}
        </Text>
      )}
    </Group>

    <Group gap={2} wrap="nowrap" style={{ flexShrink: 0 }}>
      <EditPicklistModalButton picklist={picklist} />
      <DeletePicklistButton picklistId={picklist._id} />
    </Group>
  </Group>
);

const PicklistsList = ({ children }) => {
  const { featureName, scope, resource, field, parentPicklist } = usePicklists();

  const { data, isLoading, isError, error } = useGetAllPicklistsQuery({ query: { scope, resource, field, parentPicklist } });

  if (isLoading) {
    return (
      <Stack gap="xs">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} height={42} radius="sm" />
        ))}
      </Stack>
    );
  }

  if (isError) {
    return <EmptyState variant="error" title={`Could not load ${featureName}`} description={error?.message} icon={<IconAlertTriangle size={26} />} />;
  }

  if (!data?.length) {
    return (
      <EmptyState
        title={`No ${featureName} yet`}
        description="Values you add here become selectable everywhere this list is used."
        icon={<IconList size={26} />}
        action={<AddPicklistModalButton />}
      />
    );
  }

  const grouped = groupPicklistsByParentPicklist(data);

  return (
    <Stack gap="md">
      {grouped.map(({ parentPicklist: parent, picklists }) => (
        <Box key={parent?._id || "ungrouped"}>
          {parent && (
            <Group gap="xs" mb="xs">
              <Text fz="sm" fw={650} tt="capitalize">
                {parent.title}
              </Text>

              <Badge size="sm" variant="default">
                {picklists.length}
              </Badge>
            </Group>
          )}

          <Paper style={{ overflow: "hidden" }}>
            {picklists.map((picklist, index) => (
              <PicklistRow key={picklist._id} picklist={picklist} renderItem={children} withDivider={index > 0} />
            ))}
          </Paper>
        </Box>
      ))}
    </Stack>
  );
};

export default PicklistsList;
