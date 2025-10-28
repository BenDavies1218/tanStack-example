# Generic Table Component

A comprehensive, reusable table system with built-in support for sorting, pagination, and filtering. Works with both server-side and client-side data processing.

## Components

### GenericTable

The main table component that renders data with automatic loading states, empty states, and customizable columns.

```tsx
import { GenericTable } from "@/app/_components/generic-table";

<GenericTable
  columns={columns}
  data={data}
  isLoading={false}
  isEmpty={false}
  emptyMessage="No data available"
  loadingRows={5}
/>
```

**Props:**

- `columns` - Array of column definitions (required)
- `data` - Array of data objects (required)
- `isLoading` - Show loading skeleton rows
- `isEmpty` - Show empty state message
- `emptyMessage` - Custom message for empty state
- `loadingRows` - Number of skeleton rows to show while loading
- `className` - Additional CSS classes
- `children` - Optional footer content (typically `TableFooter`)

### TableHeader, TableBody, TableFooter, TableRow, TableCell

Individual table components that can be composed together for custom layouts.

```tsx
import {
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
} from "@/app/_components/generic-table";

<table>
  <TableHeader>
    <TableRow>
      <TableCell isHeader>Name</TableCell>
      <TableCell isHeader align="right">Price</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Bitcoin</TableCell>
      <TableCell align="right">$50,000</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={2}>Footer content</TableCell>
    </TableRow>
  </TableFooter>
</table>
```

## Hooks

### useTableController

Manages table state including sorting, pagination, and filtering.

```tsx
import { useTableController } from "@/app/_hooks/use-table-controller";

const controller = useTableController({
  defaultPageSize: 10,
  initialSort: { columnId: "name", direction: "asc" },
  initialPagination: { pageIndex: 0, pageSize: 10 },
  initialFilters: {},
});

// Sorting
controller.setSortColumn("price"); // Toggle sort on 'price' column
controller.resetSort(); // Clear sorting

// Pagination
controller.setPageIndex(2); // Go to page 3 (0-indexed)
controller.setPageSize(25); // Change items per page
controller.nextPage(); // Go to next page
controller.previousPage(); // Go to previous page
controller.canNextPage(totalItems); // Check if next page exists
controller.canPreviousPage(); // Check if previous page exists

// Filtering
controller.setFilter("category", "crypto"); // Add filter
controller.removeFilter("category"); // Remove filter
controller.clearFilters(); // Clear all filters

// Reset
controller.resetAll(); // Reset everything to initial state
```

**Return Values:**

- `sortState` - Current sort state `{ columnId: string | null, direction: 'asc' | 'desc' | null }`
- `paginationState` - Current pagination `{ pageIndex: number, pageSize: number }`
- `filters` - Current filter state `{ [key: string]: unknown }`
- `hasActiveFilters` - Boolean indicating if any filters are active

### useTableData

Processes data client-side with sorting, filtering, and pagination.

```tsx
import { useTableData } from "@/app/_hooks/use-table-data";

const tableData = useTableData({
  data: allData, // Full dataset
  sortState: controller.sortState,
  paginationState: controller.paginationState,
  filters: controller.filters,
  isLoading: query.isLoading,
  error: query.error,
});

// Use processed data
<GenericTable
  data={tableData.paginatedData}
  isLoading={tableData.isLoading}
  isEmpty={tableData.isEmpty}
/>
```

**Return Values:**

- `paginatedData` - Current page of data after sorting/filtering
- `totalCount` - Total number of items after filtering
- `isLoading` - Loading state
- `isEmpty` - Whether data is empty
- `error` - Error object if any
- `pageCount` - Total number of pages
- `currentPageRange` - `{ start: number, end: number }` for current page
- `hasNextPage` - Boolean for next page availability
- `hasPreviousPage` - Boolean for previous page availability

## Column Definition

Columns are defined with the `Column<T>` interface:

```tsx
interface Column<T> {
  id: string; // Unique column identifier
  header: string | ReactNode; // Column header content
  accessor: keyof T | ((row: T) => unknown); // Data accessor
  cell?: (value: unknown, row: T) => ReactNode; // Custom cell renderer
  sortable?: boolean; // Enable sorting for this column
  width?: string; // Column width (CSS value)
  align?: "left" | "center" | "right"; // Text alignment
}
```

### Example Column Definitions

```tsx
const columns: Column<AssetDTO>[] = [
  // Simple column
  {
    id: "name",
    header: "Name",
    accessor: "name",
    sortable: true,
  },

  // Custom cell renderer
  {
    id: "price",
    header: "Price",
    accessor: "currentPrice",
    align: "right",
    sortable: true,
    cell: (value) => (
      <span className="font-mono">${Number(value).toFixed(2)}</span>
    ),
  },

  // Function accessor
  {
    id: "change",
    header: "24h %",
    accessor: (row) => row.priceChangePercentage24h,
    align: "right",
    cell: (value) => {
      const change = Number(value ?? 0);
      return (
        <span className={change >= 0 ? "text-green-400" : "text-red-400"}>
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)}%
        </span>
      );
    },
  },

  // Image column
  {
    id: "image",
    header: "Logo",
    accessor: "image",
    width: "60px",
    cell: (value) => (
      <img src={String(value)} alt="" className="h-8 w-8 rounded-full" />
    ),
  },
];
```

