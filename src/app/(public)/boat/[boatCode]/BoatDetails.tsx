"use client";
import BoatEditForm from "@/app/(admin)/admin/boats/BoatEditForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { fetchBoatDetails } from "@/lib/api/boatActions";
import { Boat } from "@/lib/types";
import { formatDateToReadable } from "@/lib/utils";
import socket from "@/socket";
import {
  Anchor,
  Badge,
  CheckCircle,
  Contact,
  Contact2,
  Info,
  Ship,
  User,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const BoatDetails = ({ boatDetails }: { boatDetails: Boat }) => {
  const [boatInfo, setBoatInfo] = useState(boatDetails);
  const [open, setOpen] = useState(false);
  const [viewImage, setViewImage] = useState("");

  React.useEffect(() => {
    socket.on("boatRefresh", () => {
      fetchData();
    });

    return () => {
      socket.off("boatRefresh");
    };
  }, []);

  const fetchData = async () => {
    const req =
      (await fetchBoatDetails(boatDetails?.boatCode as string)) ?? null;

    setBoatInfo(req as Boat);
  };

  return (
    <div className="relative">
      <Button className="absolute right-0 top-0" onClick={() => setOpen(true)}>
        Edit Boat
      </Button>
      {viewImage !== "" && (
        <Dialog open={viewImage !== ""} onOpenChange={() => setViewImage("")}>
          <DialogContent aria-describedby="image">
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
      {open && (
        <BoatEditForm
          setViewImage={setViewImage}
          setIsOpen={setOpen}
          boatDetails={boatInfo}
        />
      )}
      <div className="mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          {boatInfo.boatName}
        </h1>
        <div className="grid lg:grid-cols-[45%,55%] gap-5">
          {/* Images */}
          <div className="space-y-2">
            <Image
              width={500}
              height={500}
              alt={boatInfo?.boatName as string}
              src={
                boatInfo?.mainImage
                  ? boatInfo?.mainImage
                  : "/images/default-image.jpg"
              }
              className="w-full aspect-[16/10] object-cover border rounded cursor-pointer"
              onClick={() =>
                setViewImage(
                  boatInfo?.mainImage
                    ? boatInfo?.mainImage
                    : "/images/default-image.jpg"
                )
              }
            />
            {boatInfo?.images && boatInfo?.images?.length > 0 && (
              <Carousel className="w-full mx-auto">
                <CarouselContent className="-ml-1">
                  {boatInfo?.images?.map((img, index) => (
                    <CarouselItem
                      key={index}
                      className="pl-1 basis-1/3 sm:basis-1/2 lg:basis-1/3"
                    >
                      <Image
                        width={500}
                        height={500}
                        alt={`${boatInfo?.boatName}-image-${index}`}
                        src={
                          img ? (img as string) : "/images/default-image.jpg"
                        }
                        className="w-full aspect-square object-cover border rounded cursor-pointer hover:scale-[1.02]"
                        onClick={() => setViewImage(img as string)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-5 size-10" />
                <CarouselNext className="-right-5 size-10" />
              </Carousel>
            )}
          </div>
          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-1 md:grid-rows-[auto,auto] gap-2 h-max">
            <Card className="p-2 col-span-1 md:col-span-2 h-max">
              <CardHeader className="p-2">
                <CardTitle className="text-2xl flex items-center gap-1">
                  <Info size={24} className="mb-1" />
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 text-sm sm:text-base md:text-lg">
                {boatInfo?.boatName && (
                  <p>
                    <span className="font-bold">Boat Name: </span>
                    {boatInfo?.boatName}
                  </p>
                )}
                {boatInfo?.boatCode && (
                  <p>
                    <span className="font-bold">Boat Code: </span>
                    {boatInfo?.boatCode}
                  </p>
                )}
                <p>
                  <span className="font-bold">Features: </span>
                  {boatInfo?.boatFeatures ||
                    "No features provided for this boat yet."}
                </p>
                <p>
                  <span className="font-bold">Additional Info: </span>
                  {boatInfo?.additionalInfo ||
                    "No additional info provided for this boat yet."}
                </p>
              </CardContent>
            </Card>
            <Card className="p-2">
              <CardHeader className="p-2">
                <CardTitle className="text-2xl flex items-center gap-1">
                  <Contact2 size={24} className="mb-1" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 text-sm sm:text-base md:text-lg">
                {boatInfo?.ownerName && (
                  <p>
                    <span className="font-bold">Owner Name: </span>
                    {boatInfo?.ownerName}
                  </p>
                )}
                {boatInfo?.ownerContactNumber && (
                  <p>
                    <span className="font-bold">Owner Contact Number: </span>
                    {boatInfo?.ownerContactNumber}
                  </p>
                )}
                {boatInfo?.driverName && (
                  <p>
                    <span className="font-bold">Driver Name: </span>
                    {boatInfo?.driverName}
                  </p>
                )}
                {boatInfo?.driverContactNumber && (
                  <p>
                    <span className="font-bold">Driver Contact Number: </span>
                    {boatInfo?.driverContactNumber}
                  </p>
                )}
              </CardContent>
            </Card>
            <Card className="p-2">
              <CardHeader className="p-2">
                <CardTitle className="text-2xl flex items-center gap-1">
                  <CheckCircle size={24} className="mb-0.5" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 text-sm sm:text-base">
                <p>
                  <span className="font-bold">Capacity: </span>
                  {boatInfo?.capacity}
                </p>
                {boatInfo?.checkingStatus && (
                  <p>
                    <span className="font-bold">Checking Status: </span>
                    {boatInfo?.checkingStatus?.toUpperCase()}
                  </p>
                )}
                {boatInfo?.lastCheck && (
                  <p>
                    <span className="font-bold">Last Checking: </span>
                    {formatDateToReadable(boatInfo?.lastCheck)}
                  </p>
                )}
                {boatInfo?.createdAt && (
                  <p>
                    <span className="font-bold">Created At: </span>
                    {formatDateToReadable(boatInfo?.createdAt)}
                  </p>
                )}
                {boatInfo?.updatedAt && (
                  <p>
                    <span className="font-bold">Updated At: </span>
                    {formatDateToReadable(boatInfo?.updatedAt)}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoatDetails;
