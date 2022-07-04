import { Router } from "express";
import {SignIn, SignUp} from "../controllers/authController.js"
import {validateRegister, validateLogin } from "../middlewares/signSchemaValidateMiddleware.js"

const router = Router();

router.post("/register", validateRegister, SignUp);
router.post("/login", validateLogin, SignIn )

export default router