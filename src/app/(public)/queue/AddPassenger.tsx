"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCallback, useEffect, useState } from "react";
import { ImageIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Alert from "@/components/utils/Alert";
import { generateRandomString } from "@/lib/utils";
import { createTeller, isUsernameTaken } from "@/lib/api/tellerActions";
import { useFormState, useFormStatus } from "react-dom";
import { useToast } from "@/components/ui/use-toast";
import socket from "@/socket";
import { addNewActivity } from "@/lib/api/activity";

const initialInputs = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  address: "",
  contact: "",
  birthdate: "",
  email: "",
};

export default function AddTellerModal() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputs, setInputs] = useState(initialInputs);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [pendingModalClose, setPendingModalClose] = useState(false);
  const [error, setError] = useState("");

  const handleModal = () => {
    const hasValues = Object.values(inputs).some(
      (value) => value.trim() !== ""
    );
    if (isModalOpen && (hasValues || imagePreview)) {
      setIsAlertOpen(true);
      setPendingModalClose(true);
    } else {
      setIsModalOpen((prev) => !prev);
    }
  };

  const handleAlertConfirm = () => {
    setError("");
    setIsAlertOpen(false);
    if (pendingModalClose) {
      setIsModalOpen(false);
      setPendingModalClose(false);
    }
  };

  const handleAlertCancel = () => {
    setIsAlertOpen(false);
    setPendingModalClose(false);
  };

  const handleInputChange = useCallback((e: any) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  }, []);

  // const addActivity = async () => {
  //   await addNewActivity({
  //     type: "teller",
  //     title: "Added Teller Account",
  //     details: `Account with the username '${inputs.username}' has been added.`,
  //     link: `/profile/${inputs?.username}`,
  //     actionBy: "ADMIN",
  //   });
  //   socket.emit("newActivity");
  // };

  return (
    <>
      <Alert
        title="Are you sure you want to exit?"
        description="Everything in this form will be deleted once you close this modal."
        open={isAlertOpen}
        openChange={setIsAlertOpen}
        onConfirm={handleAlertConfirm}
        onCancel={handleAlertCancel}
      />
      <Button className="text-xs sm:text-base" onClick={handleModal}>
        Add Passenger
      </Button>
      {isModalOpen && (
        <div
          className="bg-black/50 w-full h-screen fixed top-0 left-0 z-50 flex items-center justify-center"
          onClick={handleModal}
        >
          <Card
            className="border-none w-full max-w-3xl mx-5 relative max-h-[700px] overflow-y-auto scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <XIcon
              className="close-button absolute top-3 right-3 hover:scale-110 transition cursor-pointer"
              onClick={handleModal}
            />
            <CardHeader>
              <CardTitle>Add Passenger</CardTitle>
              <CardDescription>
                Provide the necessary details for the passenger.
              </CardDescription>
              {error !== "" && (
                <CardDescription className="text-red-500">
                  {error}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="mx-auto"></CardContent>
            <CardFooter className="flex justify-end items-center">
              <Button type="submit" className="flex items-center gap-2">
                Add
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
