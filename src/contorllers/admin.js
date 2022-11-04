const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const {
  Constants: { AdminStatus },
  DB: { Admin }
} = require('sdk-test')
const Constants = require('../constants')

const refreshToken = async (req, res) => {
  try {
    const { authorization } = req.headers
    const decoded = JWT.verify(authorization, Constants.SECRET_KEY)
    const { adminId, adminName } = decoded
    if (adminId || adminName) {
      const payload = { ...decoded }
      delete payload.iat
      delete payload.exp
      const token = JWT.sign(payload, Constants.SECRET_KEY, {
        expiresIn: Constants.TOKEN_EXPIRE
      })
      const refreshToken = JWT.sign(payload, Constants.SECRET_KEY, {
        expiresIn: Constants.REFRESH_TOKEN_EXPIRE
      })
      return res.status(200).json({
        statusCode: 200,
        data: {
          token,
          refreshToken
        }
      })
    }
    return res.status(401).json({ statusCode: 401, error: 'Unauthorized' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

const signUp = async (req, res) => {
  try {
    const { userName, password: rawPassword, firstName, lastName } = req.body
    const isDuplicate = await Admin.findOne({ userName })
    if (isDuplicate) {
      return res.status(400).json({ statusCode: 400, error: 'Bad Request', message: 'duplicate username' })
    }
    const password = bcrypt.hashSync(rawPassword, 10)
    const data = {
      userName,
      password,
      firstName,
      lastName
    }
    const admin = await Admin.create(data)
    if (admin) {
      return res.status(200).json({ statusCode: 200, data: { message: 'success' } })
    }
    return res.status(200).json({ statusCode: 200, data: { message: 'failed' } })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body
    const admin = await Admin.findOne({ userName })
    if (!admin) {
      return res.status(401).json({ statusCode: 401, error: 'Unauthorized', message: 'user not exists' })
    }
    const isMatch = bcrypt.compareSync(password, admin.password)
    if (!isMatch) {
      return res.status(401).json({ statusCode: 401, error: 'Unauthorized', message: 'invalid password' })
    }
    if (admin.status === AdminStatus.BANNED) {
      return res.status(401).json({ statusCode: 401, error: 'Unauthorized', message: 'user is banned' })
    }
    const payload = {
      adminId: admin._id,
      adminName: admin.userName,
      firstName: admin.firstName,
      lastName: admin.lastName,
      status: admin.status,
    }
    const token = JWT.sign(payload, Constants.SECRET_KEY, {
      expiresIn: Constants.TOKEN_EXPIRE
    })
    const refreshToken = JWT.sign(payload, Constants.SECRET_KEY, {
      expiresIn: Constants.REFRESH_TOKEN_EXPIRE
    })
    return res.status(200).json({
      statusCode: 200,
      data: {
        token,
        refreshToken
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

module.exports = {
    refreshToken,
    signUp,
    signIn,
  }
  