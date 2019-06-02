const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
	name: String,
	email: String,
	avatarLink: String,
	hashPassword: String,
	salt: String,
	isConfirmed: Boolean,
	contacts: Array
})

module.exports = mongoose.model('user', userSchema)
