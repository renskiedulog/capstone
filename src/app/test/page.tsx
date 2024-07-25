"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

const ImageUpload = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full bg-black/10">
      <div className="flex w-full flex-col md:flex-row items-center gap-2">
        <div className="relative w-full max-w-[150px] md:max-w-[200px] max-h-[150px] md:max-h-[200px] h-[100vh] overflow-hidden">
          <Label
            htmlFor="uploadImage"
            className={`absolute bg-white z-10 space-y-1 group w-full h-[150px] md:h-[200px] flex items-center justify-center flex-col border-2 cursor-pointer border-black/50 rounded ${imagePreview ? "border-solid" : "border-dashed"}`}
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
        <div className="w-full mx-5">
          <div className="w-full flex md:flex-row flex-col gap-2">
            <div className="flex-1">
              <Label htmlFor="username">Name</Label>
              <Input
                id="username"
                name="username"
                required
                type="text"
                placeholder="Enter your username"
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
          <div className="flex flex-col md:flex-row gap-2">
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
              <Input id="birthdate" name="birthdate" required type="date" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
