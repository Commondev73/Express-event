const Controller = require('../contorllers/event')
const { Auth, Validate } = require('../middlewares')
const { eventCreate } = require('../validations/event')

module.exports = (app) => {
  app.get('/api/event/:id', Controller.getEvent)

  app.get('/api/event/create-auto', Controller.eventCreateAuto)
  //Auth
  app.post('/api/event/create', Auth, Validate(eventCreate.schema, eventCreate.property), Controller.eventCreate)
}
