import { Router } from "express";

import authRoutes from "./users/authRoutes";

const router = Router();

router.use("/auth", authRoutes);

export default router;
