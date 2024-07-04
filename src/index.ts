import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const port: string | number | null = process.env.PORT ?? null;

if (!port) {
  throw new Error("Port not defined in env variables!");
}

app.listen(port, () => {
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
