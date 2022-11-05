const Joi = require('joi')

const userEventCreate = {
  property: 'body',
  schema: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    eventId: Joi.string().required()
  })
}

const userEventUpdate = {
  property: 'body',
  schema: Joi.object({
    id: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    seat: Joi.string().required()
  })
}

module.exports = {
  userEventCreate,
  userEventUpdate
}
