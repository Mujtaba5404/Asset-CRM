import { useState } from "react";
import PAGE_SIZES from "../constants/PAGE_SIZES";

const useTablePagination = ({
  initialPage = 1,
  initialPageSize = PAGE_SIZES[1],
  initialSort = { columnAccessor: "createdAt", direction: "desc" },
  resetPageOn = [],
} = {}) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortStatus, setSortStatus] = useState(initialSort);

  const sortString = sortStatus.direction === "desc" ? `-${sortStatus.columnAccessor}` : sortStatus.direction === "asc" ? sortStatus.columnAccessor : undefined;

  // Page 7 of a filter that now returns 12 rows is an empty screen, so any change
  // to the page size or the query resets to the first page.
  //
  // This adjusts state during render rather than in an effect: an effect would
  // render the stale page once, then re-render — a visible flash of the wrong
  // page plus a wasted request.
  const resetKey = JSON.stringify([pageSize, resetPageOn]);
  const [lastResetKey, setLastResetKey] = useState(resetKey);

  if (lastResetKey !== resetKey) {
    setLastResetKey(resetKey);
    setPage(initialPage);
  }

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    sortStatus,
    setSortStatus,
    sortString,
  };
};

export default useTablePagination;
