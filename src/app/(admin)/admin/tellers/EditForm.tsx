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
import { formatInputDate, generateRandomString, isEqual } from "@/lib/utils";
import { useFormState, useFormStatus } from "react-dom";
import { editTeller, isUsernameTaken } from "@/lib/api/tellerActions";
import { AccountDetailsTypes } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import socket from "@/socket";
import { addNewActivity } from "@/lib/api/activity";
import { signOut, useSession } from "next-auth/react";
import { logOutDB, revalidatePage } from "@/lib/api/common";
import { useRouter } from "next/navigation";

export default function EditForm({
  accountDetails,
  setIsOpen,
  isProfile = false,
}: {
  accountDetails: AccountDetailsTypes;
  setIsOpen: (state: boolean) => void;
  isProfile?: boolean;
}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [inputs, setInputs] = useState(accountDetails);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [pendingModalClose, setPendingModalClose] = useState(false);
  const [state, formAction] = useFormState(editTeller, null);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const session: any = useSession();
  const username = session?.data?.user?.username;
  const router = useRouter();

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
      setInputs((prev: AccountDetailsTypes) => ({
        ...prev,
        image: reader.result,
      }));
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

  function clearFileInput(fileInputId: string) {
    const fileInput = document.getElementById(
      fileInputId
    ) as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
      setInputs((prev) => ({ ...prev, image: "" }));
    }
  }

  const handleCheckUsername = async (inputUsername: string) => {
    if (inputUsername === accountDetails.username) {
      setError("");
      return;
    }
    const res = await isUsernameTaken(inputUsername);
    if (res) {
      setError("Username already taken.");
    } else if (!session?.data?.user?.isAdmin) {
      setError("Note: Changing your username will cause a forceful logout.");
    } else setError("");
  };

  const addActivity = async () => {
    if (session?.data?.user?.isAdmin) return;
    await addNewActivity({
      type: "teller",
      title: "Updated Teller Account",
      details: `Account with the username '${inputs.username}' has been updated.`,
      link: `/profile/${inputs?.username}`,
      actionBy: username,
    });
    socket.emit("newActivity");
  };

  useEffect(() => {
    if (state?.success) {
      if (
        accountDetails.username !== inputs.username &&
        isProfile &&
        !session?.data?.user?.isAdmin
      ) {
        addActivity();
        socket.emit("tellerRefresh", { info: "Refresh Teller Infos" });
        handleLogout();
        return;
      }
      setIsOpen(false);
      socket.emit("tellerRefresh", { info: "Refresh Teller Infos" });
      addActivity();
      toast({
        title: "Edited Successfully.",
        description: "If changes do not occur, refreshing the page might help.",
      });
      if (accountDetails.username !== inputs.username && isProfile)
        router.push(`/profile/${inputs.username}`);
    }
  }, [state?.success]);

  useEffect(() => {
    setImagePreview(accountDetails?.image);
  }, [accountDetails]);

  const handleLogout = async () => {
    await logOutDB(inputs.username);
    socket.emit("tellerRefresh");
    await signOut();
  };

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
          className="border-none w-full max-w-3xl mx-5 relative overflow-y-auto scrollbar max-h-[90dvh]"
          onClick={(e) => e.stopPropagation()}
        >
          <XIcon
            className="close-button absolute top-3 right-3 hover:scale-110 transition cursor-pointer"
            onClick={handleModalClose}
          />
          <CardHeader>
            <CardTitle className="text-lg sm:text-3xl">
              Edit Teller Account
            </CardTitle>
            <CardDescription className="text-xs sm:text-xl">
              Edit the necessary details for the account. You can leave the
              inputs unchanged.
            </CardDescription>
            {error !== "" && (
              <CardDescription className="text-red-500">
                {error}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="mx-auto">
            <div className="flex w-full flex-col sm:flex-row items-center gap-2 h-full">
              {/* ID */}
              <Input
                type="text"
                className="hidden"
                value={accountDetails._id}
                name="id"
                id="id"
                readOnly
              />
              <div className="relative w-full max-w-[150px] sm:max-w-[200px] sm:max-h-[200px] sm:h-[100vh]">
                <Label
                  htmlFor="uploadImage"
                  className={`bg-white z-10 space-y-1 group w-full h-[150px] sm:h-[200px] flex items-center justify-center flex-col border-2 cursor-pointer border-black/50 rounded ${imagePreview ? "border-solid" : "border-dashed"}`}
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
                        id="image"
                        name="image"
                        className="hidden"
                        value={imagePreview}
                        readOnly
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
                {imagePreview && (
                  <>
                    <Button
                      type="button"
                      className="w-full mt-1 hover:bg-primary/80 hover:text-white"
                      variant="outline"
                      onClick={() => {
                        setImagePreview(null);
                        clearFileInput("image");
                      }}
                    >
                      Remove
                    </Button>
                    <Input
                      type="string"
                      id="imageBase64"
                      name="imageBase64"
                      className="hidden"
                      value={imagePreview}
                      readOnly
                    />
                  </>
                )}
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
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    required
                    type="text"
                    placeholder="Enter permanent email"
                    value={inputs.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="w-full flex-1">
                    <Label htmlFor="contact">Contact Number</Label>
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
                    <Label htmlFor="birthdate">Birth Date</Label>
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
            <SubmitButton disabled={isEqual(inputs, accountDetails)} />
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
