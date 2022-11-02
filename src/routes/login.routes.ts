import { Router } from "express";
import { loginControllers } from "../controllers/user.controllers";

const loginRoutes = Router();

loginRoutes.post("", loginControllers);

export default loginRoutes;
