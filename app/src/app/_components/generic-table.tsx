"use client";

import { type ReactNode } from "react";
import { IntersectionObserver } from "@/app/_components/shared/IntersectionObserver";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                         GENERIC TABLE COMPONENT                           ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  A highly flexible, reusable table component for infinite scroll          ║
 * ║  and paginated data with TanStack Query integration.                      ║
 * ║                                                                           ║
 * ║  FEATURES:                                                                ║
 * ║  • Infinite scroll with IntersectionObserver                              ║
 * ║  • Loading states (initial + fetching more)                               ║
 * ║  • Empty state handling                                                   ║
 * ║  • Error state handling                                                   ║
 * ║  • Generic header context (pass state/callbacks to header)                ║
 * ║  • Customizable render functions for rows, loading, empty states          ║
 * ║  • Configurable trigger offset for loading more data                      ║
 * ║                                                                           ║
 * ║  TABLE STRUCTURE:                                                         ║
 * ║  ┌─────────────────────────────────────────────────────────────────┐      ║
 * ║  │ <thead> HEADER (with optional context)                          │      ║
 * ║  ├─────────────────────────────────────────────────────────────────┤      ║
 * ║  │ <tbody>                                                         │      ║
 * ║  │   - Loading skeletons (if isLoading)                            │      ║
 * ║  │   - Empty state (if no data)                                    │      ║
 * ║  │   - Data rows (map through data)                                │      ║
 * ║  │     • IntersectionObserver trigger (near end)                   │      ║
 * ║  │   - Fetching more skeletons (if isFetchingNextPage)             │      ║
 * ║  │ </tbody>                                                        │      ║
 * ║  ├─────────────────────────────────────────────────────────────────┤      ║
 * ║  │ <tfoot> FOOTER (optional)                                       │      ║
 * ║  └─────────────────────────────────────────────────────────────────┘      ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

/**
 * TableProps<T, K>
 *
 * Generic table component props with two type parameters:
 * @template T - The data type for each row (e.g., AssetDTO, User, Product)
 * @template K - Optional context type passed to renderHeader (e.g., sorting state)
 *
 * @example
 * // Without header context
 * <Table<AssetDTO>
 *   data={assets}
 *   renderHeader={() => <tr><th>Name</th></tr>}
 *   renderRow={(asset) => <tr><td>{asset.name}</td></tr>}
 * />
 *
 * @example
 * // With header context for sorting
 * type HeaderContext = {
 *   sortField: string;
 *   setSortField: (field: string) => void;
 * };
 *
 * <Table<AssetDTO, HeaderContext>
 *   data={assets}
 *   renderHeader={(ctx) => (
 *     <tr>
 *       <th onClick={() => ctx?.setSortField('name')}>Name</th>
 *     </tr>
 *   )}
 *   renderHeaderContext={{ sortField, setSortField }}
 *   renderRow={(asset) => <tr><td>{asset.name}</td></tr>}
 * />
 */
export interface TableProps<T, K = undefined> {
  // ============================================================================
  // DATA & RENDERING
  // ============================================================================

  /** Array of data items to display in the table */
  data: T[];

  /**
   * Optional context object passed to renderHeader
   * Useful for passing state setters (e.g., sorting, filtering controls)
   */
  renderHeaderContext?: K;

  /**
   * Function to render the table header
   * Receives optional context (K) for interactive headers
   */
  renderHeader: (props: K | undefined) => ReactNode;

  /**
   * Function to render each data row
   * @param item - The data item for this row
   * @param index - The index of this item in the data array
   */
  renderRow: (item: T, index: number) => ReactNode;

  /**
   * Function to render loading skeleton rows
   * Called for each pageLimit during initial load or fetching more
   */
  renderLoadingRow?: () => ReactNode;

  /**
   * Function to render empty state when no data is available
   * Only shown when not loading and data array is empty
   */
  renderEmptyRow?: () => ReactNode;

  /**
   * Function to render table footer (optional)
   * Useful for pagination controls or summary information
   */
  renderFooter?: () => ReactNode;

  // ============================================================================
  // TANSTACK QUERY INTEGRATION
  // ============================================================================

  /** Number of skeleton rows to show during loading states */
  pageLimit?: number;

  /** Initial loading state - shows skeleton rows for entire first page */
  isLoading?: boolean;

  /** Whether there are more pages to fetch (enables IntersectionObserver) */
  hasNextPage?: boolean;

  /** Callback to fetch the next page when user scrolls near the end */
  fetchNextPage?: () => void;

  /** Whether currently fetching next page - shows additional skeleton rows */
  isFetchingNextPage?: boolean;

  /**
   * Error state - disables IntersectionObserver to prevent infinite loops
   * IMPORTANT: Pass this to prevent continuous failed fetch attempts
   */
  isError?: boolean;

  // ============================================================================
  // INFINITE SCROLL CONFIGURATION
  // ============================================================================

  /**
   * Number of rows from the end to trigger fetchNextPage
   * @default 5
   * @example triggerOffset={10} - Trigger when user is 10 rows from bottom
   *
   * Must be between 0 and pageLimit, otherwise throws error
   */
  triggerOffset?: number;

  /**
   * IntersectionObserver rootMargin (how far before trigger enters viewport)
   * @default "200px"
   * @example rootMargin="500px" - Start fetching 500px before trigger is visible
   */
  rootMargin?: string;

