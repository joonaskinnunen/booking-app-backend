const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    dates: {
      type: Array,
    }
  })
  
  bookingSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
  module.exports = mongoose.model('booking', bookingSchema, "data")