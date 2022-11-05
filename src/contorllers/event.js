const {
  Constants: { EventStatus },
  DB: { Event }
} = require('sdk-test')

const getEventList = async (req, res) => {
  try {
    const query = {
      status: EventStatus.SHOW
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
        },
        
      },{ $addFields: {user: {$size: "$user"}}}
    ]
    const event = await Event.aggregate(aggregate)
    return res.json({
      statusCode: 200,
      data: event
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

const getEvent = async (req, res) => {
  try {
    const eventId = req.params.id
    const event = await Event.findById(eventId)
    if (event) {
      if (event.status === EventStatus.SHOW) {
        return res.json({
          statusCode: 200,
          data: event
        })
      }
      return res.status(400).json({ statusCode: 400, error: 'Bad Request', message: 'status is not show' })
    }
    return res.status(400).json({ statusCode: 400, error: 'Bad Request', message: 'data not found' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

const eventCreate = async (req, res) => {
  try {
    const { adminId } = req.credentials
    const { name, startDate, endDate, status, limit } = req.body
    const data = {
      name,
      startDate,
      endDate,
      status,
      limit,
      adminId
    }
    const event = await Event.create(data)
    if (!event) {
      return res.status(503).json({
        statusCode: 503,
        error: 'Service Unavailable',
        message: 'unavailable'
      })
    }
    return res.json({
      statusCode: 200,
      data: event
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

const eventCreateAuto = async (req, res) => {
  try {
    const data = {
      name: 'test',
      status: EventStatus.SHOW,
      limit: 10
    }
    const event = await Event.create(data)
    if (!event) {
      return res.status(503).json({
        statusCode: 503,
        error: 'Service Unavailable',
        message: 'unavailable'
      })
    }
    return res.json({
      statusCode: 200,
      data: event
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}
module.exports = {
  getEventList,
  getEvent,
  eventCreate,
  eventCreateAuto
}
