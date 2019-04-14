const UserModel = require('../../dbModels/userModel')

const jwt = require('jsonwebtoken')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const crypto = require('crypto')
const jwtKey = require('../../config').jwtKey
const commonError = require('../../config').commonError

const userFields = {usernameField: 'login', passwordField: 'pass', session: false}
const authText = 'Авторизуйтесь, или зарегистрируйтесь'

const dbErrorAction = (err, action) => {
	if (err) {
		console.log(err)
		return action ? action(err, false, commonError) : commonError
	}
}

const checkEmptyInputs = (inputs, res) => {
	return inputs.forEach(input => {
		if (!input) return res.send({message: 'Заполните все поля!', error: true})
		if (input.length > 30 )
			return res.send({message: 'Максимальное количество символов не больше 30', error: true})
	})
}

passport.use('login', new LocalStrategy(userFields,
  (login, pass, done) => {
    UserModel.findOne({ login }, (err, user) => {
    	dbErrorAction(err, done)

			if (!user) return done(null, false, 'Пользователь с таким именем не найден')

      if (user.hashPassword !== crypto.pbkdf2Sync(pass, user.salt, 1, 128, 'sha1').toString()) {
      	return done(null, false, 'Вы ввели не верный пароль')
      }

      user.active = true
      user.save(err => err && console.log(err))

      return done(null, user)
    })
  })
)

passport.use('register', new LocalStrategy(userFields,
  (login, pass, done) => {

  	const saveNewUser = async () => {
			const salt = crypto.randomBytes(128).toString('base64')
			const newUser = new UserModel({
				unique: true, 
			  login: login,
				hashPassword: crypto.pbkdf2Sync(pass, salt, 1, 128, 'sha1'),
				salt: salt,
				active: false
			})

			await newUser.save(err => err && console.log(err))
		}

    UserModel.findOne({ login }, (err, user) => {
    	dbErrorAction(err, done)

			if (user) return done(null, true, 'Пользователь с таким именем уже зарегистрирован')

			saveNewUser()
				.then(() => done(null, false, `Вы зарегистрированы, как ${login}. Можете авторизоваться.`))
				.catch(e => done(e, false, commonError))
    })
  })
)

passport.use(new JwtStrategy({
		jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
	  secretOrKey: jwtKey
	}, 
  (payload, done) => {
	  UserModel.findById(payload.id, (err, user) => {
	  	dbErrorAction(err, done)

	    return done(null, user && user.active ? user : false)
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

			res.send({isLoggedIn: true, userData: {name: user.login, id: user._id}})
    })(req, res)
	})
}

exports.authorization = app => {
	app.post('/auth', (req, res) => {

		checkEmptyInputs([req.body.login, req.body.pass], res)

    passport.authenticate('login', (err, user, status) => {
      if (err || !user) return res.send({message: status, error: true})

      const token = jwt.sign({id: user._id, login: user.login}, jwtKey)
  
      res.send({
      	userData: {
    			name: user.login, 
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
		
		checkEmptyInputs([req.body.login, req.body.pass], res)

    passport.authenticate('register', (err, user, status) => {
      if (err || user) return res.send({message: status, error: true})

			res.send({message: status})
    })(req, res)
  })
}

exports.logout = app => {
	app.post('/logout', (req, res) => {
		UserModel.findById(req.body.id, (err, user) => {
	  	if (err) return res.send({message: dbErrorAction(err), error: true})
	 
	    user.active = false
      user.save(err => err && console.log(err))
      res.send({isLoggedIn: false})
	  })
	})
}