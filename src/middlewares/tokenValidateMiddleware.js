import jwt from "jsonwebtoken"

export default async function ValidateToken(req, res, next){
    const token = req.headers.authorization.replace("bearer ","")
    const {id} = jwt.verify(token,"secret")

    if(!token || !id){
        return res.sendStatus(400)
    }
    res.locals.id = id
    
    next()
}