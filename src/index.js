import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js"
import recordsRouter from "./routes/recordsRouter.js"
import ValidateToken from "./middlewares/tokenValidateMiddleware.js"


dotenv.config();
const server = express();
server.use([cors(), express.json()]);


server.use(authRouter)
server.use(ValidateToken, recordsRouter)


const PORT = process.env.PORT

server.listen(PORT);
