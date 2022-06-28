import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import joi from "joi";
import Joi from "joi";

dotenv.config();

const server = express();
server.use([cors(), express.json()]);

const client = new MongoClient(process.env.MONGO_URI);
let db;

client.connect().then(() => {
  db = client.db("walletdb");
});

server.post("/register", async (req, res) => {
  const RegisterData = req.body;

  const RegisterSchema = joi.object().keys({
    name: Joi.string()
      .pattern(/^[a-z]+$/i)
      .required(),
    email: Joi.string()
      .pattern(/^[a-z0-9.!#]{4,30}@[a-z0-9]{3,15}(.[a-z]{1,5}){1,5}$/)
      .required(),
    password: Joi.string().required(),
  });

  const ResultValidate = RegisterSchema.validate(RegisterData);
  if (ResultValidate.error) {
    return res.sendStatus(422);
  }

  try {
    //Verifica na coleção a existência de algum email ou nome igual ao body da requisição
    const user = await db
      .collection("users")
      .findOne({
        $or: [{ email: RegisterData.email }, { name: RegisterData.name }],
      });

    if (user) {
      return res.status(409).send("Usuário já registrado");
    }

    await db.collection("users").insertOne(RegisterData);
    res.status(201).send("Usuário Registrado");
  } catch (error) {
    return res.sendStatus(500);
  }
});

server.post("/login", async (req, res) => {
    const LoginData = req.body
    const LoginSchema = joi.object().keys({
        email: Joi.string()
         .pattern(/^[a-z0-9.!#]{4,30}@[a-z0-9]{3,15}(.[a-z]{1,5}){1,5}$/)
         .required(),
        password: Joi.string().required()
    })
    const ResultValidate = LoginSchema.validate(LoginData)
    if(ResultValidate.error){
        return res.sendStatus(422)
    }

    try {
        const user = await db.collection("users").findOne({email:LoginData.email})
        if(!user){
            return res.sendStatus(400)
        }

        if(LoginData.password !== user.password){
            return res.sendStatus(400)
        }

        const token = jwt.sign({id: user._id},'secret')
        res.status(200).send({...LoginData, id:user._id, token})

    } catch (error) {
        
    }
})


server.listen(5000);
