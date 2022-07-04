import {Router} from "express"
import {postRecord, getRecords, getBalance, deleteRecord, editRecord} from "../controllers/recordsController.js"
import validateRecord from "../middlewares/recordSchemaValidateMiddleware.js"

const router = Router()

router.get("/records", getRecords)
router.post("/record",validateRecord, postRecord)
router.delete("/record/:id", deleteRecord)
router.put("/record/:id",validateRecord, editRecord)
router.get("/balance", getBalance)

export default router