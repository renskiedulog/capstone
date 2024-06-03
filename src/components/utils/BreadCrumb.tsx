"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const BreadcrumbComponent = () => {
  const pathname = usePathname();

  const paths = React.useMemo(() => {
    if (pathname) {
      return pathname.split("/").filter(Boolean);
    }
    return [];
  }, [pathname]);

  return (
    <Breadcrumb className="uppercase tracking-wider">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="opacity-70 hover:opacity-100">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {paths.map((path, idx) => (
          <React.Fragment key={idx}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className={`${
                  idx === paths.length - 1
                    ? "font-medium opacity-100"
                    : "opacity-70 hover:opacity-100"
                }`}
                href={`/${paths.slice(0, idx + 1).join("/")}`}
              >
                {path}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default React.memo(BreadcrumbComponent);
