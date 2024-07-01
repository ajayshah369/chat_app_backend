import { Response } from "express";
import { getReasonPhrase } from "http-status-codes";
import AppError from "./appError";

const sendErrorDev = (err: AppError | Error | any, res: Response) =>
  res.status(err.statusCode).json({
    ...err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorProd = (err: AppError | Error | any, res: Response) => {
  let message = err.message;
  if (err.code === 11000) {
    if (err.keyPattern) {
      const keys = Object.keys(err.keyPattern);
      message = `This ${keys[0]} is already exists`;
    }
  }
  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    status: err.status,
    message: message,
  });
};

export default (err: AppError | Error | any, res: Response) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  if (!err.status) {
    err.status = getReasonPhrase(err.statusCode);
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};
