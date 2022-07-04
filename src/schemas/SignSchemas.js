import Joi from "joi";

const RegisterSchema = Joi.object().keys({
  name: Joi.string()
    .pattern(/^[a-z ,.'-]+$/i)
    .required(),
  email: Joi.string()
    .pattern(/^[a-z0-9.!#]{4,30}@[a-z0-9]{3,15}(.[a-z]{1,5}){1,5}$/)
    .required(),
  password: Joi.string().alphanum().required(),
});

const LoginSchema = Joi.object().keys({
  email: Joi.string()
    .pattern(/^[a-z0-9.!#]{4,30}@[a-z0-9]{3,15}(.[a-z]{1,5}){1,5}$/)
    .required(),
  password: Joi.string().alphanum().required(),
});

export {RegisterSchema, LoginSchema};
