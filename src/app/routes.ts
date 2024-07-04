import { Router } from "express";

import authRoutes from "./users/authRoutes";
import userRoutes from "./users/routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

export default router;
