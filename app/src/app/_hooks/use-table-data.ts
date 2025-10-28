"use client";

import { useMemo } from "react";
import type { SortState, PaginationState, FilterState } from "./use-table-controller";

// ============================================================================
// Types
// ============================================================================

export interface UseTableDataOptions<T> {
  data: T[] | undefined;
  sortState: SortState;
  paginationState: PaginationState;
  filters?: FilterState;
  isLoading?: boolean;
  error?: Error | null;
}

export interface UseTableDataReturn<T> {
  // Processed data
  paginatedData: T[];
  totalCount: number;

  // States
  isLoading: boolean;
  isEmpty: boolean;
  error: Error | null;

  // Pagination info
  pageCount: number;
  currentPageRange: { start: number; end: number };
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Sort an array of objects by a specific key
 */
function sortData<T extends Record<string, unknown>>(
  data: T[],
  sortState: SortState,
): T[] {
  if (!sortState.columnId || !sortState.direction) {
    return data;
  }

  return [...data].sort((a, b) => {
    const aValue = a[sortState.columnId!];
    const bValue = b[sortState.columnId!];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // Compare values
    let comparison = 0;
    if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      comparison = aValue - bValue;
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sortState.direction === "asc" ? comparison : -comparison;
  });
}

/**
 * Filter an array of objects based on filter criteria
 */
function filterData<T extends Record<string, unknown>>(
  data: T[],
  filters: FilterState,
): T[] {
  if (Object.keys(filters).length === 0) {
    return data;
  }

  return data.filter((row) => {
    return Object.entries(filters).every(([key, value]) => {
      const rowValue = row[key];

      // Handle different filter types
      if (value === null || value === undefined || value === "") {
        return true; // Ignore empty filters
      }

      if (typeof value === "string") {
        // String filtering (case-insensitive partial match)
        return String(rowValue ?? "")
          .toLowerCase()
          .includes(value.toLowerCase());
      }

      // Exact match for other types
      return rowValue === value;
    });
  });
}

/**
 * Paginate an array
 */
function paginateData<T>(data: T[], paginationState: PaginationState): T[] {
  const { pageIndex, pageSize } = paginationState;
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
}

// ============================================================================
// useTableData Hook
// ============================================================================

/**
 * Hook for processing table data with sorting, filtering, and pagination
 * Works with client-side data processing
 *
 * @param options - Data and state configuration
 * @returns Processed data and metadata
 *
 * @example
 * ```tsx
 * const controller = useTableController();
 * const query = api.assets.getAll.useQuery();
 *
 * const tableData = useTableData({
 *   data: query.data,
 *   sortState: controller.sortState,
 *   paginationState: controller.paginationState,
 *   filters: controller.filters,
 *   isLoading: query.isLoading,
 *   error: query.error,
 * });
 *
 * <GenericTable
 *   data={tableData.paginatedData}
 *   isLoading={tableData.isLoading}
 *   isEmpty={tableData.isEmpty}
 * />
 * ```
 */
export function useTableData<T extends Record<string, unknown>>({
  data = [],
  sortState,
  paginationState,
  filters = {},
  isLoading = false,
  error = null,
}: UseTableDataOptions<T>): UseTableDataReturn<T> {
  // ============================================================================
  // Process Data (Filter -> Sort -> Paginate)
  // ============================================================================

  const processedData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        filtered: [],
        sorted: [],
        paginated: [],
        totalCount: 0,
      };
    }

    // Step 1: Filter
    const filtered = filterData(data, filters);

    // Step 2: Sort
    const sorted = sortData(filtered, sortState);

    // Step 3: Paginate
    const paginated = paginateData(sorted, paginationState);

    return {
      filtered,
      sorted,
      paginated,
      totalCount: filtered.length,
    };
  }, [data, sortState, paginationState, filters]);

  // ============================================================================
  // Derived States
  // ============================================================================

  const isEmpty = useMemo(() => {
    return !isLoading && processedData.totalCount === 0;
  }, [isLoading, processedData.totalCount]);

  const pageCount = useMemo(() => {
    return Math.ceil(processedData.totalCount / paginationState.pageSize);
  }, [processedData.totalCount, paginationState.pageSize]);

  const currentPageRange = useMemo(() => {
    const start = paginationState.pageIndex * paginationState.pageSize + 1;
    const end = Math.min(
      (paginationState.pageIndex + 1) * paginationState.pageSize,
      processedData.totalCount,
    );
    return { start, end };
  }, [paginationState, processedData.totalCount]);

  const hasNextPage = useMemo(() => {
    return (paginationState.pageIndex + 1) * paginationState.pageSize < processedData.totalCount;
  }, [paginationState, processedData.totalCount]);

  const hasPreviousPage = useMemo(() => {
    return paginationState.pageIndex > 0;
  }, [paginationState.pageIndex]);

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // Processed data
    paginatedData: processedData.paginated,
    totalCount: processedData.totalCount,

    // States
    isLoading,
    isEmpty,
    error,

    // Pagination info
    pageCount,
    currentPageRange,
    hasNextPage,
    hasPreviousPage,
  };
}
