module.exports = userData => {
	const
		mongoose = require('mongoose'),
		UserModel = require('../dbModels/userModel'),
		db = mongoose.connection
		
	mongoose.connect('mongodb://localhost:27017/user', { useNewUrlParser: true })

	db.on('error', console.error.bind(console, 'MongoDB connection error:'))

	const user = new UserModel({
		unique: true, 
	    login: userData.login,
		pass: userData.pass
	})

	const checkUserLogin = async () => {
		let loginIsUsing 

		await UserModel.find({ login: userData.login }, (err, users) => {
			if(err) return console.error(err)
	
			loginIsUsing = users.length ? true : false
		})

		return loginIsUsing
	}

	const saveNewUser = async () => {
		await user.save(err => {
		    mongoose.disconnect()  
		    console.log( err ? `Error: ${err}` : `save: ${user}` )
		})
	}

	return checkUserLogin()
		.then(loginIsUsing => loginIsUsing ? true : saveNewUser().then(() => false) )

}