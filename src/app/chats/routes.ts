import { Router } from "express";
import { isLoggedIn } from "../users/authControllers";
import * as controller from "./controllers";

const router = Router();

router.use(isLoggedIn);

router.get("/searchNewChat/:email", controller.searchNewChat);

export default router;
