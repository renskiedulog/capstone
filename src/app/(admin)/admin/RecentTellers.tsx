import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentTellers } from "@/lib/api/common";
import Avatar from "@/components/utils/Avatar";
import { UserTypes } from "@/lib/types";
import { formatDateToReadable } from "@/lib/utils";

export default async function RecentTellers() {
  const recentTellers: UserTypes[] = await getRecentTellers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {recentTellers?.map((teller, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <Avatar name={teller?.fullName} image={teller?.image} />
            <div className="grid gap-1">
              {teller?.fullName && (
                <p className="text-sm font-medium leading-none">
                  {teller?.fullName}
                </p>
              )}
              {teller?.email && (
                <p className="text-sm text-muted-foreground">{teller?.email}</p>
              )}
            </div>
            {teller?.createdAt && (
              <div className="ml-auto font-semibold text-xs text-right opacity-70">
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
