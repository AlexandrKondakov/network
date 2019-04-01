const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  login: String,
	phone: String,
	email: String,
	hashPassword: String,
	salt: String,
	active: Boolean
})

module.exports = mongoose.model('user', userSchema)
