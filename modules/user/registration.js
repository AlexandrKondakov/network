const UserModel = require('../../dbModels/user')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const crypto = require('crypto')
const { siteName } = require('../../config')
const sendMail = require('../sendMail')
const {
  fieldsForPassport,
  emailRegExp,
  latinRegExp,
  errorResponse,
  inputsValidate,
} = require('../../helpers')

passport.use('register', new LocalStrategy(fieldsForPassport,
  (req, email, pass, done) => {
    const salt = crypto.randomBytes(128).toString('base64')

    const newUser = new UserModel({
      email,
      name: req.body.name,
      contacts: [],
      isConfirmed: false,
      hashPassword: crypto.pbkdf2Sync(pass, salt, 1, 128, 'sha1'),
      salt
    })

    UserModel.findOne({ email }, (err, user) => {
      if (err) return done(err)

      if (user) return done(null, true, 'Пользователь с таким email уже зарегистрирован')

      newUser.save()
        // .then(() =>
        //   sendMail(email, `${siteName}/confirm/${newUser._id}`, `Регистрация на сайте ${siteName}`)
        // )
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

const registration = (req, res) => {
  const inputsError = inputsValidate([req.body.email, req.body.pass, req.body.name])

  if (inputsError) return errorResponse(res, inputsError)

  if (!emailRegExp.test(req.body.email)) return errorResponse(res, 'Укажите корректный email')

  if (!latinRegExp.test(req.body.pass)) return errorResponse(res, 'Пароль содержит запрещенные символы')

  passport.authenticate('register', (err, user, status) => {
    if (err) return errorResponse(res)

    if (user) return errorResponse(res, status)

    res.send({message: status})
  })(req, res)
}

module.exports = registration