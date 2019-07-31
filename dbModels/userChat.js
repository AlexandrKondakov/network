const mongoose = require('mongoose')
const { Schema } = mongoose

const userChatSchema = new Schema({
  userId: String,
  partnerId: String,
  chatId: String
})

module.exports = mongoose.model('user_chat', userChatSchema)