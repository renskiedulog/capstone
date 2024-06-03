import { cn } from "@/lib/utils";
import React from "react";

const AbsoluteDiv = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "absolute left-0 top-0 h-full w-full bg-[#0003]",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default AbsoluteDiv;
