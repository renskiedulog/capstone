"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AvatarHolder from "@/components/utils/Avatar";
import { UserTypes } from "@/lib/types";
import { formatDate } from "date-fns";
import { Calendar, Clock, Mail, MapPin, Phone, RefreshCw } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const Profile = ({ data, isAdmin }: { data: UserTypes; isAdmin: boolean }) => {
  const [viewImage, setViewImage] = useState("");

  return (
    <section>
      {viewImage !== "" && (
        <Dialog open={viewImage !== ""} onOpenChange={() => setViewImage("")}>
          <DialogContent>
            <Image
              src={viewImage}
              width={500}
              height={500}
              alt="image-dialog"
              className="aspect-square object-cover mt-5"
            />
          </DialogContent>
        </Dialog>
      )}
      <div className="flex items-center gap-5">
        <AvatarHolder
          name={data.fullName}
          image={data.image}
          className={`size-28 ${data.image && "cursor-pointer"}`}
          onClick={() => {
            if (data?.image) {
              setViewImage(data.image as string);
            }
          }}
        />
        <div>
          {isAdmin && <h2 className="text-xs opacity-70">UID: {data._id}</h2>}
          {data?.fullName && (
            <h1 className="text-4xl font-bold">{data.fullName}</h1>
          )}
          {data.email && <h2 className="text-xl opacity-70">{data.email}</h2>}
        </div>
      </div>
      <div className="flex flex-wrap gap-y-5 mt-5">
        <InfoItem icon={<Mail />} label="Email" value={data.email} />
        <InfoItem
          icon={<Calendar />}
          label="Birthdate"
          value={formatDate(data.birthdate, "MMMM d, yyyy")}
        />
        <InfoItem
          icon={<MapPin />}
          label="Address"
          value={data.address as string}
        />
        <InfoItem icon={<Phone />} label="Contact" value={data.contact} />
        <InfoItem
          icon={<Clock />}
          label="Created"
          value={formatDate(data.createdAt, "MMM d, yyyy HH:mm")}
        />
        <InfoItem
          icon={<RefreshCw />}
          label="Updated"
          value={formatDate(data.updatedAt, "MMM d, yyyy HH:mm")}
        />
      </div>
    </section>
  );
};

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center space-x-3 w-full sm:w-1/2">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/90 text-white flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-lg text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default Profile;
