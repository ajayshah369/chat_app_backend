import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import catchAsync from "../utilities/catchAsync";
import { signupService, loginService, isLoggedInService } from "./authServices";
import { Cookie_Name } from "./schemas";
import AppError from "../utilities/appError";
import appResponse from "../utilities/appResponse";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await signupService(req.body, res);

    return appResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Successfully signed up!",
      data,
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await loginService(req.body, res);

    return appResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Successfully logged in!",
      data,
    });
  }
);

export const isLoggedIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cookie = req.signedCookies[Cookie_Name];

    if (!cookie) {
      return next(
        new AppError("You are not logged in!", StatusCodes.BAD_REQUEST)
      );
    }

    const data = await isLoggedInService(cookie);

    req.user = data;

    next();
  }
);

export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie(Cookie_Name);

    return appResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Successfully logged out!",
    });
  }
);
