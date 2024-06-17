"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <div className="w-full pb-5">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[40%,55%]">
        <div>
          <img
            src="https://th.bing.com/th/id/OIP.tw-cH024cHORVIVEMH1iGwHaE8?w=6000&h=4000&rs=1&pid=ImgDetMain"
            width={600}
            height={400}
            alt="Boat"
            className="w-full rounded-lg object-cover"
          />
          <div className="mt-4 grid grid-cols-3 gap-4">
            <img
              src="https://th.bing.com/th/id/OIP.tw-cH024cHORVIVEMH1iGwHaE8?w=6000&h=4000&rs=1&pid=ImgDetMain"
              width={150}
              height={100}
              alt="Additional Image"
              className="h-24 w-full rounded-lg object-cover"
            />
            <img
              src="https://th.bing.com/th/id/OIP.tw-cH024cHORVIVEMH1iGwHaE8?w=6000&h=4000&rs=1&pid=ImgDetMain"
              width={150}
              height={100}
              alt="Additional Image"
              className="h-24 w-full rounded-lg object-cover"
            />
            <img
              src="https://th.bing.com/th/id/OIP.tw-cH024cHORVIVEMH1iGwHaE8?w=6000&h=4000&rs=1&pid=ImgDetMain"
              width={150}
              height={100}
              alt="Additional Image"
              className="h-24 w-full rounded-lg object-cover"
            />
          </div>
        </div>
        <div>
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="mb-4 text-3xl font-bold">Owner Details</h3>
              <div>
                <Label className="pb-0.5 px-0.5" htmlFor="name">Owner Name</Label>
                <Input id="name" placeholder="Enter owner name" />
              </div>
              <div>
                <Label className="pb-0.5 px-0.5" htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <div>
                <Label className="pb-0.5 px-0.5" htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label className="pb-0.5 px-0.5" htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter owner's address" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="mb-4 text-3xl font-bold">Boat Details</h3>
              <div>
                <Label className="pb-0.5 px-0.5" htmlFor="make">Boat Make</Label>
                <Input id="make" placeholder="Enter boat make" />
              </div>
              <div>
                <Label className="pb-0.5 px-0.5" htmlFor="model">Boat Model</Label>
                <Input id="model" placeholder="Enter boat model" />
              </div>
              <div>
                <Label className="pb-0.5 px-0.5" htmlFor="registration">Registration Number</Label>
                <Input
                  id="registration"
                  placeholder="Enter registration number"
                />
              </div>
              <div>
                <Label className="pb-0.5 px-0.5" htmlFor="notes">Additional Notes</Label>
                <Textarea id="notes" placeholder="Enter any additional notes" />
              </div>
            </div>
            <div>
              <Button type="submit" className="w-full">
                Add Boat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
