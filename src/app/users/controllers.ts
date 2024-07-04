import { Request, Response, NextFunction } from "express";
import catchAsync from "../utilities/catchAsync";

export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      status: "success",
      data: req.user,
    });
  }
);
