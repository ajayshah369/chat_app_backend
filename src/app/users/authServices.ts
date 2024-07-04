import jsonwebtoken, { Secret } from "jsonwebtoken";
import { Response } from "express";
import ms from "ms";
import { User } from "./models";
import { SignupSchema } from "./schemas";

const JWT_Secret: Secret | undefined = process.env.JWT_Secret;
const Session_Expires: string = process.env.Session_Expires ?? "1d";

if (!JWT_Secret) {
  throw new Error("JWT_Secret not provided in env variables!");
}

const generateJWT = (uuid: string): string => {
  const jwt = jsonwebtoken.sign({ uuid }, JWT_Secret, {
    expiresIn: Session_Expires,
  });

  return jwt;
};

const sendAuthCookie = (jwt: string, res: Response) => {
  res.cookie("chat.eziostech.com-auth", jwt, {
    expires: new Date(Date.now() + ms(Session_Expires)),
    httpOnly: true,
    secure: true,
    signed: true,
  });
};

export const signupService = async (payload: SignupSchema, res: Response) => {
  const user = await User.create(payload);

  const jsonUser = user.toJSON();
  delete jsonUser.password;

  sendAuthCookie(generateJWT(jsonUser.uuid), res);

  return jsonUser;
};
