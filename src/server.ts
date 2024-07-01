import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const port: string | number = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
