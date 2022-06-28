import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import Joi from "joi";
import dayjs from "dayjs"


dotenv.config();

const server = express();
server.use([cors(), express.json()]);

const client = new MongoClient(process.env.MONGO_URI);
let db;

client.connect().then(() => {
  db = client.db("walletdb");
});

let date = `${dayjs().$D}/${dayjs().$M+1}`

server.post("/register", async (req, res) => {
  const RegisterData = req.body;

  const RegisterSchema = Joi.object().keys({
    name: Joi.string()
      .pattern(/^[a-z]+$/i)
      .required(),
    email: Joi.string()
      .pattern(/^[a-z0-9.!#]{4,30}@[a-z0-9]{3,15}(.[a-z]{1,5}){1,5}$/)
      .required(),
    password: Joi.string().alphanum().required(),
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
    const LoginSchema = Joi.object().keys({
        email: Joi.string()
         .pattern(/^[a-z0-9.!#]{4,30}@[a-z0-9]{3,15}(.[a-z]{1,5}){1,5}$/)
         .required(),
        password: Joi.string().alphanum().required()
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

server.get("/movements", async (req,res) => {
    const token = req.headers.authorization.replace("bearer ","")
    const {id} = jwt.verify(token,"secret")

    if(!token || !id){
        return res.sendStatus(400)
    }
   
    try {
        const UserMovements = await db.collection("movements").find({idMovement:id}).toArray()
        res.send(UserMovements)
    } catch (error) {
        res.sendStatus(500)
    }
})

server.post("/entry", async (req, res) => {
    const EntryData = req.body
    
    const token = req.headers.authorization.replace("bearer ","")
    const {id} = jwt.verify(token,"secret")

    if(!token || !id){
        return res.sendStatus(400)
    }

    const EntryValidate = Joi.object().keys({
        value:Joi.number().integer().required(),
        description:Joi.string().required()
    })

    const ResultValidate = EntryValidate.validate(EntryData)
    if(ResultValidate.error){
        return res.sendStatus(422)
    }

    try {
        await db.collection("movements").insertOne({
            ...EntryData, date, type:"entry", idMovement:id 
        })
    } catch (error) {
       return res.sendStatus(500)
    }
   
    res.sendStatus(201)
     
})

server.post("/exit", async (req, res) => {
    const ExitData = req.body
    
    const token = req.headers.authorization.replace("bearer ","")
    const {id} = jwt.verify(token,"secret")

    if(!token || !id){
        return res.sendStatus(400)
    }

    const ExitValidate = Joi.object().keys({
        value:Joi.number().integer().required(),
        description:Joi.string().required()
    })

    const ResultValidate = ExitValidate.validate(ExitData)
    if(ResultValidate.error){
        return res.sendStatus(422)
    }

    try {
        await db.collection("movements").insertOne({
            ...ExitData, date, type:"exit", idMovement:id 
        })
    } catch (error) {
       return res.sendStatus(500)
    }
   
    res.send(201)
})


server.get("/balance", async (req, res) => {
    const token = req.headers.authorization.replace("bearer ","")
    const {id} = jwt.verify(token,"secret")

    if(!token || !id){
        return res.sendStatus(400)
    }

    try {
       const movementsUser = await db.collection("movements").find({idMovement:id}).toArray()
       let entrySum = 0;
       let exitSum = 0;
       let balance = 0;
       movementsUser.map(mov => {
        if(mov.type === "entry"){
            entrySum += Number(mov.value)
        } 
        if(mov.type === "exit"){
            exitSum += Number(mov.value)
        }
       })
         
       balance = entrySum - exitSum

       res.send({balance})

    } catch (error) {
        res.sendStatus(500)
    }



})


server.listen(5000);
