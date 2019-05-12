const multer  = require('multer')
const fs = require('fs')
const crypto = require('crypto')
const UserModel = require('../../dbModels/userModel')
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
    if (err) return console.log(err)

    return !!user
  })
}

const setInputsError = async requestBody => {
  if (Object.keys(requestBody).length) {
    const inputsError = inputsValidate(Object.values(requestBody), false)

    if (inputsError) return {text: inputsError, type: 'common'}

    if (requestBody.pass && !latinRegExp.test(requestBody.pass)) {
      return {text: 'Пароль не должен содержать кириллицу', type: 'pass'}
    }

    if (requestBody.email) {
      if (!emailRegExp.test(requestBody.email)) return {text: 'Укажите корректный email', type: 'email'}

      const isUsed = await checkEmailUnique(requestBody.email)

      if (isUsed) return {text: 'Пользователь с таким email уже зарегистрирован', type: 'email'}
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
      req.inputError = inputsError
      return cb(null, false)
    }

    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      req.fileError = 'Допустимые форматы файла - jpg, png'
      return cb(null, false)
    }

    checkAndCreateDirectory(avatarPath, true)
    cb(null, true)
  }
}).single('ava')

const settings = (app) => {
  app.post('/api/settings', (req, res) => {

    const id = req.headers.referer.split(`${req.headers.origin}/`)[1]

    avatarPath = `./static/avatars/${id}`

    upload(req, res, err => {
      if (err) return res.send({message: 'Ошибка при загрузке изображения', error: {status: true, type: 'file'}})

      if (req.inputError) {
        return res.send({message: req.inputError.text, error: {status: true, type: req.inputError.type}})
      }

      if (req.fileError) return res.send({message: req.fileError, error: {status: true, type: 'file'}})

      let userChanges = avatarName ? true : Object.values(req.body).some(prop => !!prop)

      if (userChanges) {
        UserModel.findById(id, async (err, user) => {
          if (err || !user) return errorResponse(res)

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
            user.avatarLink = `${req.protocol}://${req.headers.host}/avatars/${id}/${avatarName}`
            userData.avatarLink = user.avatarLink
          }
          else {
            const inputError = await setInputsError(req.body)

            if (inputError) {
              return res.send({message: inputError.text, error: {status: true, type: inputError.type}})
            }
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
              fs.readdir(avatarPath, (err, files) => {
                if (err) return errorResponse(res)

                if (files.length > 1) removeOldAvatars(files)

                avatarName = ''

                res.send({message: 'Данные успешно обновлены', userData})
              })
            }

            if (avatarName) return checkOldAvatars()
            else res.send({message: 'Данные успешно обновлены', userData})
          })
        })
      }
      else errorResponse(res, 'Заполните данные')
    })
  })
}

module.exports = settings