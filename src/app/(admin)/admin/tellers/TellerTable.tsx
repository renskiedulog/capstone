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
import AddTellerModal from "./AddTellerModal";
import { Edit, Trash, User2Icon } from "lucide-react";
import { UserTypes } from "@/lib/types";
import Alert from "@/components/utils/Alert";
import EditForm from "./EditForm";
import { useToast } from "@/components/ui/use-toast";
import { deleteTellerAccount, fetchTellers } from "@/lib/api/tellerActions";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import socket from "@/socket";

export default function TellerTable({ initData }: { initData: UserTypes[] }) {
  const [data, setData] = React.useState<UserTypes[]>(initData);
  const { toast } = useToast();
  let maxPerPage = 10;
  const [sorting, setSorting] = React.useState([]);
  const [editMode, setEditMode] = React.useState(false);
  const [editDetails, setEditDetails] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const [deleteUser, setDeleteUser] = React.useState("");
  const [pendingModalClose, setPendingModalClose] = React.useState(false);
  const [pages, setPages] = React.useState(
    Math.ceil(data?.length / maxPerPage)
  );
  const [page, setPage] = React.useState(1);
  const [viewImage, setViewImage] = React.useState("");

  React.useEffect(() => {
    socket.on("tellerRefresh", (data) => {
      fetchData();
    });

    return () => {
      socket.off("tellerRefresh");
    };
  }, []);

  const fetchData = async () => {
    const req = await fetchTellers();
    setData(req);
  };

  const columns: ColumnDef<UserTypes>[] = [
    {
      id: "image",
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="size-12 cursor-pointer">
            <div
              onClick={() =>
                setViewImage(
                  row.getValue("image") || "/images/default-image.jpg"
                )
              }
            >
              <Image
                width={500}
                height={500}
                alt="user-image"
                className="aspect-square w-max object-cover transition"
                src={row.getValue("image") || "/images/default-image.jpg"}
              />
            </div>
          </div>
        );
      },
    },
    {
      id: "name",
      accessorKey: "fullName",
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
        <div className="text-left">{row.getValue("name")}</div>
      ),
    },
    {
      id: "username",
      accessorKey: "username",
      header: ({ column }) => {
        return <p>Username</p>;
      },
      cell: ({ row }) => (
        <div className="text-left lowercase">{row.getValue("username")}</div>
      ),
    },
    {
      id: "password",
      accessorKey: "password",
      header: ({ column }) => {
        return <p>Password</p>;
      },
      cell: ({ row }) => (
        <div className="text-left max-w-[150px] text-ellipsis overflow-hidden">
          {row.getValue("password")}
        </div>
      ),
    },
    {
      id: "address",
      accessorKey: "address",
      header: ({ column }) => {
        return <p>Address</p>;
      },
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("address")}</div>
      ),
    },
    {
      id: "contact",
      accessorKey: "contact",
      header: ({ column }) => {
        return <p>Contact Number</p>;
      },
      cell: ({ row }) => (
        <div className="text-left lowercase">{row.getValue("contact")}</div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full p-0 text-center hover:bg-transparent"
          >
            Status
            <CaretSortIcon className="ml-1 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div
          className={`mx-auto w-max rounded px-2 py-1 text-center text-xs capitalize text-white ${
            row?.getValue("status") === "active"
              ? "bg-green-500"
              : "bg-slate-400"
          }`}
        >
          {row.getValue("status")}
        </div>
      ),
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
                href={`/profile/${row?.original?.username}`}
                className="text-black/80 group-hover:text-black"
              >
                <DropdownMenuItem className="cursor-pointer gap-1.5 font-medium">
                  <User2Icon size={18} />
                  <span>Profile</span>
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
                  setDeleteUser(row.original._id);
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

  const handleAlertConfirm = async () => {
    const reqDelete = await deleteTellerAccount(deleteUser);
    if (reqDelete) {
      socket.emit("tellerRefresh", { info: "Refresh Teller Infos" });
      toast({
        title: "Teller Deleted Successfully.",
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
    setDeleteUser("");
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
              width={1000}
              height={1000}
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
        <EditForm accountDetails={editDetails} setIsOpen={setEditMode} />
      )}
      {/* Table */}
      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Search a teller..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="w-[200px] max-w-sm md:w-full"
          />
          <div className="flex items-center gap-2">
            <AddTellerModal />
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
                              cell?.column?.id === "actions" && "w-24"
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
