const mongoose = require('mongoose')
const { generateSeat } = require('../utils')
const {
  Constants: { EventStatus },
  DB: { UserEvent, Event }
} = require('sdk-test')

const getUserEvetList = async (req, res) => {
  try {
    const eventId = req.params.id
    const { search, page = 1, limit = 20, sortBy, order } = req.query
    const query = {
      eventId: mongoose.Types.ObjectId(eventId)
    }
    if (search) {
      const reg = new RegExp(search, 'i')
      query['$or'] = [{ firstName: { $regex: reg } }, { lastName: { $regex: reg } }, { phone: { $regex: reg } }]
    }
    console.log('req.query', req.query)
    const userEventList = await UserEvent.getList(query, page, limit, { [sortBy]: order })
    return res.status(200).json({
      statusCode: 200,
      data: userEventList
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

const userEventCreate = async (req, res) => {
  try {
    const { firstName, lastName, phone, eventId } = req.body

    const query = {
      status: EventStatus.SHOW,
      _id: mongoose.Types.ObjectId(eventId)
    }
    const aggregate = [
      {
        $match: { ...query }
      },
      {
        $lookup: {
          from: 'userevents',
          localField: '_id',
          foreignField: 'eventId',
          as: 'user'
        }
      },
      { $addFields: { userCount: { $size: '$user' } } }
    ]
    const event = await Event.aggregate(aggregate)

    if (!event) {
      return res.status(400).json({ statusCode: 400, error: 'Bad Request', message: 'event not found' })
    }
    const limit = event[0].limit
    const userCount = event[0].userCount
    const checkLimit = limit - userCount > 0

    if (checkLimit) {
      const data = { firstName, lastName, phone, eventId }
      // set seat user
      data.seat = userCount + 1
      // check seat
      const seatAll = event[0].user.map((i) => i.seat)
      const checkSeat = seatAll.includes(data.seat.toString())
      // generateSeat if duplicate seat
      if (checkSeat) {
        data.seat = generateSeat(1, limit, seatAll)
      }
      const userEvent = await UserEvent.create(data)
      if (!userEvent) {
        return res.status(503).json({
          statusCode: 503,
          error: 'Service Unavailable',
          message: 'unavailable'
        })
      }

      return res.status(200).json({
        statusCode: 200,
        data: userEvent
      })
    }
    return res.status(400).json({ statusCode: 400, error: 'Bad Request', message: 'application is closed' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

const userEventUpdate = async (req, res) => {
  try {
    const { id, firstName, lastName, seat, phone } = req.body

    const getUserEvent = await UserEvent.findById(id)
    if (!getUserEvent) {
      return res.status(400).json({ statusCode: 400, error: 'Bad Request', message: 'data not found' })
    }
    const checkSeat = await UserEvent.findOne({ seat, eventId: getUserEvent.eventId })
    if (checkSeat && checkSeat.id !== getUserEvent.id) {
      return res.status(400).json({ statusCode: 400, error: 'Bad Request', message: 'duplicate seat' })
    }

    const data = { firstName, lastName, phone, seat }
    const updateUserEvent = await UserEvent.update(id, data)
    if (!updateUserEvent) {
      return res.status(503).json({
        statusCode: 503,
        error: 'Service Unavailable',
        message: 'unavailable'
      })
    }
    return res.status(200).json({
      statusCode: 200,
      data: updateUserEvent
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}
module.exports = {
  getUserEvetList,
  userEventCreate,
  userEventUpdate
}
