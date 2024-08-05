import { getReasonPhrase, StatusCodes } from "http-status-codes";

class AppError extends Error {
  statusCode: StatusCodes;
  status: string;
  isOperational: boolean;
  errorMessage: string;

  constructor(message: string, statusCode: StatusCodes) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;
    this.errorMessage = this.message;
    this.status = getReasonPhrase(this.statusCode);

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
