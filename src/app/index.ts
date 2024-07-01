import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";

import globalErrorHandler from "./utilities/globalErrorHandler";

const app: Express = express();

let allowed_origins = [];
try {
  allowed_origins = JSON.parse(process.env.allowed_origins ?? "[]");
} catch (err) {}

app.use(morgan("dev"));

app.use(
  cors({
    origin: allowed_origins,
    credentials: true,
  })
);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "Not Found",
    message: "Page Not Found!",
  });
});

app.use(globalErrorHandler);

export default app;
