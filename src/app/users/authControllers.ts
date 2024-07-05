import { Request, Response, NextFunction } from "express";
import catchAsync from "../utilities/catchAsync";

import { signupService, loginService, isLoggedInService } from "./authServices";
import { Cookie_Name } from "./schemas";
import AppError from "../utilities/appError";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await signupService(req.body, res);

    res.status(201).json({
      status: "success",
      message: "Successfully signed up!",
      data,
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await loginService(req.body, res);

    res.status(200).json({
      status: "success",
      message: "Successfully logged in!",
      data,
    });
  }
);

export const isLoggedIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cookie = req.signedCookies[Cookie_Name];

    if (!cookie) {
      return next(new AppError("You re not logged in!", 400));
    }

    const data = await isLoggedInService(cookie);

    req.user = data;

    next();
  }
);

export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie(Cookie_Name);

    res.status(200).json({
      status: "success",
      message: "Successfully logged out!",
    });
  }
);
