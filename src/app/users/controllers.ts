import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utilities/catchAsync";
import appResponse from "../utilities/appResponse";

export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    return appResponse(res, {
      statusCode: StatusCodes.OK,
      data: req.user,
    });
  }
);
