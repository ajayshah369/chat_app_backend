import { Request, Response, NextFunction } from "express";
import catchAsync from "../utilities/catchAsync";
import appResponse from "../utilities/appResponse";
import { StatusCodes } from "http-status-codes";

import { searchNewChatService, getOrCreateChatService } from "./services";

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

export const getOrCreateChat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userUuid } = req.params;

    const data = await getOrCreateChatService([req.user.uuid, userUuid]);

    return appResponse(res, {
      statusCode: StatusCodes.OK,
      data,
    });
  }
);
