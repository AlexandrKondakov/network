const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema({
  fromId: String,
  toId: String,
  date: String,
  message: String
})

module.exports = mongoose.model('messages', messageSchema)