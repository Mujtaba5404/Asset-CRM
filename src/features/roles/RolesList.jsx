import { Button, CloseButton, Group, Pagination, SegmentedControl, Select, Skeleton, Stack, Text, TextInput } from "@mantine/core";
import { IconAlertTriangle, IconSearch, IconSearchOff, IconShieldCheck } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { useGetRolesWithPaginationQuery } from "../../api/role";
import EmptyState from "../../components/EmptyState";
import PAGE_SIZES from "../../constants/PAGE_SIZES";
import useCanAccess from "../../hooks/useCanAccess";
import AddRoleButton from "./AddRoleButton";
import RoleFormDrawer from "./RoleFormDrawer";
import { SCOPE_OPTIONS } from "./rolePermissions";
import RolesTable, { AccessLegend } from "./RolesTable";

const SCOPE_FILTERS = [{ label: "Any scope", value: "any" }, ...SCOPE_OPTIONS.map(({ label, value }) => ({ label, value }))];

const RolesList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState("any");
  // The role outlives `opened` so the drawer keeps its title while it animates closed.
  const [editing, setEditing] = useState({ opened: false, role: null });

  const { data, isLoading, isError, error, isFetching } = useGetRolesWithPaginationQuery({ page, pageSize });

  // Stable, so memoised rows don't re-render on every keystroke in the search box.
  const openEdit = useCallback((role) => setEditing({ opened: true, role }), []);

  const canEdit = useCanAccess("role", "update");
  const canDelete = useCanAccess("role", "delete");

  const { totalCount = 0, totalPages = 1 } = data?.meta ?? {};

  // Deleting the last role on the final page would otherwise strand the view on an empty page.
  if (totalPages && page > totalPages) setPage(totalPages);

  // Search and scope narrow the page already loaded — roles are few, so one page usually holds them all.
  const roles = useMemo(() => {
    const term = search.trim().toLowerCase();

    return (data?.data ?? []).filter((role) => {
      if (scope !== "any" && role.scope !== scope) return false;
      if (!term) return true;

      return [role.title, role.indexPath, ...(role.permissions ?? []).map((permission) => permission.resource)].some((value) => value?.toLowerCase().includes(term));
    });
  }, [data, search, scope]);

  if (isLoading) {
    return (
      <Stack gap="xs">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} height={index ? 64 : 44} radius="md" />
        ))}
      </Stack>
    );
  }

  if (isError) {
    return (
      <EmptyState
        variant="error"
        title="Could not load roles"
        description={error?.response?.data?.message || error?.message}
        icon={<IconAlertTriangle size={26} />}
      />
    );
  }

  if (!totalCount) {
    return (
      <EmptyState
        title="No roles yet"
        description="Create a role to control what its users can see and do."
        icon={<IconShieldCheck size={26} />}
        action={<AddRoleButton label="Create the first role" />}
      />
    );
  }

  const clearFilters = () => {
    setSearch("");
    setScope("any");
  };

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  return (
    <Stack gap="md">
      <Group justify="space-between" gap="sm" wrap="wrap">
        <TextInput
          placeholder="Search by title, landing page or resource"
          aria-label="Search roles"
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          rightSection={search ? <CloseButton size="sm" onClick={() => setSearch("")} aria-label="Clear search" /> : null}
          w={{ base: "100%", sm: 340 }}
        />

        <SegmentedControl value={scope} onChange={setScope} data={SCOPE_FILTERS} size="sm" w={{ base: "100%", sm: "auto" }} />
      </Group>

      {roles.length ? (
        <Stack gap="xs">
          <AccessLegend />

          <RolesTable roles={roles} onEdit={openEdit} canEdit={canEdit} canDelete={canDelete} dimmed={isFetching} />
        </Stack>
      ) : (
        <EmptyState
          title="No matching roles"
          description="Try a different search term or scope."
          icon={<IconSearchOff size={26} />}
          action={
            <Button variant="default" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      )}

      {totalCount > PAGE_SIZES[0] && (
        <Group justify="space-between" gap="sm" wrap="wrap">
          <Text fz="sm" c="dimmed">
            Showing {from}–{to} of {totalCount}
          </Text>

          <Group gap="sm" wrap="wrap">
            <Select
              aria-label="Roles per page"
              data={PAGE_SIZES.map((size) => ({ value: String(size), label: `${size} / page` }))}
              value={String(pageSize)}
              onChange={(next) => {
                setPageSize(Number(next));
                setPage(1);
              }}
              w={120}
              size="xs"
            />

            <Pagination value={page} onChange={setPage} total={totalPages} size="sm" />
          </Group>
        </Group>
      )}

      <RoleFormDrawer isOpen={editing.opened} role={editing.role} onClose={() => setEditing((current) => ({ ...current, opened: false }))} />
    </Stack>
  );
};

export default RolesList;
