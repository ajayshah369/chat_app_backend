import { Request, Response, NextFunction } from "express";
import catchAsync from "../utilities/catchAsync";
import AppError from "../utilities/appError";
import { searchNewChatService } from "./services";

export const searchNewChat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;

    const data = await searchNewChatService(email);
  }
);
