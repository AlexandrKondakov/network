module.exports = userData => {
	const
		mongoose = require('mongoose'),
		UserModel = require('../dbModels/userModel'),
		db = mongoose.connection

	mongoose.connect('mongodb://localhost:27017/user', { useNewUrlParser: true })

	db.on('error', console.error.bind(console, 'MongoDB connection error:'))

	const checkPass = realPass => 
		realPass == userData.pass ? {status: true, reason: ''} : {status: false, reason: 'Вы ввели не верный пароль'}

	const checkLogin = async () => {
		let correctPass
		
		await UserModel.find({ login: userData.login }, (err, users) => {
			if(err) return console.error(err)
	
			correctPass = users.length ? users[0].pass : false
		})

		return correctPass
	}

	return checkLogin()
		.then(password => password ? checkPass(password) : {status: false, reason: 'Пользователь с таким именем не найден'} )
	
}