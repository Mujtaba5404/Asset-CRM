import { Box, Group, Pagination, Paper, Select, SimpleGrid, Skeleton, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconAlertTriangle, IconFiles } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import PAGE_SIZES from "../constants/PAGE_SIZES";
import useTablePagination from "../hooks/useTablePagination";
import EmptyState from "./EmptyState";

const DEFAULT_TABLE_PROPS = {
  withColumnBorders: false,
  withRowBorders: true,
  withTableBorder: true,
  borderRadius: "md",
  striped: false,
  highlightOnHover: true,
  pinLastColumn: true,
  rowStyle: () => ({ height: 56 }),
};

/**
 * @typedef {Object} PaginatedTableProps
 *
 * @property {Function} queryHook
 * React Query hook used to fetch paginated data.
 *
 * Expected API call shape:
 * queryHook({ page, pageSize, sort, query })
 *
 * @property {Object} [queryParams] Additional parameters passed to the API query.
 * @property {Array} columns Mantine DataTable column definitions.
 * @property {Array<string>} [hideColumns] List of column accessors to hide.
 * @property {boolean} [enableSelection] Enables row selection.
 * @property {Array<Object>} [selectedRecords] Currently selected rows.
 * @property {Function} [onSelectedRecordsChange] Callback when selected rows change.
 * @property {Function} [renderCard] Renders one record as a card. When supplied, narrow
 * viewports get a card list instead of a horizontally scrolling table — same query,
 * same pagination, no duplicated fetch.
 * @property {React.ReactNode} [emptyAction] Call to action shown in the empty state.
 * @property {Object} [tableProps] Additional props forwarded to Mantine DataTable.
 */

/**
 * Generic reusable paginated data view.
 *
 * Features:
 * - Server side pagination and sorting
 * - Optional row selection and column hiding
 * - Responsive: data table on desktop, cards on phones
 * - Dims stale data on refetch rather than flashing skeletons
 *
 * @param {PaginatedTableProps} props
 */
const PaginatedTable = ({
  queryHook,
  queryParams = {},
  columns,
  hideColumns = [],
  enableSelection = false,
  selectedRecords,
  onSelectedRecordsChange,
  renderCard,
  emptyTitle = "No records to display",
  emptyDescription,
  emptyAction,
  tableProps = {},
}) => {
  const { page, setPage, pageSize, setPageSize, sortStatus, setSortStatus, sortString } = useTablePagination({ resetPageOn: [queryParams] });

  const isNarrow = useMediaQuery("(max-width: 48em)");

  const { data, isLoading, isFetching, isError, error } = queryHook({ page, pageSize, sort: sortString, query: queryParams });

  const records = data?.data ?? [];
  const totalRecords = data?.meta?.totalCount ?? 0;
  const totalPages = Math.max(Math.ceil(totalRecords / pageSize), 1);

  const visibleColumns = columns.filter((column) => !hideColumns.includes(column.accessor));

  const useCards = isNarrow && typeof renderCard === "function";

  if (useCards) {
    if (isError) {
      return <EmptyState variant="error" title="Could not load records" description={error?.message} icon={<IconAlertTriangle size={26} />} />;
    }

    if (isLoading) {
      return (
        <Stack gap="sm">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} height={132} radius="md" />
          ))}
        </Stack>
      );
    }

    if (!records.length) {
      return <EmptyState title={emptyTitle} description={emptyDescription} icon={<IconFiles size={26} />} action={emptyAction} />;
    }

    return (
      <Stack gap="sm">
        {/* Stale data stays on screen at reduced opacity — no layout jump. */}
        <SimpleGrid cols={1} spacing="sm" style={{ opacity: isFetching ? 0.55 : 1, transition: "opacity 150ms ease" }}>
          {records.map((record) => (
            <Box key={record._id}>{renderCard(record)}</Box>
          ))}
        </SimpleGrid>

        <Paper p="xs">
          <Group justify="space-between" gap="sm" wrap="wrap">
            <Text fz="xs" c="dimmed">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalRecords)} of {totalRecords}
            </Text>

            <Group gap="xs" wrap="nowrap">
              <Select
                size="xs"
                w={78}
                searchable={false}
                allowDeselect={false}
                aria-label="Records per page"
                data={PAGE_SIZES.map(String)}
                value={String(pageSize)}
                onChange={(value) => value && setPageSize(Number(value))}
              />

              <Pagination size="sm" siblings={0} total={totalPages} value={page} onChange={setPage} />
            </Group>
          </Group>
        </Paper>
      </Stack>
    );
  }

  return (
    <DataTable
      {...DEFAULT_TABLE_PROPS}
      {...tableProps}
      idAccessor="_id"
      fetching={isLoading || isFetching}
      columns={visibleColumns}
      height={records.length > 10 ? 560 : undefined}
      minHeight={!totalRecords ? 260 : undefined}
      page={page}
      onPageChange={setPage}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      records={records}
      totalRecords={totalRecords}
      recordsPerPage={pageSize}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      {...(enableSelection && { selectedRecords, onSelectedRecordsChange })}
      emptyState={
        isError ? (
          <EmptyState withBorder={false} variant="error" title="Could not load records" description={error?.message} icon={<IconAlertTriangle size={26} />} />
        ) : (
          <EmptyState withBorder={false} title={emptyTitle} description={emptyDescription} icon={<IconFiles size={26} />} action={emptyAction} />
        )
      }
    />
  );
};

export default PaginatedTable;