  // ============================================================================
  // STYLING & MISC
  // ============================================================================

  /** Additional CSS classes for the table container */
  className?: string;

  /** Additional children to render inside table element (rare use case) */
  children?: ReactNode;
}

/**
 * Props for internal table sub-components (Header, Body, Footer)
 */
interface GenericTableComponentsProps {
  children: ReactNode;
  className?: string;
}

// ============================================================================
// Table Header Component
// ============================================================================

/**
 * TableHeader
 *
 * Renders the <thead> element with consistent styling
 * Used internally by the Table component
 */
function TableHeader({
  children,
  className = "",
}: GenericTableComponentsProps) {
  return (
    <thead className={`border-b border-white/10 bg-white/5 ${className}`}>
      {children}
    </thead>
  );
}

// ============================================================================
// Table Body Component
// ============================================================================

/**
 * TableBody
 *
 * Renders the <tbody> element
 * Contains all data rows, loading states, and empty states
 * Used internally by the Table component
 */
function TableBody({ children, className = "" }: GenericTableComponentsProps) {
  return <tbody className={className}>{children}</tbody>;
}

// ============================================================================
// Table Footer Component
// ============================================================================

/**
 * TableFooter
 *
 * Renders the <tfoot> element with consistent styling
 * Used internally by the Table component
 * Optional - only rendered if renderFooter prop is provided
 */
function TableFooter({
  children,
  className = "",
}: GenericTableComponentsProps) {
  return (
    <tfoot className={`border-t border-white/10 bg-white/5 ${className}`}>
      {children}
    </tfoot>
  );
}

// ============================================================================
// Main Table Component
// ============================================================================

/**
 * Table<T, K>
 *
 * A fully-featured table component with infinite scroll support.
 *
 * FLOW DIAGRAM:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ 1. INITIAL LOAD (isLoading = true)                                  │
 * │    → Shows pageLimit skeleton rows                                  │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ 2. DATA LOADED (data.length > 0)                                    │
 * │    → Renders actual data rows                                       │
 * │    → Places IntersectionObserver trigger at (length - triggerOffset)│
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ 3. USER SCROLLS NEAR END                                            │
 * │    → IntersectionObserver fires                                     │
 * │    → Calls fetchNextPage()                                          │
 * │    → isFetchingNextPage = true                                      │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ 4. FETCHING MORE (isFetchingNextPage = true)                        │
 * │    → Shows pageLimit skeleton rows below existing data              │
 * │    → Existing data remains visible                                  │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ 5. MORE DATA LOADED                                                 │
 * │    → New data appended to existing data array                       │
 * │    → Trigger moves to new position (near new end)                   │
 * │    → Repeat from step 3 if hasNextPage = true                       │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * ERROR HANDLING:
 * • isError = true → IntersectionObserver disabled
 * • Prevents infinite fetch loops on failed requests
 * • User can manually retry via UI controls
 *
 * @template T - Row data type
 * @template K - Header context type (optional)
 */
export function Table<T, K = undefined>({
  data,
  renderHeaderContext,
  renderHeader,
  renderRow,
  renderLoadingRow,
  renderEmptyRow,
  renderFooter,
  isLoading = false,
  pageLimit = 10,
  isFetchingNextPage = false,
  hasNextPage = false,
  fetchNextPage,
  isError = false,
  triggerOffset = 5,
  rootMargin = "200px",
  className = "",
  children,
}: TableProps<T, K>) {
  const isEmpty = !isLoading && data.length === 0;

  const handleLoadMore = () => {
    if (isError || !hasNextPage || isFetchingNextPage || !fetchNextPage) {
      return;
    }
    fetchNextPage();
  };

  if (triggerOffset < 0 || triggerOffset > pageLimit) {
    throw new Error(
      `triggerOffset (${triggerOffset}) must be between 0 and pageLimit (${pageLimit})`,
    );
  }

  return (
    <div
      className={`overflow-x-auto rounded-lg border border-white/10 ${className}`}
    >
      <table className="w-full">
        <TableHeader>{renderHeader(renderHeaderContext)}</TableHeader>

        <TableBody>
          {isLoading &&
            Array.from({ length: pageLimit }).map((_, index) => (
              <tr key={`loading-${index}`}>{renderLoadingRow?.()}</tr>
            ))}

          {!isLoading && isEmpty && renderEmptyRow?.()}

          {!isLoading &&
            !isEmpty &&
            data.map((item, index) => {
              const isNearEnd = index === data.length - triggerOffset;
              const shouldShowTrigger =
                isNearEnd && hasNextPage && !isFetchingNextPage && !isError;

              return (
                <>
                  {/* Render the actual data row */}
                  {renderRow(item, index)}
                  {/* IntersectionObserver trigger row */}
                  {shouldShowTrigger && (
                    <tr key={`trigger-${index}`}>
                      <td colSpan={100} className="p-0">
                        <IntersectionObserver
                          onIntersect={handleLoadMore}
                          enabled={!isFetchingNextPage && !isError}
                          rootMargin={rootMargin}
                          className="h-1"
                        />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}

          {isFetchingNextPage &&
            Array.from({ length: pageLimit }).map((_, index) => (
              <tr key={`fetching-${index}`}>{renderLoadingRow?.()}</tr>
            ))}
        </TableBody>

        {renderFooter && <TableFooter>{renderFooter()}</TableFooter>}

        {children}
      </table>
    </div>
  );
}

export default Table;
