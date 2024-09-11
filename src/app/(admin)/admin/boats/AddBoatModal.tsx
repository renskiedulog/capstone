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
import { generateRandomString } from "@/lib/utils";
import { createTeller, isUsernameTaken } from "@/lib/api/tellerActions";
import { useFormState, useFormStatus } from "react-dom";
import { useToast } from "@/components/ui/use-toast";
import socket from "@/socket";
import { Boat } from "@/lib/types";
import Image from "next/image";

const initialInputs: Boat = {
  _id: "",
  registrationNumber: "",
  ownerName: "",
  driverName: "",
  boatName: "",
  mainImage: "",
  capacity: 0,
  boatDetails: "",
  images: [],
  additionalInfo: "",
  boatCode: "",
  contactNumber: "",
  lastCheck: "",
  checkingDetails: "",
};

export default function AddBoatModal({
  setViewImage,
}: {
  setViewImage: (url: string) => void;
}) {
  const { toast } = useToast();
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputs, setInputs] = useState(initialInputs);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [pendingModalClose, setPendingModalClose] = useState(false);
  const [state, formAction] = useFormState(createTeller, null);
  const [error, setError] = useState("");

  const handleModal = () => {
    const hasValues = Object.values(inputs).some((value) => {
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      return value !== "";
    });

    if (isModalOpen && (hasValues || mainImagePreview)) {
      setIsAlertOpen(true);
      setPendingModalClose(true);
    } else {
      setIsModalOpen((prev) => !prev);
    }
  };

  const handleAlertConfirm = () => {
    handleReset();
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

  const handleGeneratePassword = () => {
    const newPassword = generateRandomString(Math.floor(Math.random() * 6) + 5); // Generate a password between 5 and 10 characters
    setInputs((prevInputs) => ({
      ...prevInputs,
      password: newPassword,
    }));
  };

  const handleInputChange = useCallback((e: any) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  }, []);

  const handleReset = () => {
    setMainImagePreview("");
    setInputs(initialInputs);
    clearMainImageInput();
  };

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
      images: prev?.images?.filter((_, index) => index !== indexToRemove),
    }));
  };

  // useEffect(() => {
  //   if (state?.success) {
  //     socket.emit("tellerRefresh", { info: "Refresh Teller Infos" });
  //     handleReset();
  //     setIsModalOpen(false);
  //     toast({
  //       title: "Teller Successfully Created.",
  //       description:
  //         "You can edit, delete and view this account by clicking the actions tab.",
  //     });
  //   } else if (!state?.success && state?.message) {
  //     setError("Something went wrong, please enter valid inputs.");
  //   }
  // }, [state?.success]);

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
      <Button onClick={handleModal}>Add Boat</Button>
      {isModalOpen && (
        <form
          action={formAction}
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
              <CardTitle>Add A Boat</CardTitle>
              <CardDescription>
                Provide the necessary details for the boat.
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
                <div className="flex flex-col gap-2 w-5/6 sm:w-7/12 aspect-square sm:min-h-[550px] sm:max-h-[400px] sm:overflow-y-auto scrollbar p-2">
                  {/* Main Image */}
                  <Label
                    htmlFor="mainImage"
                    className={`bg-white relative z-10 space-y-1 group flex items-center min-h-[200px] justify-center flex-col border-2 cursor-pointer border-black/50 rounded ${mainImagePreview ? "border-solid" : "border-dashed"}`}
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
                          Upload A Main Image
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
                  <div className="grid grid-cols-3 sm:grid-cols-2 gap-2">
                    {inputs?.images?.map((img, idx) => (
                      <div className="relative">
                        <Image
                          width={150}
                          height={150}
                          src={img as string}
                          alt="sad"
                          className="w-full aspect-square rounded cursor-pointer hover:brightness-100 brightness-[0.8] object-cover"
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
                      <p className="group-hover:opacity-70 opacity-50 text-center text-[10px] sm:text-xs px-2">
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
                <div className="w-full mx-5 space-y-2">
                  {/* <div className="w-full flex sm:flex-row flex-col gap-2">
                    <div className="flex-1">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        required
                        type="text"
                        placeholder="Enter your username"
                        value={inputs.username}
                        onChange={handleInputChange}
                        onBlur={(e) => handleCheckUsername(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        required
                        type="text"
                        placeholder="Enter your password"
                        value={inputs.password}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="w-full flex sm:flex-row flex-col gap-2">
                    <div className="flex-1">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        type="text"
                        placeholder="Enter your name"
                        value={inputs.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        type="text"
                        placeholder="Enter your last name"
                        value={inputs.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      required
                      type="email"
                      placeholder="Enter permanent email"
                      value={inputs.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      required
                      type="text"
                      placeholder="Enter permanent address"
                      value={inputs.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="w-full flex-1">
                      <Label htmlFor="address">Contact Number</Label>
                      <Input
                        id="contact"
                        name="contact"
                        required
                        type="tel"
                        placeholder="Enter contact number"
                        value={inputs.contact}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="address">Birth Date</Label>
                      <Input
                        id="birthdate"
                        name="birthdate"
                        required
                        type="date"
                        value={inputs.birthdate}
                        onChange={handleInputChange}
                        className="!block"
                      />
                    </div>
                  </div> */}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="!text-xs"
                  onClick={handleGeneratePassword}
                >
                  Generate Password
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="!text-xs"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
              <SubmitButton />
            </CardFooter>
          </Card>
        </form>
      )}
    </>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
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
        <p>Create</p>
      )}
    </Button>
  );
};
