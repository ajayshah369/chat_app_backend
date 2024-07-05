import { Router } from "express";
import * as authControllers from "./authControllers";

const router = Router();

router.post("/signup", authControllers.signup);
router.post("/login", authControllers.login);
router.post("/logout", authControllers.logout);

export default router;
