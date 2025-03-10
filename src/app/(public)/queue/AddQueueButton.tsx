"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
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
import { addQueue, fetchBoatIds } from "@/lib/api/queue";
import { Queue } from "@/lib/types";
import Link from "next/link";
import { useSession } from "next-auth/react";
import socket from "@/socket";
import { useToast } from "@/components/ui/use-toast";
import { checkBoatCapacity } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { addNewActivity } from "@/lib/api/activity";

export default function AddQueueButton() {
  const session: any = useSession() || null;
  const username = session?.data?.user?.username;
  const [open, setOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [boatIds, setBoatIds] = React.useState([] as Queue[]);
  const { toast } = useToast();

  const handleAlertConfirm = async () => {
    const insertQueue = boatIds?.find((boat) => boat.id === value);
    if (insertQueue) await addQueue(insertQueue?.id, username);
    addActivity(insertQueue?.boatName as string);
    setValue("");
    socket.emit("queueRefresh");
    toast({
      title: "Successfully added an entry to the queue.",
      description: `You can view the details by clicking the icon on the right side.`,
    });
  };

  const handleAlertCancel = () => {
    return;
  };

  const getBoatIds = async () => {
    try {
      const req = await fetchBoatIds();
      setBoatIds(req as Queue[]);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getBoatIds();
  }, []);

  const addActivity = async (boatName: string) => {
    if (session?.data?.user?.isAdmin) return;
    await addNewActivity({
      type: "queue",
      title: "Added Queue",
      details: `The boat named '${boatName}' has been added to the queue.`,
      actionBy: username,
    });
    socket.emit("newActivity");
  };

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
        <PopoverContent className="p-0 sm:w-[400px]">
          <Command>
            <CommandList>
              <CommandEmpty>No boat found.</CommandEmpty>
              <CommandGroup>
                {boatIds?.map((boat: Queue) => (
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
                      className="w-full cursor-pointer aria-selected:bg-transparent flex justify-between pr-0"
                    >
                      {boat.boatName}
                      <Badge className="uppercase !text-[8px] min-w-16 tracking-wider font-bold py-0.5 px-2.5 items-center justify-center">
                        {checkBoatCapacity(boat?.capacity as number)}
                      </Badge>
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
