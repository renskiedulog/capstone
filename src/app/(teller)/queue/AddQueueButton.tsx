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
import { ChevronRight, Info, PlusCircle } from "lucide-react";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export default function AddQueueButton({
  addQueue,
}: {
  addQueue: (e: any) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
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
              {frameworks.map((framework) => (
                <div className="flex items-center justify-between hover:bg-secondary mt-1 rounded">
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      addQueue((prev: String[]) => [...prev, currentValue]);
                      setOpen(false);
                    }}
                    className="w-full cursor-pointer aria-selected:bg-transparent"
                  >
                    {framework.label}
                  </CommandItem>
                  <Info className="w-8 cursor-pointer px-2" />
                </div>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
