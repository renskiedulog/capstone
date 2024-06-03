type ProfileParams = {
  params: {
    username: string;
  };
};
//! Generate Page Title Based On Profile Username
export async function generateMetadata({ params }: ProfileParams) {
  return {
    title: params?.username,
  };
}

const page = async ({ params }: ProfileParams) => {
  // const session = await checkSession();
  return <div>{params?.username}</div>;
};

export default page;
