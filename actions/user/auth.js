const UserModel = require('../../dbModels/userModel')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const crypto = require('crypto')
const { jwtKey } = require('../../config')
const { siteName } = require('../../config')
const sendMail = require('../sendMail')
const {
	commonError,
	emailRegExp,
	latinRegExp,
	errorResponse
} = require('../../helpers')


const authText = 'Авторизуйтесь, или зарегистрируйтесь'
const userFields = {
  usernameField: 'email',
  passwordField: 'pass',
  passReqToCallback: true,
  session: false
}

const inputsValidate = inputs => {
	let text = ''
	for (let i = 0, len = inputs.length; i < len; i++) {
		if (!inputs[i]) {
			text = 'Заполните все поля!'
			break
		}
		if (inputs[i].length > 30 ) {
			text = 'Максимальное количество символов не больше 30'
			break
		}
	}
	return text
}

passport.use('login', new LocalStrategy(userFields,
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

passport.use('register', new LocalStrategy(userFields,
  (req, email, pass, done) => {
		const salt = crypto.randomBytes(128).toString('base64')

		const newUser = new UserModel({
			unique: true,
			email,
			name: req.body.name,
			isConfirmed: false,
			hashPassword: crypto.pbkdf2Sync(pass, salt, 1, 128, 'sha1'),
			salt: salt
		})

    UserModel.findOne({ email }, (err, user) => {
    	if (err) return done(err)

			if (user) return done(null, true, 'Пользователь с таким email уже зарегистрирован')

			newUser.save()
				.then(() =>
					sendMail(email, `${siteName}/confirm/${newUser._id}`, `Регистрация на сайте ${siteName}`)
				)
        .then(() =>
          done(null, false, `На ${email} отправлена ссылка для подтверждения регистрации, перейдите по ней.`)
        )
				.catch(e => {
          newUser.deleteOne()
          return done(e)
        })
    })
  })
)

passport.use(new JwtStrategy({
		jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
	  secretOrKey: jwtKey
	},
  (payload, done) => {
	  UserModel.findById(payload.id, (err, user) => {
	  	if (err) return done(err)

	    return done(null, user ? user : false)
	  })
	}
))

exports.checkToken = app => {
	app.post('/api', (req, res) => {
		passport.authenticate('jwt', (err, user) => {
			if (err || !user) {
				return res.send({
					isLoggedIn: false,
					message: err ? commonError : authText,
					error: !!err
				})
			}

			res.send({
				isLoggedIn: true,
				userData: {name: user.name, id: user._id, avatarLink: user.avatarLink}
			})
    })(req, res)
	})
}

exports.authorization = app => {
	app.post('/api/auth', (req, res) => {
		const checkInputs = inputsValidate([req.body.email, req.body.pass])

		if (checkInputs) return errorResponse(res, checkInputs)

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
    		isLoggedIn: true,
    		message: authText
    	})
    })(req, res)
  })
}

exports.registration = app => {
	app.post('/api/register', (req, res) => {
		const checkInputs = inputsValidate([req.body.email, req.body.pass, req.body.name])

		if (checkInputs) return errorResponse(res, checkInputs)

		if (!emailRegExp.test(req.body.email)) return errorResponse(res, 'Укажите корректный email')

		if (!latinRegExp.test(req.body.pass)) return errorResponse(res, 'Пароль не должен содержать кириллицу')

    passport.authenticate('register', (err, user, status) => {
      if (err) return errorResponse(res)

      if (user) return errorResponse(res, status)

			res.send({message: status})
    })(req, res)
  })
}

exports.confirmUser = app => {
	app.post('/api/confirm', (req, res) => {
		UserModel.findById(req.body.id, (err, user) => {
			if (err || !user) return errorResponse(res)

			if (!user.isConfirmed) {
				user.isConfirmed = true
				user.save(err => { if (err) return errorResponse(res) })
			}
		})
	})
}

exports.logout = app => {
	app.post('/api/logout', (req, res) => {
		UserModel.findById(req.body.id, (err) => {
	  	if (err) return errorResponse(res)

      res.send({isLoggedIn: false})
	  })
	})
}

