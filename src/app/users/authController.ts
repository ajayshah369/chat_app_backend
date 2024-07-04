import { Request, Response, NextFunction } from "express";
import catchAsync from "../utilities/catchAsync";

import { signupService } from "./authServices";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    const data = await signupService(req.body, res);

    res.status(201).json({
      status: "success",
      message: "Successfully signed up!",
      data,
    });
  }
);
