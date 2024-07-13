export type SignupSchema = {
  email: string;
  name: string;
  password: string;
};

export type LoginSchema = {
  email: string;
  password: string;
};

export const Cookie_Name: string = "chat.eziostech.com-auth";
