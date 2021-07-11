const bookingRouter = require('express').Router()
const Booking = require('../models/booking')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

bookingRouter.get('/', async (request, response) => {
  const notes = await Booking.find({}).populate('user')
  response.json(notes.map(note => note.toJSON()))
})

bookingRouter.post('/', async (request, response) => {
  const body = request.body

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const booking = new Booking({
    dates: body.dates,
    user: user._id
  })

  const savedBooking = await booking.save()
  user.bookings = user.bookings.concat(savedBooking._id)
  await user.save()
  response.json(savedBooking.toJSON())
})

bookingRouter.get('/:id', async (request, response) => {
  const booking = await Booking.findById(request.params.id)
  if (booking) {
    response.json(poll.toJSON())
  } else {
    response.status(404).end()
  }
})

bookingRouter.delete('/:id', async (req, res, next) => {
  const id = req.params.id
  try {
    const bookingToDelete = await Booking.findById(id)
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!bookingToDelete) {
      return res.status(400).json({ error: 'no poll found with the id ' + id })
    }
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'missing or invalid token' })
    } else if (bookingToDelete.user.toString() !== decodedToken.id) {
      return res.status(401).json({ error: `not authorized decodedToken: ${decodedToken}, polltodeleteuser: ${pollToDelete.user.id.toString()}` })
    } else {
      const deletedBooking = await Booking.findByIdAndRemove(id)
      res.json(deletedBooking.toJSON())
    }

  } catch (exception) {
    next(exception)
  }
})

module.exports = bookingRouter