const fs = require('fs')
const path = require('path')
const passport = require('passport')
const UserModel = require('./dbModels/user')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const { jwtKey } = require('./config')

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: jwtKey
  },
  (payload, done) => {
    UserModel.findById(payload.id, (err, user) => err ? done(err) : done(null, user ? user : false) )
  }
))

exports.emailRegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

exports.latinRegExp = /^[A-Za-z0-9]+$/

exports.errorResponse = (res, text = 'Ошибка сервера, повторите позднее') => { res.send({message: text, error: true}) }

exports.inputsValidate = (inputs, checkEmpty = true) => {
  let text = ''
  for (let i = 0, len = inputs.length; i < len; i++) {
    if (checkEmpty && !inputs[i]) {
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

exports.checkAndCreateDirectory = (targetDir, isRelativeToScript = false) => {
  const initDir = path.isAbsolute(targetDir) ? path.sep : ''
  const baseDir = isRelativeToScript ? __dirname : '.'

  return targetDir.split(path.sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir)

    try { fs.mkdirSync(curDir) }
    catch (err) {
      if (err.code === 'EEXIST') return curDir
      if (err.code === 'ENOENT') throw new Error(`EACCES: permission denied, mkdir ${parentDir}`)
    }

    return curDir
  }, initDir)
}

exports.fieldsForPassport = {usernameField: 'email', passwordField: 'pass', passReqToCallback: true, session: false}