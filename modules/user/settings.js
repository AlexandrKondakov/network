const multer  = require('multer')
const fs = require('fs')
const crypto = require('crypto')
const UserModel = require('../../dbModels/user')
const passport = require('passport')
const {
  errorResponse,
  inputsValidate,
  emailRegExp,
  latinRegExp,
  checkAndCreateDirectory
} = require('../../helpers')

let avatarPath = '', avatarName = ''

const checkEmailUnique = email => {
  return UserModel.findOne({ email }, (err, user) => {
    if (err) return true

    return !!user
  })
}

const setInputsError = async requestBody => {
  if (Object.keys(requestBody).length) {
    const inputsError = inputsValidate(Object.values(requestBody), false)

    if (inputsError) return inputsError

    if (requestBody.pass && !latinRegExp.test(requestBody.pass)) {
      return 'Пароль содержит запрещенные символы'
    }

    if (requestBody.email) {
      if (!emailRegExp.test(requestBody.email)) return 'Укажите корректный email'

      const isUsed = await checkEmailUnique(requestBody.email)

      if (isUsed) return 'Пользователь с таким email уже зарегистрирован'
    }

    return false
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, avatarPath) },
  filename: (req, file, cb) => {
    avatarName = `ava.${file.originalname.split('.')[1]}`
    cb(null, avatarName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 3000000 },
  fileFilter: async (req, file, cb) => {
    const inputsError = await setInputsError(req.body)

    if (inputsError) {
      req.error = inputsError
      return cb(null, false)
    }

    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      req.error = 'Допустимые форматы файла - jpg, png'
      return cb(null, false)
    }

    checkAndCreateDirectory(avatarPath, true)
    cb(null, true)
  }
}).single('ava')

const settings = (req, res) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user) return errorResponse(res)

    avatarPath = `./static/avatars/${user._id}`

    upload(req, res, async err => {
      if (err) return errorResponse(res, 'Ошибка при загрузке изображения')

      if (req.error) return errorResponse(res, req.error)

      let userChanges = avatarName ? true : Object.values(req.body).some(prop => !!prop)

      if (userChanges) {
        const userData = {name: req.body.name ? req.body.name : ''}

        const setUserPassAndSalt = (user, pass) => {
          user.salt = crypto.randomBytes(128).toString('base64')
          user.hashPassword = crypto.pbkdf2Sync(pass, user.salt, 1, 128, 'sha1')
        }

        const setPropsForDb = props => {
          for (let prop in props) {
            if (prop === 'pass') setUserPassAndSalt(user, props.pass)
            else user[prop] = props[prop]
          }
        }

        if (avatarName) {
          user.avatarLink = `${req.protocol}://${req.headers.host}/avatars/${user._id}/${avatarName}`
          userData.avatarLink = user.avatarLink
        }
        else {
          const inputError = await setInputsError(req.body)

          if (inputError) return errorResponse(res, inputError)
        }

        setPropsForDb(req.body)

        user.save(err => {
          if (err) return errorResponse(res)

          const removeOldAvatars = avatars => {
            avatars.forEach(avatar => {
              if (avatar !== avatarName) {
                fs.unlink(`${avatarPath}/${avatar}`, err => {
                  if (err) console.log(`Ошибка при удалении файлов: ${err}`)
                })
              }
            })
          }

          const checkOldAvatars = () => {
            fs.readdir(avatarPath, (e, files) => {
              if (e) return errorResponse(res)

              if (files.length > 1) removeOldAvatars(files)

              avatarName = ''

              res.send({message: 'Данные успешно обновлены', userData})
            })
          }

          if (avatarName) checkOldAvatars()
          else res.send({message: 'Данные успешно обновлены', userData})
        })
      }
      else errorResponse(res, 'Заполните данные')
    })
  })(req, res)
}

module.exports = settings