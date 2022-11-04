const Controller = require('../contorllers/admin')
const { Validate } = require('../middlewares')
const { signIn, signUp } = require('../validations/admin')

module.exports = (app) => {
  app.post('/api/auth/sign-in', Validate(signIn.schema, signIn.property), Controller.signIn)

  app.post('/api/auth/sign-up', Validate(signUp.schema, signUp.property), Controller.signUp)

  app.post('/api/auth/refresh-token', Controller.refreshToken)

  app.get('/api/auth/sign-up-auto', Controller.signUpAuto)
}
