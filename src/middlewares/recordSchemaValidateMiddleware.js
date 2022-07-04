 import RecordSchema from "../schemas/recordSchema.js"
 
 async function ValidateRecord(req, res, next){
    const movement = req.body
    const ResultValidate = RecordSchema.validate(movement)
    if(ResultValidate.error){
        return res.sendStatus(422)
    }
    next()
}

export default ValidateRecord
