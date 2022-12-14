const Joi = require('joi')

const eventCreate = {
  property: 'body',
  schema: Joi.object({
    name: Joi.string().required(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    limit: Joi.number().required()
  }).options({ allowUnknown: true })
}

module.exports = {
  eventCreate,
}
