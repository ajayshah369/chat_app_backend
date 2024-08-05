import { Router } from "express";

import authRoutes from "./users/authRoutes";
import userRoutes from "./users/routes";
import chatRoutes from "./chats/routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/chats", chatRoutes);

export default router;
