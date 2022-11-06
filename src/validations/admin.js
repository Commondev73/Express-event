const Joi = require('joi')

const signIn = {
  property: 'body',
  schema: Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required()
  }).options({ allowUnknown: true })
}

const signUp = {
  property: 'body',
  schema: Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
    photo: Joi.string(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
  }).options({ allowUnknown: true })
}

module.exports = {
  signIn,
  signUp,
}
