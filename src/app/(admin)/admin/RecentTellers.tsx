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

export default async function RecentTellers() {
  const recentTellers: UserTypes[] = await getRecentTellers();

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center">
        <div>
          <CardTitle>Recent Tellers</CardTitle>
          <CardDescription>The 5 tellers recently added.</CardDescription>
        </div>
        <UserIcon size={30} />
      </CardHeader>
      <CardContent className="grid gap-8">
        {recentTellers?.map((teller, idx) => (
          <div key={idx} className="flex items-center gap-4">
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
                <p className="text-xs text-muted-foreground">{teller?.email}</p>
              )}
            </div>
            {teller?.createdAt && (
              <div className="ml-auto font-semibold text-[10px] text-right opacity-70">
                {formatDateToReadable(teller?.createdAt)
                  .split("-")
                  ?.map((word, idx) => {
                    if (idx === 0) {
                      return word;
                    } else {
                      return (
                        <>
                          <br /> {word}
                        </>
                      );
                    }
                  })}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
