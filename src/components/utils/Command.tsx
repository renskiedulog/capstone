"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { commandLinks } from "@/lib/constants";
import Link from "next/link";

export default function Command() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, commandLinks]);
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
        <span className="mx-1">or</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">ctrl +</span>J
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {commandLinks?.map((command, idx) => (
            <CommandGroup heading={command?.heading} key={idx}>
              {command?.links?.map((link, idx) => (
                <Link
                  href={link?.link}
                  key={idx}
                  onClick={() => setOpen(false)}
                  className="group hover:text-black"
                >
                  <CommandItem className="!bg-transparent !opacity-60 group-hover:!bg-accent group-hover:!opacity-80">
                    {link?.icon}
                    <span>{link?.title}</span>
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
