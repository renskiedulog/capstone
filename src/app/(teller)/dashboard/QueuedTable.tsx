"use client";

import * as React from "react";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { motion } from "framer-motion";

export type Queue = {
  id: string;
  boatImage: string;
  registrationStatus: "pending" | "completed";
  name: string;
  queueStatus: "waiting" | "queued" | "sailing";
};

const data: Queue[] = [
  {
    id: "m5gr84i9",
    boatImage:
      "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    registrationStatus: "completed",
    name: "ken99@yahoo.com",
    queueStatus: "waiting",
  },
  {
    id: "m5gr84i9",
    boatImage: "",
    registrationStatus: "pending",
    name: "ken99@yahoo.com",
    queueStatus: "sailing",
  },
  {
    id: "m5gr84i9",
    boatImage: "",
    registrationStatus: "completed",
    name: "ken99@yahoo.com",
    queueStatus: "queued",
  },
  {
    id: "m5gr84i9",
    boatImage: "",
    registrationStatus: "pending",
    name: "ken99@yahoo.com",
    queueStatus: "sailing",
  },
  {
    id: "m5gr84i9",
    boatImage: "",
    registrationStatus: "completed",
    name: "ken99@yahoo.com",
    queueStatus: "queued",
  },
  {
    id: "m5gr84i9",
    boatImage: "",
    registrationStatus: "pending",
    name: "ken99@yahoo.com",
    queueStatus: "sailing",
  },
  {
    id: "m5gr84i9",
    boatImage: "",
    registrationStatus: "completed",
    name: "ken99@yahoo.com",
    queueStatus: "queued",
  },
  {
    id: "m5gr84i9",
    boatImage: "",
    registrationStatus: "pending",
    name: "ken99@yahoo.com",
    queueStatus: "sailing",
  },
  {
    id: "m5gr84i9",
    boatImage: "",
    registrationStatus: "completed",
    name: "ken99@yahoo.com",
    queueStatus: "queued",
  },
  {
    id: "m5gr84i9",
    boatImage: "",
    registrationStatus: "pending",
    name: "ken99@yahoo.com",
    queueStatus: "sailing",
  },
  {
    id: "m5gr84i9",
    boatImage: "",
    registrationStatus: "completed",
    name: "ken99@yahoo.com",
    queueStatus: "queued",
  },
  {
    id: "m5gr84i9",
    boatImage: "",
    registrationStatus: "pending",
    name: "ken99@yahoo.com",
    queueStatus: "sailing",
  },
  {
    id: "m5gr84i9",
    boatImage: "",
    registrationStatus: "completed",
    name: "ken99@yahoo.com",
    queueStatus: "queued",
  },
  {
    id: "m5gr84i9",
    boatImage: "",
    registrationStatus: "pending",
    name: "ken99@yahoo.com",
    queueStatus: "sailing",
  },
  {
    id: "m5gr84i9",
    boatImage: "",
    registrationStatus: "completed",
    name: "ken99@yahoo.com",
    queueStatus: "queued",
  },
];

export const columns: ColumnDef<Queue>[] = [
  {
    id: "image",
    accessorKey: "boatImage",
    header: "Boat Image",
    cell: ({ row }) => {
      return (
        <div className="size-12">
          <Link
            href={`${row.getValue("image") || "/images/default-image.jpg"}`}
            className="size-8"
            target="_blank"
          >
            <img
              width={40}
              height={40}
              alt="boat-image"
              className="aspect-square w-max object-cover transition"
              src={row.getValue("image") || "/images/default-image.jpg"}
            />
          </Link>
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Boat Name",
    cell: ({ row }) => (
      <div className="text-left lowercase">{row.getValue("name")}</div>
    ),
  },
  {
    id: "Queue Status",
    accessorKey: "queueStatus",
    header: ({ column }) => {
      return (
        <p className="w-full p-0 text-center hover:bg-transparent">
          Queue Status
        </p>
      );
    },
    cell: ({ row }) => {
      const statusBgs = {
        queueing: "bg-green-700",
        sailing: "bg-blue-500",
        waiting: "bg-gray-500",
      };
      return (
        <div
          className={`mx-auto w-max rounded px-2 py-1 text-left text-xs capitalize text-white ${
            statusBgs[row?.getValue("Queue Status")?.toLowerCase()]
          }`}
        >
          {row.getValue("Queue Status")}
        </div>
      );
    },
  },
];

export default function QueuedTable() {
  let maxPerPage = 10;
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [pages, setPages] = React.useState(
    Math.ceil(data?.length / maxPerPage)
  );
  const [page, setPage] = React.useState(1);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="rounded-md border">
        <h1 className="p-4 pb-0 text-3xl font-semibold">Queue Table</h1>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-center"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className={`${
                          cell?.column?.id === "actions" && "w-24"
                        } p-2`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className={`h-24 text-center`}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-xs">
          Page {page} out of {pages} page/s.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage();
              setPage(page - 1);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage();
              setPage(page + 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
