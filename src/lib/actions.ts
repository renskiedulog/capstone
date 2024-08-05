"use server";

export const createTeller = async (prevState: any, formData: FormData) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return {
    success: true,
    message: "Teller created successfully",
  };
};

export const editTeller = async (prevState: any, formData: FormData) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return {
    success: true,
    message: "Teller edited successfully",
  };
};
