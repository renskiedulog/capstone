import { checkSession } from "@/components/utils/Authenticator";
import BoatTable from "./BoatTable";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Boats",
};

const exampleBoats = [
  {
    registrationNumber: "ABC1234",
    ownerName: "John Doe",
    capacity: 50,
    status: "Loading",
    registrationStatus: "Registered",
    boatDetails: "A luxury yacht with all amenities for a comfortable journey.",
    images: [
      "https://example.com/images/boat1.jpg",
      "https://example.com/images/boat2.jpg",
      "https://example.com/images/boat3.jpg",
    ],
    additionalInfo: "Equipped with the latest navigation technology.",
    boatCode: "XYZ7890",
    contactNumber: "+1234567890",
  },
  {
    registrationNumber: "DEF5678",
    ownerName: "Jane Smith",
    capacity: 30,
    status: "Queueing",
    registrationStatus: "Pending",
    boatDetails: "A sleek speedboat ideal for quick trips.",
    images: [
      "https://example.com/images/boat4.jpg",
      "https://example.com/images/boat5.jpg",
    ],
    additionalInfo: "Recently refurbished.",
    boatCode: "LMN4567",
    contactNumber: "+0987654321",
  },
  {
    registrationNumber: "GHI9101",
    ownerName: "Alice Johnson",
    capacity: 20,
    status: "Standby",
    registrationStatus: "Unregistered",
    boatDetails: "A fishing boat with plenty of storage space.",
    images: [
      "https://example.com/images/boat6.jpg",
      "https://example.com/images/boat7.jpg",
      "https://example.com/images/boat8.jpg",
    ],
    additionalInfo: "Includes fishing gear.",
    boatCode: "OPQ1234",
    contactNumber: "+1122334455",
  },
  {
    registrationNumber: "JKL1121",
    ownerName: "Bob Brown",
    capacity: 60,
    status: "Loading",
    registrationStatus: "Registered",
    boatDetails: "A cruise ship with luxury cabins and dining areas.",
    images: [
      "https://example.com/images/boat9.jpg",
      "https://example.com/images/boat10.jpg",
    ],
    additionalInfo: "Ideal for longer voyages.",
    boatCode: "RST6789",
    contactNumber: "+2233445566",
  },
  {
    registrationNumber: "MNO3141",
    ownerName: "Carol White",
    capacity: 40,
    status: "Standby",
    registrationStatus: "Registered",
    boatDetails: "A modern sailboat with advanced sail management.",
    images: [
      "https://example.com/images/boat11.jpg",
      "https://example.com/images/boat12.jpg",
    ],
    additionalInfo: "Equipped with solar panels.",
    boatCode: "UVW1357",
    contactNumber: "+3344556677",
  },
  {
    registrationNumber: "PQR5161",
    ownerName: "David Green",
    capacity: 25,
    status: "Queueing",
    registrationStatus: "Pending",
    boatDetails: "A classic wooden boat with elegant design.",
    images: [
      "https://example.com/images/boat13.jpg",
      "https://example.com/images/boat14.jpg",
    ],
    additionalInfo: "Handcrafted with attention to detail.",
    boatCode: "XYZ2468",
    contactNumber: "+4455667788",
  },
  {
    registrationNumber: "STU7181",
    ownerName: "Eva Black",
    capacity: 35,
    status: "Standby",
    registrationStatus: "Unregistered",
    boatDetails: "A high-speed powerboat for thrilling rides.",
    images: [
      "https://example.com/images/boat15.jpg",
      "https://example.com/images/boat16.jpg",
    ],
    additionalInfo: "Perfect for water sports.",
    boatCode: "ABC9876",
    contactNumber: "+5566778899",
  },
  {
    registrationNumber: "VWX9202",
    ownerName: "Frank Martin",
    capacity: 70,
    status: "Loading",
    registrationStatus: "Registered",
    boatDetails: "A large ferry designed for passenger transport.",
    images: [
      "https://example.com/images/boat17.jpg",
      "https://example.com/images/boat18.jpg",
    ],
    additionalInfo: "Includes onboard amenities.",
    boatCode: "DEF5432",
    contactNumber: "+6677889900",
  },
  {
    registrationNumber: "YZA1234",
    ownerName: "Grace Wilson",
    capacity: 15,
    status: "Queueing",
    registrationStatus: "Pending",
    boatDetails: "A small recreational boat for family outings.",
    images: [
      "https://example.com/images/boat19.jpg",
      "https://example.com/images/boat20.jpg",
    ],
    additionalInfo: "Easy to maneuver and maintain.",
    boatCode: "GHI7890",
    contactNumber: "+7788990011",
  },
  {
    registrationNumber: "BCD2345",
    ownerName: "Henry Lee",
    capacity: 45,
    status: "Standby",
    registrationStatus: "Unregistered",
    boatDetails: "A spacious houseboat with living quarters.",
    images: [
      "https://example.com/images/boat21.jpg",
      "https://example.com/images/boat22.jpg",
    ],
    additionalInfo: "Ideal for extended stays on the water.",
    boatCode: "JKL3456",
    contactNumber: "+8899001122",
  },
  {
    registrationNumber: "EFG3456",
    ownerName: "Ivy Adams",
    capacity: 55,
    status: "Loading",
    registrationStatus: "Registered",
    boatDetails: "A comfortable catamaran for leisure sailing.",
    images: [
      "https://example.com/images/boat23.jpg",
      "https://example.com/images/boat24.jpg",
    ],
    additionalInfo: "Sturdy and reliable for ocean voyages.",
    boatCode: "MNO4567",
    contactNumber: "+9900112233",
  },
  {
    registrationNumber: "HIJ4567",
    ownerName: "Jack Scott",
    capacity: 10,
    status: "Standby",
    registrationStatus: "Registered",
    boatDetails: "A versatile dinghy for small trips.",
    images: [
      "https://example.com/images/boat25.jpg",
      "https://example.com/images/boat26.jpg",
    ],
    additionalInfo: "Suitable for lakes and calm waters.",
    boatCode: "PQR5678",
    contactNumber: "+1011121314",
  },
];

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (!session?.user?.isAdmin as boolean) redirect("/dashboard"); //! 3. Avoid Teller From Accessing Admin Page

  return <BoatTable initData={exampleBoats} />;
};

export default page;
