import { Badge, Box, CloseButton, NavLink, ScrollArea, Stack, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PICKLIST_GROUPS, PICKLIST_ITEMS } from "../picklistRegistry";

/** Above this many lists, a flat list stops being scannable and search earns its place. */
const SEARCH_THRESHOLD = 10;

const matches = (text, term) => text.toLowerCase().includes(term);

const linkStyles = {
  root: { borderRadius: "var(--mantine-radius-sm)", minHeight: 36 },
  label: { fontSize: "var(--mantine-font-size-sm)" },
};

const ItemLink = ({ item, activeSlug, onNavigate }) => {
  const active = item.slug === activeSlug;

  return (
    <NavLink
      component={Link}
      to={`/settings/picklists/${item.slug}`}
      onClick={onNavigate}
      label={item.label}
      active={active}
      styles={linkStyles}
      leftSection={
        <Box
          w={6}
          h={6}
          style={{ borderRadius: "50%", background: active ? "var(--mantine-primary-color-filled)" : "var(--mantine-color-default-border)" }}
        />
      }
    />
  );
};

/**
 * Secondary navigation for the picklists area.
 *
 * Adapts to how many lists are registered: a flat list while there are few,
 * collapsible groups once there is more than one group, and a search box once
 * the list outgrows scanning.
 */
const PicklistsNav = ({ onNavigate }) => {
  // Read the slug off the path, not useParams: this component renders in the
  // parent settings route, which does not see the child route's :slug param.
  const { pathname } = useLocation();
  const activeSlug = pathname.split("/").filter(Boolean).pop();

  const [search, setSearch] = useState("");

  const withSearch = PICKLIST_ITEMS.length > SEARCH_THRESHOLD;
  const withGroups = PICKLIST_GROUPS.length > 1;

  const term = withSearch ? search.trim().toLowerCase() : "";

  const groups = PICKLIST_GROUPS.map((group) => {
    if (!term) return group;

    // A group matching by name keeps all of its items; otherwise filter inside it.
    if (matches(group.label, term)) return group;

    return { ...group, items: group.items.filter((item) => matches(item.label, term)) };
  }).filter((group) => group.items.length > 0);

  return (
    <Stack gap="xs" h="100%">
      {withSearch && (
        <TextInput
          placeholder="Search lists…"
          aria-label="Search picklists"
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          rightSection={search ? <CloseButton size="sm" onClick={() => setSearch("")} aria-label="Clear search" /> : null}
        />
      )}

      {!groups.length ? (
        <Text fz="sm" c="dimmed" ta="center" py="lg">
          No lists match “{search}”.
        </Text>
      ) : (
        <ScrollArea flex={1} scrollbarSize={4} type="hover" offsetScrollbars>
          <Stack gap={2} pr={4}>
            {groups.map((group) =>
              withGroups ? (
                <NavLink
                  key={group.key}
                  label={group.label}
                  variant="subtle"
                  leftSection={<group.icon size={18} stroke={1.6} />}
                  rightSection={
                    <Badge size="xs" circle variant="default">
                      {group.items.length}
                    </Badge>
                  }
                  defaultOpened={group.items.some((item) => item.slug === activeSlug) || !!term}
                  childrenOffset={14}
                  styles={{ root: { borderRadius: "var(--mantine-radius-md)" }, label: { fontWeight: 600, fontSize: "var(--mantine-font-size-sm)" } }}
                >
                  {group.items.map((item) => (
                    <ItemLink key={item.slug} item={item} activeSlug={activeSlug} onNavigate={onNavigate} />
                  ))}
                </NavLink>
              ) : (
                <Fragment key={group.key}>
                  {group.items.map((item) => (
                    <ItemLink key={item.slug} item={item} activeSlug={activeSlug} onNavigate={onNavigate} />
                  ))}
                </Fragment>
              ),
            )}
          </Stack>
        </ScrollArea>
      )}
    </Stack>
  );
};

export default PicklistsNav;
