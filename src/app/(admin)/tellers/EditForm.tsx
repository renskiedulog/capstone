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
import { formatInputDate, generateRandomString } from "@/lib/utils";
import { useFormState, useFormStatus } from "react-dom";
import { editTeller } from "@/lib/api/tellerActions";
import { AccountDetailsTypes } from "@/lib/types";

const initialInputs = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  address: "",
  contact: "",
  birthdate: "",
};

export default function EditForm({
  accountDetails,
  setIsOpen,
}: {
  accountDetails: AccountDetailsTypes;
  setIsOpen: (state: boolean) => void;
}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [inputs, setInputs] = useState(accountDetails);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [pendingModalClose, setPendingModalClose] = useState(false);
  const [state, formAction] = useFormState(editTeller, null);

  console.log(state)

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

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generateRandomString(Math.floor(Math.random() * 6) + 5);
    setInputs((prevInputs: any) => ({
      ...prevInputs,
      password: newPassword,
    }));
  };

  const handleInputChange = useCallback((e: any) => {
    const { name, value } = e.target;
    setInputs((prevInputs: any) => ({
      ...prevInputs,
      [name]: value,
    }));
  }, []);

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
    }
  }, [state?.success]);

  useEffect(() => {
    setImagePreview(accountDetails.image);
  }, [accountDetails]);

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
          className="border-none w-full max-w-3xl mx-5 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <XIcon
            className="close-button absolute top-3 right-3 hover:scale-110 transition cursor-pointer"
            onClick={handleModalClose}
          />
          <CardHeader>
            <CardTitle>Edit Teller Account</CardTitle>
            <CardDescription>
              Edit the necessary details for the account. You can leave the
              inputs unchanged.
            </CardDescription>
          </CardHeader>
          <CardContent className="mx-auto">
            <div className="flex w-full flex-col sm:flex-row items-center gap-2">
              {/* ID */}
              <Input
                type="text"
                className="hidden"
                value={accountDetails._id}
                name="id"
                id="id"
              />
              <div className="relative w-full max-w-[150px] sm:max-w-[200px] max-h-[150px] sm:max-h-[200px] h-[100vh] overflow-hidden">
                <Label
                  htmlFor="uploadImage"
                  className={`absolute bg-white z-10 space-y-1 group w-full h-[150px] sm:h-[200px] flex items-center justify-center flex-col border-2 cursor-pointer border-black/50 rounded ${imagePreview ? "border-solid" : "border-dashed"}`}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                      />
                      <Input
                        type="string"
                        id="imageBase64"
                        name="imageBase64"
                        className="hidden"
                        value={imagePreview}
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
                </Label>
                <Input
                  type="file"
                  id="uploadImage"
                  name="uploadImage"
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="w-full mx-5 space-y-2">
                <div className="w-full flex sm:flex-row flex-col gap-2">
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
                      type="text"
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
                      value={formatInputDate(inputs.birthdate)}
                      onChange={handleInputChange}
                      className="!block"
                    />
                  </div>
                </div>
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
            </div>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
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
        <p>Save</p>
      )}
    </Button>
  );
};
