"use client";

import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const data = [
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
    queueStatus: "queueing",
  },
];

export const columns = [
  {
    id: "image",
    accessorKey: "boatImage",
    header: "Boat Image",
    cell: ({ row }) => {
      return (
        <div className="size-12">
          <Link
            href={`${row.getValue("image") || "/images/default-image.jpg"}`}
            className="size-12"
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-max"
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-left lowercase">{row.getValue("name")}</div>
    ),
  },
  {
    id: "Registration Status",
    accessorKey: "registrationStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full p-0 text-center hover:bg-transparent"
        >
          Registration Status
          <CaretSortIcon className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className={`mx-auto w-max rounded px-2 py-1 text-center text-xs capitalize text-white ${
          row?.getValue("Registration Status")?.toLowerCase() === "completed"
            ? "bg-green-500"
            : "bg-orange-400"
        }`}
      >
        {row.getValue("Registration Status")}
      </div>
    ),
  },
  {
    id: "Queue Status",
    accessorKey: "queueStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full p-0 text-center hover:bg-transparent"
        >
          Queue Status
          <CaretSortIcon className="ml-1 h-4 w-4" />
        </Button>
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
  {
    id: "actions",
    header: () => <div className="w-full text-center">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link
              href={`/boats/${row?.original?.name}`}
              className="text-black/80 group-hover:text-black"
            >
              <DropdownMenuItem className="cursor-pointer">
                Boat Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-500 hover:!text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function BoatTable() {
  let maxPerPage = 10;
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [pages, setPages] = React.useState(
    Math.ceil(data?.length / maxPerPage),
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
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search a boat..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="w-[200px] max-w-sm md:w-full"
        />
        <div className="flex items-center gap-2">
          <Link href="/boats/add">
            <Button>Add Boat</Button>
          </Link>
        </div>
      </div>
      <div className="rounded-md border">
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
                            header.getContext(),
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
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
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
    </div>
  );
}
