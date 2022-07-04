import jwt from "jsonwebtoken";
import { db } from "../database/mongodb.js";

async function SignUp(req, res) {
  const UserData = res.locals.userdata;
  await db.collection("users").insertOne(UserData);
  res.status(201).send("Usuário Registrado");
}

async function SignIn(req, res) {
  const user = res.locals.user;

  const token = jwt.sign({ id: user._id }, "secret");
  res.status(200).send({ ...user, token });
}

export { SignUp, SignIn };
