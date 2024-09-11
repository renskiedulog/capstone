import { checkSession } from "@/components/utils/Authenticator";
import BoatTable from "./BoatTable";
import { redirect } from "next/navigation";
import { Boat } from "@/lib/types";

export const metadata = {
  title: "Boats",
};

const exampleBoats: Boat[] = [
  {
    _id: "1",
    registrationNumber: "ABC1234",
    ownerName: "John Doe",
    capacity: 50,
    status: "boarding",
    mainImage:
      "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg",
    registrationStatus: "registered",
    boatDetails: "A luxury yacht with all amenities for a comfortable journey.",
    images: [
      "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg",
      "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630",
      // "https://images.ctfassets.net/hrltx12pl8hq/01rJn4TormMsGQs1ZRIpzX/16a1cae2440420d0fd0a7a9a006f2dcb/Artboard_Copy_231.jpg?fit=fill&w=600&h=600",
      // "https://fps.cdnpk.net/images/home/subhome-ai.webp?w=649&h=649",
      // "https://i0.wp.com/picjumbo.com/wp-content/uploads/violet-colorful-sunset-sky-on-the-beach-free-photo.jpeg?w=600&quality=80",
      // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzJDx2rgz5O2J26_fzWpRxRIHyKbg_uOfsUQ&s",
      // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTK500IQ_2NpiNk7Ed_4phbWDtLSZ7QGWuNA&s",
      // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVNN58XFDLxdqtwwWRSE924NjtuSryXFGxjg&s",
    ],
    additionalInfo: "Equipped with the latest navigation technology.",
    boatCode: "XYZ7890",
    contactNumber: "+1234567890",
  },
];

const page = async () => {
  let session = await checkSession(); //! 1. Validate Session
  if (!session) return redirect("/login"); //! 2. Avoid Any Unauthenticated Access
  if (!session?.user?.isAdmin as boolean) redirect("/dashboard"); //! 3. Avoid Teller From Accessing Admin Page

  return <BoatTable initData={exampleBoats} />;
};

export default page;
