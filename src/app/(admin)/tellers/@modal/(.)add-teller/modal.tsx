"use client";

import { type ElementRef, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { XIcon } from "lucide-react";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <Card className="border-none">
      <dialog
        ref={dialogRef}
        className="max-w-3xl w-full max-h-[500px] h-full rounded-md p-2 relative"
        onClose={onDismiss}
      >
        <XIcon
          onClick={onDismiss}
          className="close-button absolute top-3 right-3 hover:scale-110 transition cursor-pointer"
        />
        <CardHeader>
          <CardTitle>Add Teller Account</CardTitle>
          <CardDescription>
            Provide the necessary details for the account.
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </dialog>
    </Card>,
    document.getElementById("modal-root")!
  );
}
