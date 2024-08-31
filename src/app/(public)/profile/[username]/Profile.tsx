"use client";
import EditForm from "@/app/(admin)/tellers/EditForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AvatarHolder from "@/components/utils/Avatar";
import { getTellerInfo } from "@/lib/api/tellerActions";
import { UserTypes } from "@/lib/types";
import socket from "@/socket";
import { formatDate } from "date-fns";
import {
  Calendar,
  Clock,
  Edit,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const Profile = ({ data, isAdmin }: { data: UserTypes; isAdmin: boolean }) => {
  const [accountDetails, setAccountDetails] = useState(data);
  const [viewImage, setViewImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  console.log(isAdmin);

  React.useEffect(() => {
    socket.on("tellerRefresh", (data) => {
      fetchData();
    });

    return () => {
      socket.off("tellerRefresh");
    };
  }, []);

  const fetchData = async () => {
    const req = await getTellerInfo(data.username);
    setAccountDetails(req);
  };

  return (
    <>
      {data && isAdmin && isEditing && (
        <EditForm accountDetails={accountDetails} setIsOpen={setIsEditing} />
      )}
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
      <section>
        <div className="flex justify-between">
          <div className="flex items-center gap-5">
            <AvatarHolder
              name={accountDetails.fullName}
              image={accountDetails.image}
              className={`size-28 ${accountDetails.image && "cursor-pointer"}`}
              onClick={() => {
                if (accountDetails?.image) {
                  setViewImage(accountDetails.image as string);
                }
              }}
            />
            <div>
              {isAdmin && (
                <h2 className="text-xs opacity-70">
                  UID: {accountDetails._id}
                </h2>
              )}
              {accountDetails?.fullName && (
                <h1 className="text-4xl font-bold">
                  {accountDetails.fullName}
                </h1>
              )}
              {accountDetails.email && (
                <h2 className="text-xl opacity-70">{accountDetails.email}</h2>
              )}
            </div>
          </div>
          {isAdmin && (
            <Button
              className="flex gap-1 min-w-32"
              onClick={() => setIsEditing(true)}
            >
              <Edit size={16} />
              <span>Edit</span>
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-y-5 mt-5">
          <InfoItem
            icon={<Mail />}
            label="Email"
            value={accountDetails.email}
          />
          <InfoItem
            icon={<Calendar />}
            label="Birthdate"
            value={formatDate(accountDetails.birthdate, "MMMM d, yyyy")}
          />
          <InfoItem
            icon={<MapPin />}
            label="Address"
            value={accountDetails.address as string}
          />
          <InfoItem
            icon={<Phone />}
            label="Contact"
            value={accountDetails.contact}
          />
          <InfoItem
            icon={<Clock />}
            label="Created"
            value={formatDate(accountDetails.createdAt, "MMM d, yyyy HH:mm")}
          />
          <InfoItem
            icon={<RefreshCw />}
            label="Updated"
            value={formatDate(accountDetails.updatedAt, "MMM d, yyyy HH:mm")}
          />
        </div>
      </section>
    </>
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
