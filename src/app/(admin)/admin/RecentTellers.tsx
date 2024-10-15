"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRecentTellers } from "@/lib/api/common";
import Avatar from "@/components/utils/Avatar";
import { UserTypes } from "@/lib/types";
import { formatDateToReadable } from "@/lib/utils";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import socket from "@/socket";

function RecentTellers({ data }: { data: UserTypes[] }) {
  const [recentTellers, setUserTellers] = useState(data);

  useEffect(() => {
    socket.on("tellerRefresh", (data) => {
      fetchRecentTellers();
    });

    return () => {
      socket.off("tellerRefresh");
    };
  }, []);

  const fetchRecentTellers = async () => {
    const req = await getRecentTellers();
    setUserTellers(req);
  };

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center">
        <div>
          <CardTitle>Recent Tellers</CardTitle>
          <CardDescription>The 5 tellers recently added.</CardDescription>
        </div>
        <UserIcon size={30} />
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {recentTellers?.length > 0 ? (
          recentTellers.map((teller, index) => (
            <div
              key={teller?.username || `${teller?.email}-${index}`}
              className="flex items-center gap-4"
            >
              {teller?.username && (
                <Link href={`/profile/${teller.username}`}>
                  <Avatar name={teller?.fullName} image={teller?.image} />
                </Link>
              )}
              <div className="grid gap-1">
                {teller?.fullName && (
                  <Link href={`/profile/${teller.username}`}>
                    <p className="text-sm font-semibold leading-none">
                      {teller?.fullName}
                    </p>
                  </Link>
                )}
                {teller?.email && (
                  <p className="text-xs text-muted-foreground">
                    {teller?.email}
                  </p>
                )}
              </div>
              {teller?.createdAt && (
                <div className="ml-auto font-semibold text-[10px] text-right opacity-70">
                  {formatDateToReadable(teller?.createdAt)
                    .split("-")
                    .map((word, idx) => (
                      <span key={idx}>
                        {idx === 0 ? (
                          word
                        ) : (
                          <>
                            <br /> {word}
                          </>
                        )}
                      </span>
                    ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <h1 className="text-center">
            There are currently no recent tellers.
          </h1>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentTellers;
