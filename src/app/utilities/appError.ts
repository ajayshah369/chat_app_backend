import { getReasonPhrase } from "http-status-codes";

class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  errorMessage: string;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;
    this.errorMessage = this.message;
    this.status = getReasonPhrase(this.statusCode);

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
