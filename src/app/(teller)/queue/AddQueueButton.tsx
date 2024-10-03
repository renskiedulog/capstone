"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info, PlusCircle } from "lucide-react";
import Alert from "@/components/utils/Alert";
import { fetchBoatIds } from "@/lib/api/queue";
import { QueueBoats } from "@/lib/types";
import Link from "next/link";

export default function AddQueueButton({
  addQueue,
  syncData,
}: {
  addQueue: (e: any) => void;
  syncData: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [boatIds, setBoatIds] = React.useState([] as QueueBoats[]);

  const handleAlertConfirm = () => {
    const insertQueue = boatIds?.find((boat) => boat.id === value);
    addQueue((prev: QueueBoats[]) => [...prev, insertQueue]);
    setValue("");
    syncData();
  };

  const handleAlertCancel = () => {};

  const getBoatIds = async () => {
    try {
      const req = await fetchBoatIds();
      setBoatIds(req as QueueBoats[]);
      console.log(req);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getBoatIds();
  }, []);

  return (
    <>
      <Alert
        title="Confirm queue addition?"
        description="You might not have clicked on purpose."
        open={isAlertOpen}
        openChange={setIsAlertOpen}
        onConfirm={handleAlertConfirm}
        onCancel={handleAlertCancel}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-center p-2 gap-2 opacity-70 hover:opacity-100"
          >
            <PlusCircle />
            Add Queue
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[430px]">
          <Command>
            <CommandInput placeholder="Search boat..." className="h-9" />
            <CommandList>
              <CommandEmpty>No boat found.</CommandEmpty>
              <CommandGroup>
                {boatIds?.map((boat: QueueBoats) => (
                  <div
                    key={boat.id}
                    className="flex items-center justify-between hover:bg-secondary mt-1 rounded"
                  >
                    <CommandItem
                      key={boat.id}
                      value={boat.id}
                      onSelect={(boatId) => {
                        setIsAlertOpen(true);
                        setValue(boatId);
                        setOpen(false);
                      }}
                      className="w-full cursor-pointer aria-selected:bg-transparent"
                    >
                      {boat.boatName}
                    </CommandItem>
                    <Link href={`/boat/${boat.boatCode}`} target="_blank">
                      <Info className="w-8 cursor-pointer px-2 hover:scale-105" />
                    </Link>
                  </div>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
