import { Request, Response, NextFunction } from "express";
import catchAsync from "../utilities/catchAsync";
import { searchNewChatService } from "./services";
import appResponse from "../utilities/appResponse";
import { StatusCodes } from "http-status-codes";

export const searchNewChat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;

    const data = await searchNewChatService(email);

    return appResponse(res, {
      statusCode: StatusCodes.OK,
      data,
    });
  }
);
