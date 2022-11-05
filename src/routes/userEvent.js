const Controller = require('../contorllers/userEvent')
const { Auth, Validate } = require('../middlewares')
const { userEventCreate, userEventUpdate } = require('../validations/userEvent')

module.exports = (app) => {
  app.get('/api/user-event/list/:id', Controller.getUserEvetList)

  app.post(
    '/api/user-event/create',
    Validate(userEventCreate.schema, userEventCreate.property),
    Controller.userEventCreate
  )

  // Auth
  app.put(
    '/api/user-event/update',
    Auth,
    Validate(userEventUpdate.schema, userEventUpdate.property),
    Controller.userEventUpdate
  )
}
