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
import { ImageIcon, PlusCircleIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Alert from "@/components/utils/Alert";
import { formatInputDate, generateRandomString, isEqual } from "@/lib/utils";
import { useFormState, useFormStatus } from "react-dom";
import { editTeller, isUsernameTaken } from "@/lib/api/tellerActions";
import { useToast } from "@/components/ui/use-toast";
import socket from "@/socket";
import { Boat } from "@/lib/types";
import Image from "next/image";

export default function BoatEditForm({
  boatDetails,
  setIsOpen,
  setViewImage,
}: {
  boatDetails: Boat;
  setIsOpen: (state: boolean) => void;
  setViewImage: (url: string) => void;
}) {
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [inputs, setInputs] = useState(boatDetails);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [pendingModalClose, setPendingModalClose] = useState(false);
  const [state, formAction] = useFormState(editTeller, null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleModalClose = () => {
    setIsAlertOpen(true);
    setPendingModalClose(true);
  };

  const handleAlertConfirm = () => {
    setIsAlertOpen(false);
    if (pendingModalClose) {
      setIsOpen(false);
      setPendingModalClose(false);
    }
  };

  const handleAlertCancel = () => {
    setIsAlertOpen(false);
    setPendingModalClose(false);
  };

  const handleMainImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      setInputs((prev: Boat) => ({
        ...prev,
        mainImage: reader.result,
      }));
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (event: any) => {
    const files = event.target.files;
    if (files.length > 0) {
      const newImages: string[] = [];

      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result === "string") {
            newImages.push(result);
          }

          if (newImages.length === files.length) {
            setInputs((prev: Boat) => ({
              ...prev,
              images: [...(prev.images || []), ...newImages],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleInputChange = useCallback((e: any) => {
    const { name, value } = e.target;
    setInputs((prevInputs: any) => ({
      ...prevInputs,
      [name]: value,
    }));
  }, []);

  function clearMainImageInput() {
    const fileInput = document.getElementById(
      "mainImage"
    ) as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
      setMainImagePreview("");
      setInputs((prev) => ({ ...prev, mainImage: "" }));
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setInputs((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  // useEffect(() => {
  //   if (state?.success) {
  //     setIsOpen(false);
  //     socket.emit("tellerRefresh", { info: "Refresh Teller Infos" });
  //     toast({
  //       title: "Teller Edited Successfully.",
  //       description: "Please wait for a few seconds for changes to be saved.",
  //     });
  //   }
  // }, [state?.success]);

  useEffect(() => {
    setMainImagePreview(boatDetails?.mainImage as string);
  }, [boatDetails]);

  return (
    <>
      <Alert
        title="Are you sure you want to cancel edit?"
        description="Any changes you made will not be saved."
        open={isAlertOpen}
        openChange={setIsAlertOpen}
        onConfirm={handleAlertConfirm}
        onCancel={handleAlertCancel}
      />
      <form
        action={formAction}
        className="bg-black/50 w-full h-screen fixed top-0 left-0 z-50 flex items-center justify-center"
        onClick={handleModalClose}
      >
        <Card
          className="border-none w-full max-w-4xl mx-5 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <XIcon
            className="close-button absolute top-3 right-3 hover:scale-110 transition cursor-pointer"
            onClick={handleModalClose}
          />
          <CardHeader>
            <CardTitle>Edit Boat Details</CardTitle>
            <CardDescription>
              Edit the necessary details for the boat. You can leave the inputs
              unchanged.
            </CardDescription>
            {error !== "" && (
              <CardDescription className="text-red-500">
                {error}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="mx-auto">
            <div className="flex w-full flex-col sm:flex-row items-center gap-2">
              {/* Images */}
              <div className="flex flex-col gap-2 w-1/2 sm:w-2/6 aspect-square` max-h-[400px] sm:overflow-scroll scrollbar p-2">
                {/* Main Image */}
                <Label
                  htmlFor="mainImage"
                  className={`bg-white relative z-10 space-y-1 group w-full h-[150px] sm:h-[250px] flex items-center justify-center flex-col border-2 cursor-pointer border-black/50 rounded ${mainImagePreview ? "border-solid" : "border-dashed"}`}
                >
                  {mainImagePreview ? (
                    <>
                      <img
                        src={mainImagePreview}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                      />
                      <Input
                        type="string"
                        id="image"
                        name="image"
                        className="hidden"
                        value={mainImagePreview}
                      />
                      <XIcon
                        className="absolute z-20 -top-3 -right-2 bg-red-500 rounded-full p-0.5 text-white cursor-pointer hover:scale-105"
                        size={20}
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default action if necessary
                          e.stopPropagation(); // Prevent the event from reaching the parent
                          clearMainImageInput();
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <ImageIcon className="group-hover:opacity-70 opacity-50" />
                      <p className="group-hover:opacity-70 opacity-50">
                        Upload An Image
                      </p>
                    </>
                  )}
                  <Input
                    type="file"
                    id="mainImage"
                    name="mainImage"
                    accept=".png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleMainImageUpload}
                  />
                </Label>
                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {inputs?.images?.map((img, idx) => (
                    <div className="relative">
                      <Image
                        width={150}
                        height={150}
                        src={img as string}
                        alt="sad"
                        className="w-full aspect-square object-cover rounded cursor-pointer hover:brightness-100 brightness-[0.8]"
                        onClick={() => setViewImage(img as string)}
                      />
                      <XIcon
                        className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 text-white cursor-pointer hover:scale-105"
                        size={20}
                        onClick={() => handleRemoveImage(idx)}
                      />
                    </div>
                  ))}
                  <Label
                    htmlFor="uploadDocs"
                    className={`bg-white z-10 space-y-1 group w-full aspect-square flex items-center justify-center flex-col border-2 cursor-pointer border-black/50 rounded border-dashed`}
                  >
                    <PlusCircleIcon className="group-hover:opacity-70 opacity-50" />
                    <p className="group-hover:opacity-70 opacity-50 text-center text-xs">
                      Upload An Image or Document
                    </p>
                    <Input
                      type="file"
                      id="uploadDocs"
                      name="uploadDocs"
                      accept=".png,.jpg,.jpeg"
                      className="hidden"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end items-center">
            <SubmitButton disabled={isEqual(inputs, boatDetails)} />
          </CardFooter>
        </Card>
      </form>
    </>
  );
}

const SubmitButton = ({ disabled }: { disabled?: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className="flex items-center gap-2"
    >
      {pending ? (
        <>
          <svg
            className="-ml-1 h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p>Processing...</p>
        </>
      ) : (
        <p>Save</p>
      )}
    </Button>
  );
};
