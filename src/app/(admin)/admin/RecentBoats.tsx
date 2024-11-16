"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Avatar from "@/components/utils/Avatar";
import { Boat } from "@/lib/types";
import { formatDateToReadable } from "@/lib/utils";
import { useEffect, useState } from "react";
import socket from "@/socket";
import Link from "next/link";
import { getRecentBoats } from "@/lib/api/boatActions";

function RecentBoats({ data }: { data: Boat[] }) {
  const [recentBoats, setRecentBoats] = useState(data);

  useEffect(() => {
    socket.on("boatRefresh", () => {
      fetchRecentBoats();
    });

    return () => {
      socket.off("boatRefresh");
    };
  }, []);

  const fetchRecentBoats = async () => {
    const req = await getRecentBoats();
    setRecentBoats(req);
  };

  return (
    <Card className="w-full lg:w-1/2">
      <CardHeader className="flex-row justify-between items-center">
        <div>
          <CardTitle>Recent Boats</CardTitle>
          <CardDescription>The 5 boats recently added.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {recentBoats?.length > 0 ? (
          recentBoats.map((boat, index) => (
            <div
              key={boat?.boatCode || `${boat?.boatName}-${index}`}
              className="flex items-center gap-4"
            >
              <Link href={`/boat/${boat?.boatCode}`}>
                <Avatar
                  name={boat?.boatName as string}
                  image={boat?.mainImage}
                />
              </Link>
              <div className="grid gap-1">
                <Link href={`/boat/${boat?.boatCode}`}>
                  <p className="text-sm font-semibold leading-none">
                    {boat?.boatName}
                  </p>
                </Link>
                <p className="text-xs text-muted-foreground">
                  Owner: {boat?.ownerName}
                </p>
              </div>
              {boat?.createdAt && (
                <div className="ml-auto font-semibold text-[10px] text-right opacity-70">
                  {formatDateToReadable(boat?.createdAt)
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
          <h1 className="text-center">There are currently no recent boats.</h1>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentBoats;
