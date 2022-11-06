const Controller = require('../contorllers/event')
const { Auth, Validate } = require('../middlewares')
const { eventCreate } = require('../validations/event')

module.exports = (app) => {
  app.get('/api/event/list', Controller.getEventList)

  app.get('/api/event/create-auto', Controller.eventCreateAuto)

  app.get('/api/event/:id', Controller.getEvent)
  //Auth
  app.post('/api/event/create', Auth, Validate(eventCreate.schema, eventCreate.property), Controller.eventCreate)
}
