"use client";

import { useState, useEffect, useRef } from "react";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
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
import { Passenger } from "@/lib/types";
import socket from "@/socket";
import { TrashIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Alert from "@/components/utils/Alert";
import { Checkbox } from "@/components/ui/checkbox";
import { deletePassengers, fetchAllPassengers } from "@/lib/api/passenger";
import { useToast } from "@/components/ui/use-toast";
import BoardingInfo from "@/app/(public)/queue/BoardingInfo";
import { fetchSailDetails } from "@/lib/api/queue";

export default function PassengerTable({
  initData = [],
}: {
  initData: Passenger[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection]: any = useState({});
  const [data, setData] = useState(initData);
  const session: any = useSession();
  const isAdmin = session?.data?.user?.isAdmin;
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();
  const [boatDetails, setBoatDetails] = useState(null);

  const columns: ColumnDef<Passenger>[] = [
    ...(isAdmin
      ? [
          {
            id: "select",
            header: ({ table }: any) => {
              const checkboxRef = useRef<HTMLInputElement>(null);

              const rowsToSelect = table
                .getRowModel()
                .rows.filter((row) => !row.original.isBoarding);

              if (rowsToSelect.length === 0) {
                return null;
              }

              const allSelected = rowsToSelect.every((row) =>
                row.getIsSelected()
              );
              const someSelected = rowsToSelect.some((row) =>
                row.getIsSelected()
              );

              useEffect(() => {
                if (checkboxRef.current) {
                  checkboxRef.current.indeterminate =
                    someSelected && !allSelected;
                }
              }, [someSelected, allSelected]);

              return (
                <Checkbox
                  ref={checkboxRef}
                  checked={allSelected}
                  onCheckedChange={(value) => {
                    rowsToSelect.forEach((row) => {
                      row.toggleSelected(!!value);
                    });
                  }}
                  aria-label="Select all"
                />
              );
            },
            cell: ({ row }) => {
              if (!row?.original.isBoarding) {
                return (
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                  />
                );
              } else return null;
            },
            enableSorting: false,
            enableHiding: false,
          },
        ]
      : []),
    {
      accessorKey: "firstName",
      header: "First Name",
      cell: ({ row }) => (
        <div className="capitalize text-center sm:text-left">
          {row.getValue("firstName")}
        </div>
      ),
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      cell: ({ row }) => (
        <div className="capitalize text-center sm:text-left">
          {row.getValue("lastName")}
        </div>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => (
        <div className="whitespace-normal">{row.getValue("gender")}</div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Contact Number",
      cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className=""
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{new Date(row.getValue("createdAt")).toLocaleString()}</div>
      ),
    },
    {
      accessorKey: "amountPaid",
      header: "Amount Paid",
      cell: ({ row }) => <div>{row.getValue("amountPaid")}</div>,
    },
    {
      accessorKey: "addedBy",
      header: "Added By",
      cell: ({ row }) => <div>{row.getValue("addedBy")}</div>,
    },
    {
      accessorKey: "queueId",
      header: "Queue",
      cell: ({ row }) => (
        <button
          onClick={() => showInfo(row.getValue("queueId"))}
          className="underline"
        >
          Details
        </button>
      ),
    },
  ];

  useEffect(() => {
    socket.on("boardingRefresh", handleRefresh);

    return () => {
      socket.off("boardingRefresh", handleRefresh);
    };
  }, []);

  const handleRefresh = async () => await fetchData();

  const fetchData = async () => {
    const req = await fetchAllPassengers();
    setData(req);
  };

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
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleAlertConfirm = async () => {
    const filterIds = data.filter((_, index) => rowSelection[index]);
    const ids = filterIds.map((k) => k._id);
    if (ids.length === 0) return;
    await deletePassengers(ids);
    socket.emit("newActivity");
    setRowSelection({});
    toast({
      title: "Selected Passenger/s Successfully Deleted.",
    });
    handleRefresh();
  };

  const showInfo = async (id: string) => {
    setBoatDetails(null);
    try {
      const details = await fetchSailDetails(id);
      setBoatDetails(() => details);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Alert
        title="Are you sure you want to delete the selected passenger/s?"
        description="This will permanently remove the selected passenger/s from the system."
        open={isAlertOpen}
        openChange={setIsAlertOpen}
        onConfirm={handleAlertConfirm}
        primaryBtn="Delete"
        primaryClassName="bg-red-500 hover:bg-red-700"
      />
      {boatDetails && (
        <BoardingInfo
          boatInfo={boatDetails}
          open
          isSailing
          deleteFn={() => null}
        />
      )}
      <div className="w-full">
        <div className="flex items-center py-4 gap-4 flex-wrap">
          <Input
            placeholder="Filter by last name..."
            value={
              (table.getColumn("lastName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("lastName")?.setFilterValue(event.target.value)
            }
            className="max-w-none sm:max-w-sm"
          />
          <div className="flex items-center justify-between sm:justify-start gap-x-2 flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-0 sm:ml-auto">
                  Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {isAdmin && (
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={() => setIsAlertOpen(true)}
              >
                <TrashIcon className="h-5 w-5" />
                <p>Delete</p>
              </Button>
            )}
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
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