## Usage Patterns

### Pattern 1: Server-Side Processing (tRPC)

Best for large datasets. Server handles sorting, filtering, and pagination.

```tsx
import { api } from "@/trpc/react";
import { GenericTable } from "@/app/_components/generic-table";
import { useTableController } from "@/app/_hooks/use-table-controller";

function ServerTable() {
  const controller = useTableController({ defaultPageSize: 10 });

  // Server-side query with pagination params
  const query = api.table.getPaginatedTablePostgres.useQuery({
    page: controller.paginationState.pageIndex + 1,
    pageSize: controller.paginationState.pageSize,
    sortBy: controller.sortState.columnId || "id",
    sortOrder: controller.sortState.direction || "asc",
  });

  return (
    <GenericTable
      columns={columns}
      data={query.data?.data ?? []}
      isLoading={query.isLoading}
      isEmpty={!query.isLoading && query.data?.data.length === 0}
    >
      {/* Add pagination footer */}
    </GenericTable>
  );
}
```

### Pattern 2: Client-Side Processing

Best for smaller datasets. All data fetched once, processed in browser.

```tsx
import { api } from "@/trpc/react";
import { GenericTable } from "@/app/_components/generic-table";
import { useTableController } from "@/app/_hooks/use-table-controller";
import { useTableData } from "@/app/_hooks/use-table-data";

function ClientTable() {
  const controller = useTableController({ defaultPageSize: 10 });

  // Fetch all data once
  const { data: allData, isLoading } = api.query.getAllAssets.useQuery();

  // Process client-side
  const tableData = useTableData({
    data: allData,
    sortState: controller.sortState,
    paginationState: controller.paginationState,
    isLoading,
  });

  return (
    <GenericTable
      columns={columns}
      data={tableData.paginatedData}
      isLoading={tableData.isLoading}
      isEmpty={tableData.isEmpty}
    />
  );
}
```

### Pattern 3: Sortable Columns

Add click handlers to column headers for sorting:

```tsx
const columns: Column<AssetDTO>[] = [
  {
    id: "name",
    header: (
      <button onClick={() => controller.setSortColumn("name")}>
        Name
        {controller.sortState.columnId === "name" && (
          <span>{controller.sortState.direction === "asc" ? "↑" : "↓"}</span>
        )}
      </button>
    ),
    accessor: "name",
    sortable: true,
  },
];
```

### Pattern 4: Pagination Footer

Add pagination controls using `TableFooter`:

```tsx
<GenericTable columns={columns} data={data}>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={columns.length}>
        <div className="flex justify-between">
          <div>
            Showing {start} to {end} of {total} results
          </div>
          <div>
            <button
              onClick={() => controller.previousPage()}
              disabled={!controller.canPreviousPage()}
            >
              Previous
            </button>
            <button
              onClick={() => controller.nextPage()}
              disabled={!controller.canNextPage(total)}
            >
              Next
            </button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  </TableFooter>
</GenericTable>
```

## Complete Example

```tsx
"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import {
  GenericTable,
  TableFooter,
  TableRow,
  TableCell,
  type Column,
} from "@/app/_components/generic-table";
import { useTableController } from "@/app/_hooks/use-table-controller";

export default function AssetTable() {
  const [search, setSearch] = useState("");
  const controller = useTableController({ defaultPageSize: 10 });

  const query = api.table.getPaginatedTablePostgres.useQuery({
    page: controller.paginationState.pageIndex + 1,
    pageSize: controller.paginationState.pageSize,
    search: search || undefined,
    sortBy: controller.sortState.columnId || "marketCapRank",
    sortOrder: controller.sortState.direction || "asc",
  });

  const columns: Column<Asset>[] = [
    {
      id: "name",
      header: "Name",
      accessor: "name",
      sortable: true,
    },
    {
      id: "price",
      header: "Price",
      accessor: "currentPrice",
      align: "right",
      sortable: true,
      cell: (value) => `$${Number(value).toFixed(2)}`,
    },
  ];

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />

      <GenericTable
        columns={columns}
        data={query.data?.data ?? []}
        isLoading={query.isLoading}
        isEmpty={!query.isLoading && query.data?.data.length === 0}
      >
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length}>
              Page {controller.paginationState.pageIndex + 1}
            </TableCell>
          </TableRow>
        </TableFooter>
      </GenericTable>
    </div>
  );
}
```

## Best Practices

1. **Server-side vs Client-side**: Use server-side processing for large datasets (>1000 items), client-side for smaller datasets
2. **Column Keys**: Always use unique `id` values for columns
3. **Custom Renderers**: Use the `cell` prop for formatting (prices, dates, images, etc.)
4. **Loading States**: Always handle loading and empty states properly
5. **TypeScript**: Define your data type and use `Column<YourType>` for type safety
6. **Pagination**: Reset to page 0 when changing filters or search terms
7. **Memoization**: Column definitions can be memoized if they don't depend on state

## TypeScript Types

All types are exported from the components and hooks:

```tsx
import type {
  Column,
  TableProps,
  SortState,
  PaginationState,
  FilterState,
} from "@/app/_components/generic-table";
import type { TableControllerReturn } from "@/app/_hooks/use-table-controller";
import type { UseTableDataReturn } from "@/app/_hooks/use-table-data";
```
