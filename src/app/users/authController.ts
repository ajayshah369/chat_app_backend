import { Request, Response, NextFunction } from "express";
import catchAsync from "../utilities/catchAsync";

import { signupService, loginService } from "./authServices";

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
