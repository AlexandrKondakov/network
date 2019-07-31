const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema({
  fromId: String,
  chatId: String,
  date: Number,
  text: String
})

module.exports = mongoose.model('messages', messageSchema)