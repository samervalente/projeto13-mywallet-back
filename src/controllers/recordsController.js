import date from "../utils/getDate.js"
import {db, ObjectId} from "../database/mongodb.js"

async function postRecord(req, res) {
    const movement = req.body
    const id = res.locals.id
    
    try {
        await db.collection("records").insertOne({
            ...movement, date, type:movement.type, idMovement:id 
        })
    } catch (error) {
      
       return res.sendStatus(500)
    }
   
    res.sendStatus(201)
     
}

async function getRecords(req,res) {
    const id = res.locals.id
    try {
        const UserMovements = await db.collection("records").find({idMovement:id}).toArray()
        res.send(UserMovements)
    } catch (error) {
        res.sendStatus(500)
    }
}

async function getBalance (req, res) {
    const id = res.locals.id
    try {
       const movementsUser = await db.collection("records").find({idMovement:id}).toArray()
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
}

async function deleteRecord (req, res) {
        await db.collection("records").deleteOne({_id: ObjectId(req.params.id)})
        res.sendStatus(200)
        
}

async function editRecord(req, res)  {
    const record = req.body
    const id = res.locals.id
     
    try {
        await db.collection("records").updateOne({_id: ObjectId(req.params.id)},
        {$set: {...record, date, idMovement:id }}
      )
    } catch (error) {
       return res.sendStatus(500)
    }
   
    res.sendStatus(201)
}

export {postRecord, getRecords, getBalance, deleteRecord, editRecord}