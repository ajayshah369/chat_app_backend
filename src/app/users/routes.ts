import { Router } from "express";
import * as controllers from "./controllers";
import { isLoggedIn } from "./authControllers";

const router = Router();

router.use(isLoggedIn);

router.get("/", controllers.getMe);

export default router;
