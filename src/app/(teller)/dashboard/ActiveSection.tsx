"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import AvatarHolder from "@/components/utils/Avatar";
import Link from "next/link";

export default function ActiveSection({
  accounts,
}: {
  accounts: {
    fullName: string;
    image: string;
    status: string;
    email?: string;
    username: string;
  }[];
}) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredAccounts =
    accounts?.filter(
      (account) =>
        account.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-2xl font-bold">Teller Status</CardTitle>
        <CardDescription>
          View and track which team members are currently online or offline.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pb-0">
        <div className="flex space-x-2 mb-2">
          <Input
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <ScrollArea className="h-[300px] rounded-md pr-3">
          {filteredAccounts.map((account, index) => (
            <div key={index} className="flex items-center justify-between py-4">
              <Link
                href={`/profile/${account.username}`}
                className="flex items-center space-x-4"
              >
                <AvatarHolder
                  name={account?.fullName as string}
                  image={account?.image}
                />
                <div>
                  <p className="text-xs font-medium leading-none">
                    {account.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {account.email}
                  </p>
                </div>
              </Link>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    account.status === "active" ? "default" : "secondary"
                  }
                  className="text-[10px] uppercase"
                >
                  {account.status}
                </Badge>
              </div>
            </div>
          ))}
          {filteredAccounts.length === 0 && <div className="w-full h-full flex items-center justify-center">No Accounts Found.</div>}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
