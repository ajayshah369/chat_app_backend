import jsonwebtoken, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Response } from "express";
import ms from "ms";
import { StatusCodes } from "http-status-codes";
import AppError from "../utilities/appError";
import { User } from "./models";
import { SignupSchema, LoginSchema, Cookie_Name } from "./schemas";

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
  res.cookie(Cookie_Name, jwt, {
    expires: new Date(Date.now() + ms(Session_Expires)),
    httpOnly: true,
    secure: true,
    signed: true,
  });
};

const decodeJWT = (jwt: string): string => {
  const decoded = jsonwebtoken.verify(jwt, JWT_Secret, {
    complete: true,
  });

  if (!decoded) {
    throw new AppError("You are logged in!", StatusCodes.BAD_REQUEST);
  }

  if (typeof decoded.payload === "string") {
    throw new AppError("You are logged in!", StatusCodes.BAD_REQUEST);
  }

  if (decoded.payload.exp! > decoded.payload.iat! + ms(Session_Expires)) {
    throw new AppError("You are logged in!", StatusCodes.BAD_REQUEST);
  }

  return decoded.payload.uuid;
};

export const signupService = async (payload: SignupSchema, res: Response) => {
  const user = await User.create(payload);

  const jsonUser = user.toJSON();
  delete jsonUser.id;
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
    throw new AppError("Invalid email or password!", StatusCodes.BAD_REQUEST);
  }

  if (!(await bcrypt.compare(payload.password, user.dataValues.password))) {
    throw new AppError("Invalid email or password!", StatusCodes.BAD_REQUEST);
  }

  const jsonUser = user.toJSON();
  delete jsonUser.id;
  delete jsonUser.password;

  sendAuthCookie(generateJWT({ uuid: jsonUser.uuid }), res);

  return jsonUser;
};

export const isLoggedInService = async (cookie: string) => {
  const uuid = decodeJWT(cookie);

  if (!uuid) {
    throw new AppError("You are logged in!", StatusCodes.BAD_REQUEST);
  }

  const user = await User.findOne({
    attributes: { exclude: ["id", "password"] },
    where: {
      uuid,
    },
  });

  if (!user) {
    throw new AppError("You are not logged in!", StatusCodes.BAD_REQUEST);
  }

  const jsonUser = user.toJSON();

  return jsonUser;
};
