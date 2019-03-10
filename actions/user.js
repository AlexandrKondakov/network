const dbConfig = require('../db.js')
const mongoose = require('mongoose')
const UserModel = require('../dbModels/userModel')
const db = mongoose.connection

const jwt = require('jsonwebtoken')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const crypto = require('crypto')

const connectToMongoose = () => {
	mongoose.connect(dbConfig.url, { useNewUrlParser: true })
	db.on('error', console.error.bind(console, 'MongoDB connection error: '))
}

const checkLogin = async (userData, needPassword) => {
	let payload = false

	await UserModel.findOne({ login: userData.login }, (err, user) => {
		if (err) return console.error(err)
		if (user) payload = needPassword ? {pass: user.hashPassword, sault: user.salt} : true
	})
	
	if (!payload) mongoose.disconnect()  
	return payload
}
	
exports.authorization = userData => {
	connectToMongoose()

	const checkPass = cryptoData => 
		cryptoData.pass == crypto.pbkdf2Sync(userData.pass, cryptoData.sault, 1, 128, 'sha1') 
		? {status: true, reason: ''} 
		: {status: false, reason: 'Вы ввели не верный пароль'}

	return checkLogin(userData, true)
		.then(cryptoData => cryptoData ? checkPass(cryptoData) : {status: false, reason: 'Пользователь с таким именем не найден'} )
}

exports.registration = userData => {	
	connectToMongoose()

	const salt = crypto.randomBytes(128).toString('base64')

	const user = new UserModel({
		unique: true, 
	  login: userData.login,
		hashPassword: crypto.pbkdf2Sync(userData.pass, salt, 1, 128, 'sha1'),
		salt: salt
	})

	const saveNewUser = async () => {
		await user.save(err => {
	    mongoose.disconnect()  
	    console.log( err ? `Error: ${err}` : `save: ${user}` )
		})
	}

	return checkLogin(userData, false)
		.then(loginIsUsing => loginIsUsing ? true : saveNewUser().then(() => false) )
}