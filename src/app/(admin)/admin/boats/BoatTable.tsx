"use client";

import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
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
import { ChevronDown, Edit, Ship, Trash } from "lucide-react";
import { Boat } from "@/lib/types";
import Alert from "@/components/utils/Alert";
import BoatEditForm from "./BoatEditForm";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import socket from "@/socket";
import AddBoatModal from "./AddBoatModal";
import {
  checkInQueue,
  deleteBoatAccount,
  fetchBoats,
} from "@/lib/api/boatActions";
import { addNewActivity } from "@/lib/api/activity";
import { useSession } from "next-auth/react";

export default function BoatTable({ initData }: { initData: Boat[] }) {
  const [data, setData] = React.useState<Boat[]>(initData);
  const { toast } = useToast();
  let maxPerPage = 10;
  const [sorting, setSorting] = React.useState([]);
  const [editMode, setEditMode] = React.useState(false);
  const [editDetails, setEditDetails] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const [deleteBoat, setDeleteBoat] = React.useState("");
  const [pendingModalClose, setPendingModalClose] = React.useState(false);
  const [pages, setPages] = React.useState(
    Math.ceil(data?.length / maxPerPage)
  );
  const [page, setPage] = React.useState(1);
  const [viewImage, setViewImage] = React.useState("");
  const session: any = useSession() || null;
  const username = session?.data?.user?.username;

  React.useEffect(() => {
    socket.on("boatRefresh", (data) => {
      fetchData();
    });

    return () => {
      socket.off("boatRefresh");
    };
  }, []);

  const fetchData = async () => {
    const req = await fetchBoats();
    setData(req);
  };

  const columns: ColumnDef<Boat>[] = [
    {
      id: "mainImage",
      accessorKey: "mainImage",
      header: () => (
        <p className="md:text-sm text-xs text-center md:text-left w-max">
          Main Image
        </p>
      ),
      cell: ({ row }) => {
        return (
          <div
            className="size-12 cursor-pointer"
            style={{ minWidth: "50px", maxWidth: "50px" }}
          >
            <div
              onClick={() =>
                setViewImage(
                  row.getValue("mainImage") || "/images/default-image.jpg"
                )
              }
              style={{ minWidth: "50px", maxWidth: "50px" }}
            >
              <img
                width={40}
                height={40}
                alt="user-image"
                className="aspect-square w-max object-cover transition"
                src={row.getValue("mainImage") || "/images/default-image.jpg"}
              />
            </div>
          </div>
        );
      },
    },
    {
      id: "boatCode",
      accessorKey: "boatCode",
      header: () => {
        return (
          <p className="md:text-sm text-xs text-center md:text-left">
            Boat Code
          </p>
        );
      },
      cell: ({ row }) => (
        <Link href={`/boat/${row.getValue("boatCode")}`}>
          <p className="text-left max-w-[150px] text-ellipsis overflow-hidden hover:underline">
            {row.getValue("boatCode")}
          </p>
        </Link>
      ),
    },
    {
      id: "boatName",
      accessorKey: "boatName",
      header: () => <p className="md:text-sm text-xs">Boat Name</p>,
      cell: ({ row }) => (
        <div className="text-left reverse">{row.getValue("boatName")}</div>
      ),
    },
    {
      id: "ownerName",
      accessorKey: "ownerName",
      header: () => (
        <p className="md:text-sm text-xs text-center md:text-left">Owner</p>
      ),
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("ownerName")}</div>
      ),
    },
    {
      id: "driverName",
      accessorKey: "driverName",
      header: () => <p className="md:text-sm text-xs">Ship Captain</p>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("driverName")}</div>
      ),
    },
    {
      id: "capacity",
      accessorKey: "capacity",
      header: () => <p className="md:text-sm text-xs">Capacity</p>,
      cell: ({ row }) => (
        <div className="text-left reverse">{row.getValue("capacity")}</div>
      ),
    },
    {
      id: "checkingStatus",
      accessorKey: "checkingStatus",
      header: () => (
        <p className="md:text-sm text-xs text-center md:text-left">
          Checking Status
        </p>
      ),
      cell: ({ row }: { row: any }) => {
        const bgColors: any = {
          "not-checked": "bg-yellow-700",
          checked: "bg-green-500",
          pending: "bg-gray-500",
          "under-inspection": "bg-blue-500",
          "requires-repair": "bg-red-500",
          "not-sailable": "bg-gray-700",
        };

        const statusLabels: any = {
          "not-checked": "Not Checked",
          checked: "Checked",
          pending: "Pending",
          "under-inspection": "Under Inspection",
          "requires-repair": "Requires Repair",
          "not-sailable": "Not Sailable",
        };

        return (
          <div
            className={`mx-auto w-max rounded px-2 py-1 text-center text-xs capitalize text-white ${bgColors[row?.getValue("checkingStatus").toLowerCase()]}`}
          >
            {statusLabels[row.getValue("checkingStatus")]}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <p className="md:text-sm text-xs text-center md:text-left">Actions</p>
      ),
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
                href={`/boat/${row.original.boatCode}`}
                className="text-black/80 group-hover:text-black"
              >
                <DropdownMenuItem className="cursor-pointer gap-1.5 font-medium">
                  <Ship size={18} />
                  <span>Details</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setEditMode(true);
                  setEditDetails(row.original);
                }}
                className="cursor-pointer gap-1.5"
              >
                <Edit size={18} />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsDeleteAlertOpen(true);
                  setDeleteBoat(row?.original?._id);
                }}
                className="cursor-pointer text-red-500 hover:!text-red-500 gap-1.5"
              >
                <Trash size={18} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting as any,
    onColumnFiltersChange: setColumnFilters as any,
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

  const addActivity = async (boatName: string) => {
    await addNewActivity({
      type: "boat",
      title: "Deleted Boat Account",
      details: `Boat with the name '${boatName}' has been deleted.`,
      actionBy: username,
    });
    socket.emit("newActivity");
  };

  const handleAlertConfirm = async () => {
    // Filter And GET ID
    const boatName = data.find((k) => k._id === deleteBoat)?.boatName;
    // Check if boat existing in Queue
    const check = await checkInQueue(deleteBoat);
    if (check) {
      toast({
        title: "Boat exists in the Queue.",
        description: "Remove any instances of the boat before removing it.",
      });
      return;
    }

    const reqDelete = await deleteBoatAccount(deleteBoat);
    if (reqDelete) {
      addActivity(boatName as string);
      socket.emit("boatRefresh");
      socket.emit("queueRefresh");
      toast({
        title: "Boat Deleted Successfully.",
      });
    } else {
      toast({
        title: "Something went wrong.",
        description: "Please refresh the page and try again.",
      });
    }
    setIsDeleteAlertOpen(false);
    if (pendingModalClose) {
      setPendingModalClose(false);
    }
    fetchData();
  };

  const handleAlertCancel = () => {
    setDeleteBoat("");
    setIsDeleteAlertOpen(false);
    setPendingModalClose(false);
  };

  return (
    <>
      {viewImage !== "" && (
        <Dialog open={viewImage !== ""} onOpenChange={() => setViewImage("")}>
          <DialogContent>
            <Image
              src={viewImage}
              width={500}
              height={500}
              alt="image-dialog"
              className="aspect-square object-cover mt-5"
            />
          </DialogContent>
        </Dialog>
      )}
      {isDeleteAlertOpen && (
        <Alert
          title="Are you sure you want to delete this account?"
          description="Everything in this account will be deleted and items, references, and data related to this account will be removed."
          open={isDeleteAlertOpen}
          openChange={setIsDeleteAlertOpen}
          onConfirm={handleAlertConfirm}
          onCancel={handleAlertCancel}
          primaryBtn="Delete"
          primaryClassName="bg-red-500 hover:bg-red-600"
        />
      )}
      {editMode && (
        <BoatEditForm
          boatDetails={editDetails as Boat}
          setIsOpen={setEditMode}
          setViewImage={setViewImage}
        />
      )}
      {/* Table */}
      <div className="w-full">
        <div className="flex sm:flex-row flex-col-reverse gap-2 justify-between py-2 sm:py-4">
          <Input
            placeholder="Search a boat..."
            value={
              (table.getColumn("boatName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("boatName")?.setFilterValue(event.target.value)
            }
            className="w-full max-w-lg mr-2"
          />
          <div className="flex gap-2">
            <AddBoatModal setViewImage={setViewImage} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto text-xs sm:text-base"
                >
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize "
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
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
                table.getRowModel().rows.map((row) => {
                  return (
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
                              cell?.column?.id === "actions" ||
                              (cell?.column?.id === "mainImage" && "w-24")
                            }`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
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
        {pages > 1 && (
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
        )}
      </div>
    </>
  );
}
