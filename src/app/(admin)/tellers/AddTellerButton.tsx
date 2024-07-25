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
import { useCallback, useState } from "react";
import { ImageIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddTellerModal() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputs, setInputs] = useState({ username: "", password: "" });

  const handleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRandomString = (length: any) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const handleGenerateCredentials = () => {
    const randomNumber = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
    const newUsername = `teller${randomNumber}`;
    const newPassword = generateRandomString(Math.floor(Math.random() * 6) + 5); // Generate a password between 5 and 10 characters
    console.log(newPassword, newUsername);
    setInputs((prevInputs) => ({
      ...prevInputs,
      username: newUsername,
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
    setInputs((prevInputs) => {
      const resetInputs: any = {};
      Object.keys(prevInputs).forEach((key) => {
        resetInputs[key] = "";
      });
      return resetInputs;
    });
  };

  return (
    <>
      <Button onClick={handleModal}>Add Teller</Button>
      {isModalOpen && (
        <section
          className="bg-black/50 w-full h-screen fixed top-0 left-0 z-50 flex items-center justify-center"
          onClick={handleModal}
        >
          <Card
            className="border-none w-full max-w-3xl mx-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <XIcon
              className="close-button absolute top-3 right-3 hover:scale-110 transition cursor-pointer"
              onClick={handleModal}
            />
            <CardHeader>
              <CardTitle>Add Teller Account</CardTitle>
              <CardDescription>
                Provide the necessary details for the account.
              </CardDescription>
            </CardHeader>
            <CardContent className="mx-auto">
              <div className="flex w-full flex-col sm:flex-row items-center gap-2">
                <div className="relative w-full max-w-[150px] sm:max-w-[200px] max-h-[150px] sm:max-h-[200px] h-[100vh] overflow-hidden">
                  <Label
                    htmlFor="uploadImage"
                    className={`absolute bg-white z-10 space-y-1 group w-full h-[150px] sm:h-[200px] flex items-center justify-center flex-col border-2 cursor-pointer border-black/50 rounded ${imagePreview ? "border-solid" : "border-dashed"}`}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                      />
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
                      <Label htmlFor="username">Name</Label>
                      <Input
                        id="username"
                        name="username"
                        required
                        type="text"
                        placeholder="Enter your username"
                        value={inputs?.username}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="password">
                        Password
                        <span className="w-max ml-auto">asd</span>
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        required
                        type="text"
                        placeholder="Enter your password"
                        value={inputs?.password}
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
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="address">Birth Date</Label>
                      <Input
                        id="birthdate"
                        name="birthdate"
                        required
                        type="date"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="!text-xs"
                  onClick={handleGenerateCredentials}
                >
                  Generate Username and Password
                </Button>
                <Button
                  variant="ghost"
                  className="!text-xs"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
              <Button>Create</Button>
            </CardFooter>
          </Card>
        </section>
      )}
    </>
  );
}
