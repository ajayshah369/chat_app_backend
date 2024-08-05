import { Response, Request } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import AppError from "./appError";
import appResponse, { AppResponseType } from "./appResponse";

export default (err: AppError | Error | any, req: Request, res: Response) => {
  const responseData: AppResponseType = {
    statusCode: err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
    message:
      err.errorMessage ??
      err.message ??
      getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
  };

  if (process.env.NODE_ENV !== "production") {
    responseData.error = {
      ...err,
    };
  }

  return appResponse(res, responseData);
};
