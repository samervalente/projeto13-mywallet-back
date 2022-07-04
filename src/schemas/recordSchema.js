import Joi from "joi"

const RecordSchema = Joi.object().keys({
    value:Joi.number().integer().required(),
    description:Joi.string().required(),
    type:Joi.string().required()
})

export default RecordSchema