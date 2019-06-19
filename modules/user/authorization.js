const UserModel = require('../../dbModels/user')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const crypto = require('crypto')
const { jwtKey } = require('../../config')
const { fieldsForPassport, errorResponse, inputsValidate } = require('../../helpers')

passport.use('login', new LocalStrategy(fieldsForPassport,
  (req, email, pass, done) => {
    UserModel.findOne({ email }, (err, user) => {
    	if (err) return done(err)
			if (!user) return done(null, false, 'Email не найден')
			if (!user.isConfirmed) return done(null, false, 'Подтвердите регистрацию перейдя по ссылке с вашего email')
      if (user.hashPassword !== crypto.pbkdf2Sync(pass, user.salt, 1, 128, 'sha1').toString()) {
      	return done(null, false, 'Вы ввели не верный пароль')
      }

      return done(null, user)
    })
  })
)

const authorization = (req, res) => {
	const inputsError = inputsValidate([req.body.email, req.body.pass])

	if (inputsError) return errorResponse(res, inputsError)

	passport.authenticate('login', (err, user, status) => {
		if (err) return errorResponse(res)
		if (!user) return errorResponse(res, status)

		const token = jwt.sign({id: user._id, email: user.email}, jwtKey)

		res.send({
			userData: {
				name: user.name,
				id: user._id,
				avatarLink: user.avatarLink
			},
			token: `JWT ${token}`,
			isLoggedIn: true
		})
	})(req, res)
}

module.exports = authorization




