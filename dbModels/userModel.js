const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
	name: String,
	email: String,
	avatarLink: String,
	hashPassword: String,
	salt: String,
	isConfirmed: Boolean
})

module.exports = mongoose.model('user', userSchema)
