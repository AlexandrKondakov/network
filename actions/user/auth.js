const UserModel = require('../../dbModels/userModel')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const crypto = require('crypto')
const jwtKey = require('../../config').jwtKey
const siteName = require('../../config').clientUrl
const commonError = require('../../helpers').commonError
const emailRegExp = require('../../helpers').emailRegExp
const latinRegExp = require('../../helpers').latinRegExp
const sendEmail = require('../sendEmail')

const authText = 'Авторизуйтесь, или зарегистрируйтесь'
const userFields = {
  usernameField: 'email',
  passwordField: 'pass',
  passReqToCallback: true,
  session: false
}

const checkEmptyInputs = (inputs, res) => {
	return inputs.forEach(input => {
		if (!input) return res.send({message: 'Заполните все поля!', error: true})
		if (input.length > 30 )
			return res.send({message: 'Максимальное количество символов не больше 30', error: true})
	})
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
					sendEmail(email, `${siteName}/confirm/${newUser._id}`, `Регистрация на сайте ${siteName}`)
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
	app.post('/', (req, res) => {
		passport.authenticate('jwt', (err, user) => {
			if (err || !user) {
				return res.send({
					isLoggedIn: false,
					message: err ? commonError : authText,
					error: !!err
				})
			}

			res.send({isLoggedIn: true, userData: {name: user.name, id: user._id}})
    })(req, res)
	})
}

exports.authorization = app => {
	app.post('/auth', (req, res) => {

		checkEmptyInputs([req.body.email, req.body.pass], res)

    passport.authenticate('login', (err, user, status) => {
      if (err) return res.send({message: commonError, error: true})

      if (!user) return res.send({message: status, error: true})

      const token = jwt.sign({id: user._id, email: user.email}, jwtKey)

      res.send({
      	userData: {
    			name: user.name,
    			id: user._id
    		},
    		token: `JWT ${token}`,
    		isLoggedIn: true,
    		message: authText
    	})
    })(req, res)
  })
}

exports.registration = app => {
	app.post('/register', (req, res) => {

		checkEmptyInputs([req.body.email, req.body.pass, req.body.name], res)

		if (!emailRegExp.test(req.body.email)) return res.send({message: 'Укажите корректный email', error: true})

		if (!latinRegExp.test(req.body.pass)) {
			return res.send({message: 'Пароль должен быть введен латинскими буквами', error: true})
		}

    passport.authenticate('register', (err, user, status) => {
      if (err) return res.send({message: commonError, error: true})

      if (user) return res.send({message: status, error: true})

			res.send({message: status})
    })(req, res)
  })
}

exports.confirmUser = app => {
	app.post('/confirm', (req, res) => {
		UserModel.findById(req.body.id, (err, user) => {
			if (err) return res.send({message: commonError, error: true})

			if (!user.isConfirmed) {
				user.isConfirmed = true
				user.save(err => err && console.log(err))
			}
		})
	})
}

exports.logout = app => {
	app.post('/logout', (req, res) => {
		UserModel.findById(req.body.id, (err) => {
	  	if (err) return res.send({message: commonError, error: true})

      res.send({isLoggedIn: false})
	  })
	})
}

