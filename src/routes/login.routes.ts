import { Router } from "express";
import { loginControllers } from "../controllers/user.controllers";
import ActiveUserMiddlewares from "../middlewares/ActiveUser.middlewares";

const loginRoutes = Router();

loginRoutes.post("", ActiveUserMiddlewares, loginControllers);

export default loginRoutes;
