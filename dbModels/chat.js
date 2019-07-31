const mongoose = require('mongoose')
const { Schema } = mongoose

const chatSchema = new Schema({
  lastMessageId: String
})

module.exports = mongoose.model('chat_rooms', chatSchema)