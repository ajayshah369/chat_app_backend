import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export type AppResponseType = {
  statusCode: StatusCodes;
  message?: string;
  data?: any;
  error?: Error;
};

const appResponse = (res: Response, responseData: AppResponseType) => {
  return res.status(responseData.statusCode).json({
    status: responseData.error ? "error" : "success",
    message: responseData.message,
    data: responseData.data,
    error: responseData.error,
  });
};

export default appResponse;
