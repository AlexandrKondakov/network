const
	mongoose = require("mongoose"),
	dbSchema = mongoose.Schema

const userAuthSchema = new dbSchema({
    login: String,
	pass: String
})

module.exports = mongoose.model('user', userAuthSchema)
