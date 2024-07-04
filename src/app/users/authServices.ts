import jsonwebtoken, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Response } from "express";
import ms from "ms";
import AppError from "../utilities/appError";
import { User } from "./models";
import { SignupSchema, LoginSchema } from "./schemas";

const JWT_Secret: Secret | undefined = process.env.JWT_Secret;
const Session_Expires: string = process.env.Session_Expires ?? "1d";

if (!JWT_Secret) {
  throw new Error("JWT_Secret not provided in env variables!");
}

type JWT_payload = {
  uuid: string;
};

const generateJWT = (payload: JWT_payload): string => {
  const jwt = jsonwebtoken.sign(payload, JWT_Secret, {
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

  sendAuthCookie(generateJWT({ uuid: jsonUser.uuid }), res);

  return jsonUser;
};

export const loginService = async (payload: LoginSchema, res: Response) => {
  const user = await User.findOne({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password!", 400);
  }

  if (!(await bcrypt.compare(payload.password, user.dataValues.password))) {
    throw new AppError("Invalid email or password!", 400);
  }

  const jsonUser = user.toJSON();
  delete jsonUser.password;

  sendAuthCookie(generateJWT({ uuid: jsonUser.uuid }), res);

  return jsonUser;
};
