"use client";

import Link from "next/link";
import { useState } from "react";
import TrpcTableExample from "@/app/_components/table-examples/trpc-table-example";
import ClientTableExample from "@/app/_components/table-examples/client-table-example";

export default function GenericTablePage() {
  const [activeTab, setActiveTab] = useState<"server" | "client">("server");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#026d2f] to-[#15162c] text-white">
      <div className="mx-auto max-w-7xl p-6">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-green-300 hover:text-green-400"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-4 text-4xl font-bold">Generic Table Component</h1>
        <p className="mb-8 text-lg text-gray-300">
          A comprehensive, reusable table system with sorting, pagination, and
          filtering
        </p>

        <div className="mb-8 rounded-lg bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-semibold">
            About Generic Table Components
          </h3>
          <ul className="list-inside list-disc space-y-2 text-gray-300">
            <li>
              Fully composable table components (TableHeader, TableBody,
              TableRow, TableFooter, TableCell)
            </li>
            <li>
              <code className="rounded bg-black/30 px-2 py-1">
                useTableController
              </code>{" "}
              hook for managing state (sorting, pagination, filtering)
            </li>
            <li>
              <code className="rounded bg-black/30 px-2 py-1">
                useTableData
              </code>{" "}
              hook for client-side data processing
            </li>
            <li>Support for both server-side and client-side data processing</li>
            <li>
              TypeScript support with generic types for full type safety
            </li>
            <li>
              Built-in loading states, empty states, and skeleton loaders
            </li>
            <li>
              Customizable column rendering with{" "}
              <code className="rounded bg-black/30 px-2 py-1">cell</code>{" "}
              renderers
            </li>
          </ul>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex cursor-pointer gap-4">
          <button
            onClick={() => setActiveTab("server")}
            className={`cursor-pointer rounded-lg px-6 py-3 font-semibold transition-all ${
              activeTab === "server"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Server-Side Processing
          </button>
          <button
            onClick={() => setActiveTab("client")}
            className={`cursor-pointer rounded-lg px-6 py-3 font-semibold transition-all ${
              activeTab === "client"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Client-Side Processing
          </button>
        </div>

        {/* Content */}
        <div className="rounded-lg bg-white/5 p-6">
          {activeTab === "server" && (
            <div>
              <h2 className="mb-6 text-3xl font-bold">
                Server-Side Table Processing
              </h2>
              <p className="mb-6 text-gray-300">
                Server handles all data processing. Best for large datasets.
                This example uses tRPC with both MongoDB and PostgreSQL
                backends, demonstrating sorting, search, and pagination handled
                by the database.
              </p>
              <TrpcTableExample />
            </div>
          )}

          {activeTab === "client" && (
            <div>
              <h2 className="mb-6 text-3xl font-bold">
                Client-Side Table Processing
              </h2>
              <p className="mb-6 text-gray-300">
                All data is fetched once and processed in the browser. Best for
                smaller datasets. This example uses the{" "}
                <code className="rounded bg-black/30 px-1">useTableData</code>{" "}
                hook to handle sorting, filtering, and pagination client-side.
              </p>
              <ClientTableExample />
            </div>
          )}
        </div>

        {/* Comparison Section */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-blue-900/20 p-6">
            <h3 className="mb-3 text-xl font-semibold text-blue-300">
              Server-Side Processing
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-300">
              <li>Best for large datasets (&gt;1000 items)</li>
              <li>Reduced client memory usage</li>
              <li>Database-level optimization (indexes, etc.)</li>
              <li>Network request per page/sort/filter</li>
              <li>Requires backend API support</li>
            </ul>
          </div>

          <div className="rounded-lg bg-purple-900/20 p-6">
            <h3 className="mb-3 text-xl font-semibold text-purple-300">
              Client-Side Processing
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-300">
              <li>Best for smaller datasets (&lt;1000 items)</li>
              <li>Instant sorting/filtering (no network delay)</li>
              <li>Single data fetch, then fully offline</li>
              <li>Higher client memory usage</li>
              <li>Great for dashboards and quick filtering</li>
            </ul>
          </div>
        </div>

        {/* Components Reference */}
        <div className="mt-8 rounded-lg bg-gradient-to-r from-green-900/20 to-blue-900/20 p-6">
          <h3 className="mb-4 text-xl font-semibold">
            Component & Hook Reference:
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded bg-white/5 p-4">
              <h4 className="mb-2 text-lg font-semibold text-green-300">
                Components
              </h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>
                  <code className="text-green-200">GenericTable</code> - Main
                  table
                </li>
                <li>
                  <code className="text-green-200">TableHeader</code> - Header
                  section
                </li>
                <li>
                  <code className="text-green-200">TableBody</code> - Body
                  section
                </li>
                <li>
                  <code className="text-green-200">TableRow</code> - Table row
                </li>
                <li>
                  <code className="text-green-200">TableCell</code> - Table
                  cell
                </li>
                <li>
                  <code className="text-green-200">TableFooter</code> - Footer
                  section
                </li>
              </ul>
            </div>

            <div className="rounded bg-white/5 p-4">
              <h4 className="mb-2 text-lg font-semibold text-cyan-300">
                Hooks
              </h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>
                  <code className="text-cyan-200">useTableController</code> -
                  State management
                </li>
                <li>
                  <code className="text-cyan-200">useTableData</code> -
                  Client-side processing
                </li>
              </ul>
            </div>

            <div className="rounded bg-white/5 p-4">
              <h4 className="mb-2 text-lg font-semibold text-purple-300">
                Features
              </h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>✓ Sorting (asc/desc/none)</li>
                <li>✓ Pagination (with controls)</li>
                <li>✓ Filtering & Search</li>
                <li>✓ Custom cell renderers</li>
                <li>✓ Loading & empty states</li>
                <li>✓ Full TypeScript support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Documentation Link */}
        <div className="mt-8 rounded-lg bg-yellow-900/20 p-6">
          <h3 className="mb-2 text-xl font-semibold text-yellow-300">
            Documentation
          </h3>
          <p className="text-sm text-gray-300">
            For detailed documentation, API reference, and usage examples, see{" "}
            <code className="rounded bg-black/30 px-2 py-1">
              src/app/_docs/GENERIC_TABLE.md
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
