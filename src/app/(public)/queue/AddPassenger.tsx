"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCallback, useState } from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Alert from "@/components/utils/Alert";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addPassenger } from "@/lib/api/passenger";
import socket from "@/socket";

export default function AddTellerModal({
  queueId,
  capacityIndicator,
}: {
  queueId: string;
  capacityIndicator?: string;
}) {
  const initialInputs = {
    firstName: "",
    lastName: "",
    age: "",
    gender: "male",
    phoneNumber: "",
    amountPaid: "",
    queueId,
  };

  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputs, setInputs] = useState(initialInputs);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [pendingModalClose, setPendingModalClose] = useState(false);
  const [error, setError] = useState("");

  const handleModal = () => {
    const excludedKeys = ["gender", "queueId"];
    const hasValues = Object.entries(inputs)
      .filter(([key]) => !excludedKeys.includes(key))
      .some(([, value]) => value.trim() !== "");
    if (isModalOpen && hasValues) {
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
      setInputs(initialInputs);
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

  const handleSubmit = async () => {
    if (!inputs.amountPaid) {
      setError("Paid amount is required.");
      return;
    }
    if (!inputs.age) {
      setError("Passenger age is required.");
      return;
    }
    setInputs(initialInputs);
    setIsModalOpen(false);
    setPendingModalClose(false);
    try {
      const sanitizedInputs = {
        ...inputs,
        firstName: inputs.firstName.trim() || "Anonymous",
        lastName: inputs.lastName.trim() || "Anonymous",
        phoneNumber: inputs.phoneNumber || "N/A",
      };
      const req = await addPassenger(sanitizedInputs, queueId);
      if (req) {
        toast({
          title: "Passenger Added Successfully.",
          description:
            "You can view the passengers by clicking on the Boat Info/List button.",
        });
        socket.emit("boardingRefresh");
      } else {
        toast({
          title: "Something went wrong. Try again.",
          description:
            "Refreshing the page and retrying the action might help.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      <Button
        onClick={handleModal}
        className="text-xs md:text-sm p-0 h-max px-2 md:px-4 py-1.5"
      >
        Add Passenger
      </Button>
      {isModalOpen && (
        <div
          className="bg-black/50 w-full h-screen fixed top-0 left-0 z-50 flex items-center justify-center"
          onClick={handleModal}
        >
          <Card
            className="border-none w-full max-w-3xl mx-5 relative max-h-[90dvh] overflow-y-auto scrollbar"
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
              {capacityIndicator === "red" && (
                <CardDescription className="text-red-500">
                  Note: This boat is almost at its maximum capacity.
                </CardDescription>
              )}
              {error !== "" && (
                <CardDescription className="text-red-500">
                  Error: {error}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="mx-auto">
              <div className="w-full space-y-4 mx-auto">
                {/* Name Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Enter first name"
                      value={inputs.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Enter last name"
                      value={inputs.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Age and Gender Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Enter age"
                      value={inputs.age}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      defaultValue="male"
                      name="gender"
                      onValueChange={(val) =>
                        setInputs((prev) => ({
                          ...prev,
                          gender: val,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Phone and Payment Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="text"
                      placeholder="Enter phone number"
                      value={inputs.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amountPaid">Amount Paid</Label>
                    <Input
                      id="amountPaid"
                      name="amountPaid"
                      required
                      type="number"
                      placeholder="Enter amount paid"
                      value={inputs.amountPaid}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end items-center">
              <Button
                type="submit"
                className="flex items-center gap-2"
                onClick={handleSubmit}
              >
                Add
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
