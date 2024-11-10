"use client";

import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActivityTypes, Queue } from "@/lib/types";
import socket from "@/socket";
import { deleteActivities, getAllActivities } from "@/lib/api/activity";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronDownIcon, TrashIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Alert from "@/components/utils/Alert";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  deleteSailHistories,
  fetchRecentSails,
  fetchSailDetails,
} from "@/lib/api/queue";
import { formatDateToReadable } from "@/lib/utils";
import BoardingInfo from "../queue/BoardingInfo";

export default function QueueHistoryTable({
  initData = [],
}: {
  initData: Queue[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection]: any = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [tempData, setTempData] = useState(initData);
  const [data, setData] = useState(initData);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();
  const session: any = useSession();
  const isAdmin = session?.data?.user?.isAdmin;
  const [boatDetails, setBoatDetails] = useState(null);

  const columns: ColumnDef<Queue>[] = [
    ...(isAdmin
      ? [
          {
            id: "select",
            header: ({ table }) => (
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            ),
            cell: ({ row }) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            ),
            enableSorting: false,
            enableHiding: false,
          },
        ]
      : []),
    {
      accessorKey: "mainImage",
      header: "Boat Image",
      cell: ({ row }) => (
        <div
          className="size-12 cursor-pointer"
          style={{ minWidth: "50px", maxWidth: "50px" }}
        >
          <div style={{ minWidth: "50px", maxWidth: "50px" }}>
            <img
              width={40}
              height={40}
              alt="user-image"
              className="aspect-square w-max object-cover transition"
              src={row.getValue("mainImage") || "/images/default-image.jpg"}
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: "boatCode",
      header: "Boat Code",
      cell: ({ row }) => row.original.boatCode,
    },
    {
      accessorKey: "boatName",
      header: "Boat Name",
      cell: ({ row }) => row.original.boatName,
    },
    {
      accessorKey: "passengers",
      header: "Passengers",
      cell: ({ row }) => row.original.passengerIds?.length,
    },
    {
      accessorKey: "totalAmountPaid",
      header: "Total Fare",
      cell: ({ row }) => row.original.totalAmountPaid,
    },
    {
      accessorKey: "completedAt",
      header: "Completed On",
      cell: ({ row }) => {
        const completedAt = row.original.completedAt;
        return completedAt ? formatDateToReadable(completedAt) : "N/A";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => showInfo(row.original._id)}
          aria-label="View Details"
        >
          Info
        </Button>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const handleAlertConfirm = async () => {
    const filterIds = data.filter((_, index) => rowSelection[index]);
    const ids = filterIds.map((k) => k._id);
    if (ids.length === 0) return;
    await deleteSailHistories(ids);
    socket.emit("sailingRefresh");
    setRowSelection({});
    toast({
      title: "Selected Sail History Successfully Deleted.",
    });
  };

  useEffect(() => {
    const handleNewActivity = async () => await fetchData();

    socket.on("sailingRefresh", handleNewActivity);

    return () => {
      socket.off("sailingRefresh", handleNewActivity);
    };
  }, []);

  const fetchData = async () => {
    const req = await fetchRecentSails();
    setData(req);
  };

  useEffect(() => {
    setRowSelection({});
    if (selectedDate) {
      setData(
        tempData.filter((sail) => {
          const date = new Date(sail.completedAt);
          return selectedDate
            ? date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear()
            : true;
        })
      );
    } else {
      setData(tempData);
    }
  }, [selectedDate]);

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
      {boatDetails && (
        <BoardingInfo
          boatInfo={boatDetails}
          open
          isSailing
          completed
          deleteFn={() => null}
        />
      )}
      <Alert
        title="Are you sure you want to delete the recent sail/s?"
        description="This will permanently remove the recent sail/s from the system."
        open={isAlertOpen}
        openChange={setIsAlertOpen}
        onConfirm={handleAlertConfirm}
        primaryBtn="Delete"
        primaryClassName="bg-red-500 hover:bg-red-700"
      />
      <div className="w-full">
        <div className="flex items-center py-4 gap-4 flex-wrap">
          <Input
            placeholder="Search by boat name..."
            value={
              (table.getColumn("boatName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("boatName")?.setFilterValue(event.target.value)
            }
            className="max-w-none sm:max-w-sm"
          />
          <div className="flex items-center justify-between sm:justify-start gap-x-2 flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  <p className="sm:block hidden">
                    {selectedDate ? format(selectedDate, "PPP") : "Select Date"}
                  </p>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate as any}
                  onSelect={setSelectedDate as any}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
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
                <p className="hidden sm:block">Delete</p>
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
