"use client";
import BoatEditForm from "@/app/(admin)/admin/boats/BoatEditForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { fetchBoatDetails } from "@/lib/api/boatActions";
import { Boat } from "@/lib/types";
import socket from "@/socket";
import Image from "next/image";
import React, { useState } from "react";

const BoatDetails = ({ boatDetails }: { boatDetails: Boat }) => {
  const [boatInfo, setBoatInfo] = useState(boatDetails);
  const [open, setOpen] = useState(false);
  const [viewImage, setViewImage] = useState("");
  const [boatCode, setBoatCode] = useState(boatDetails.boatCode as string);

  React.useEffect(() => {
    socket.on("boatRefresh", () => {
      fetchData();
    });

    return () => {
      socket.off("boatRefresh");
    };
  }, []);

  const fetchData = async () => {
    const req = (await fetchBoatDetails(boatCode)) ?? null;

    setBoatInfo(req as Boat);
  };

  return (
    <div className="relative">
      <Button className="absolute right-0 top-0" onClick={() => setOpen(true)}>
        Edit Boat
      </Button>
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
      {open && (
        <BoatEditForm
          setViewImage={setViewImage}
          setIsOpen={setOpen}
          boatDetails={boatDetails}
          setBoatCode={setBoatCode}
        />
      )}
    </div>
  );
};

export default BoatDetails;
