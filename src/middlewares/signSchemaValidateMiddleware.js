import bcrypt from "bcrypt"
import { RegisterSchema, LoginSchema } from "../schemas/SignSchemas.js";
import {db} from "../database/mongodb.js"

async function validateRegister(req, res, next) {
  const RegisterData = req.body;

  const ResultValidate = RegisterSchema.validate(RegisterData);
  if (ResultValidate.error) {
    return res.sendStatus(422);
  }

  const user = await db.collection("users").findOne({
        $or: [{ email: RegisterData.email }, { name: RegisterData.name }],
      });

    if (user) {
      return res.status(409).send("Usuário já registrado");
    }

    const userPassword  = bcrypt.hashSync(RegisterData.password, 10)
    const userData = {...RegisterData, password:userPassword}
    res.locals.userdata = userData

  next();
}

async function validateLogin(req, res, next) {
  const LoginData = req.body;

  const ResultValidate = LoginSchema.validate(LoginData);
  if (ResultValidate.error) {
    return res.sendStatus(422);
  }

  const user = await db.collection("users").findOne({email:LoginData.email})
  if(!user){
      return res.sendStatus(400)
  }

  if(!bcrypt.compareSync(LoginData.password, user.password)){
      return res.sendStatus(401)
  }

  res.locals.user = user

  next();
}

export { validateRegister, validateLogin };
