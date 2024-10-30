"use client";

import { useState, useEffect } from "react";
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
import { ActivityTypes } from "@/lib/types";
import socket from "@/socket";
import { deleteActivities, getAllActivities } from "@/lib/api/activity";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, TrashIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Alert from "@/components/utils/Alert";
import { useToast } from "@/components/ui/use-toast";

export const columns: ColumnDef<ActivityTypes>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="capitalize text-center sm:text-left">
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => (
      <div
        className="whitespace-normal"
        style={{ minWidth: "200px", maxWidth: "400px" }}
      >
        {row.getValue("details")}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div className="uppercase">{row.getValue("type")}</div>,
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
    accessorKey: "actionBy",
    header: "Action By",
    cell: ({ row }) => <div>{row.getValue("actionBy")}</div>,
  },
];

export default function PassengerTable({
  initData = [],
}: {
  initData: ActivityTypes[];
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

  const handleAlertConfirm = async () => {
    const filterIds = data.filter((_, index) => rowSelection[index]);
    const ids = filterIds.map((k) => k._id);
    if (ids.length === 0) return;
    await deleteActivities(ids);
    socket.emit("newActivity");
    setRowSelection({});
    toast({
      title: "Selected Activities Successfully Deleted.",
    });
  };

  useEffect(() => {
    const handleNewActivity = async () => await fetchData();

    socket.on("newActivity", handleNewActivity);

    return () => {
      socket.off("newActivity", handleNewActivity);
    };
  }, []);

  const fetchData = async () => {
    const req = await getAllActivities();
    setData(req);
  };

  useEffect(() => {
    setRowSelection({});
    if (selectedDate) {
      setData(
        tempData.filter((activity) => {
          const date = new Date(activity.createdAt);
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

  return (
    <>
      <Alert
        title="Are you sure you want to delete the selected activities?"
        description="This will permanently remove the selected activities from the system."
        open={isAlertOpen}
        openChange={setIsAlertOpen}
        onConfirm={handleAlertConfirm}
        primaryBtn="Delete"
        primaryClassName="bg-red-500 hover:bg-red-700"
      />
      <div className="w-full">
        <div className="flex items-center py-4 gap-4 flex-wrap">
          <Input
            placeholder="Filter by action by..."
            value={
              (table.getColumn("actionBy")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("actionBy")?.setFilterValue(event.target.value)
            }
            className="max-w-none sm:max-w-sm"
          />
          <div className="flex items-center justify-between sm:justify-start gap-x-2 flex-1">
            <Select
              onValueChange={(value) => {
                const column = table.getColumn("type");
                if (column) {
                  column.setFilterValue(value === "all" ? undefined : value);
                }
              }}
              defaultValue="all"
              id="typeSelect"
            >
              <SelectTrigger className="flex-1 max-w-[150px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="teller">Teller</SelectItem>
                <SelectItem value="boat">Boat</SelectItem>
                <SelectItem value="passenger">Passenger</SelectItem>
                <SelectItem value="queue">Queue</SelectItem>
              </SelectContent>
            </Select>
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
                  selected={selectedDate}
                  onSelect={setSelectedDate}
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
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={() => setIsAlertOpen(true)}
            >
              <TrashIcon className="h-5 w-5" />
              <p className="hidden sm:block">Delete</p>
            </Button>
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
