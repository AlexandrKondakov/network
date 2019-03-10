const mongoose = require("mongoose")
const dbSchema = mongoose.Schema

const userAuthSchema = new dbSchema({
  login: String,
	hashPassword: String,
	salt: String
})

module.exports = mongoose.model('user', userAuthSchema)
