"use client";
import EditForm from "@/app/(admin)/admin/tellers/EditForm";
import NotFound from "@/app/not-found";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AvatarHolder from "@/components/utils/Avatar";
import { getTellerInfo } from "@/lib/api/tellerActions";
import { AccountDetailsTypes, UserTypes } from "@/lib/types";
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
  User,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const Profile = ({
  data,
  isAdmin,
  user,
}: {
  data: UserTypes;
  isAdmin: boolean;
  user: string;
}) => {
  const [accountDetails, setAccountDetails] = useState(data);
  const [viewImage, setViewImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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

  if (!accountDetails) {
    return <NotFound />;
  }

  return (
    <>
      {data && (isAdmin || user === accountDetails?.username) && isEditing && (
        <EditForm
          accountDetails={accountDetails as AccountDetailsTypes}
          setIsOpen={setIsEditing}
        />
      )}
      {viewImage !== "" && (
        <Dialog open={viewImage !== ""} onOpenChange={() => setViewImage("")}>
          <DialogContent>
            <Image
              src={viewImage}
              width={500}
              height={500}
              alt="image-dialog"
              className="aspect-square object-contain mt-5"
            />
          </DialogContent>
        </Dialog>
      )}
      <section className="flex lg:flex-row flex-col py-20 relative">
        {(isAdmin || user === accountDetails?.username) && (
          <Button
            className="flex gap-1 min-w-32 w-max absolute top-3 right-3"
            onClick={() => setIsEditing(true)}
          >
            <Edit size={16} />
            <span>Edit</span>
          </Button>
        )}
        <div className="flex flex-col gap-5 items-center min-w-fit">
          <AvatarHolder
            name={accountDetails?.fullName}
            image={accountDetails?.image}
            className={`size-40 ${accountDetails?.image && "cursor-pointer"}`}
            onClick={() => {
              if (accountDetails?.image) {
                setViewImage(accountDetails?.image as string);
              }
            }}
          />
          <div className="w-full lg:px-0 px-5">
            {isAdmin && (
              <h2 className="text-xs opacity-70 text-center">
                UID: {accountDetails?._id}
              </h2>
            )}
            {accountDetails?.fullName && (
              <h1 className="text-4xl font-bold text-center">
                {accountDetails.fullName}
              </h1>
            )}
            <InfoItem
              icon={<Clock />}
              label="Created"
              className="lg:w-full mt-3"
              value={formatDate(accountDetails?.createdAt, "MMM d, yyyy HH:mm")}
            />
            <InfoItem
              icon={<RefreshCw />}
              label="Updated"
              className="lg:w-full mt-3"
              value={formatDate(accountDetails?.updatedAt, "MMM d, yyyy HH:mm")}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-y-3 lg:gap-y-5 w-full px-5 mt-3 lg:mt-0 lg:px-10 justify-between">
          <InfoItem
            icon={<User />}
            label="Username"
            value={accountDetails?.username}
          />
          <InfoItem
            icon={<Mail />}
            label="Email"
            value={accountDetails?.email}
          />
          <InfoItem
            icon={<User />}
            label="First Name"
            value={accountDetails?.firstName}
          />
          <InfoItem
            icon={<User />}
            label="Last Name"
            value={accountDetails?.lastName}
          />
          <InfoItem
            icon={<Calendar />}
            label="Birthdate"
            className="lg:w-full"
            value={formatDate(accountDetails?.birthdate, "MMMM d, yyyy")}
          />
          <InfoItem
            icon={<Phone />}
            label="Contact"
            className="lg:w-full"
            value={accountDetails?.contact}
          />
          <InfoItem
            icon={<MapPin />}
            label="Address"
            className="lg:w-full"
            value={accountDetails?.address as string}
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
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center space-x-3 w-full lg:w-[49%] rounded-md shadow-sm p-2 border ${className}`}
    >
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
