import React from "react";

export async function generateMetadata({ params }: BoatProfileParams) {
  return {
    title: params?.boatCode,
  };
}

interface BoatProfileParams {
  params: {
    boatCode: string;
  };
}

const page = ({ params }: BoatProfileParams) => {
  return <div>{params.boatCode}</div>;
};

export default page;
