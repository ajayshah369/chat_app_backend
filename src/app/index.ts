import express, {
  Express,
  Request,
  Response,
  NextFunction,
  json,
} from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import globalErrorHandler from "./utilities/globalErrorHandler";
import routes from "./routes";

const app: Express = express();

let allowed_origins = [];
let cookieSecret: string;
try {
  allowed_origins = JSON.parse(process.env.allowed_origins ?? "[]");
} catch (err) {}

if (!process.env.Cookie_Secret) {
  throw new Error("Cookie Secret not found!");
} else {
  cookieSecret = process.env.Cookie_Secret;
}

app.use(
  cors({
    origin: allowed_origins,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(
  json({
    limit: "10kb",
  })
);
app.use(cookieParser(cookieSecret, {}));

app.use("/api/v1", routes);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "Not Found",
    message: "Page Not Found!",
  });
});

app.use(globalErrorHandler);

export default app;
