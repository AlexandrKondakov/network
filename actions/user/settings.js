const multer  = require('multer')
const UserModel = require('../../dbModels/userModel')
const { errorResponse } = require('../../helpers')
const { siteName } = require('../../config')

let id = '', format = ''

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, './static/avatars') },
  filename: (req, file, cb) => {
    id = req.headers.referer.split(`${req.headers.origin}/`)[1]
    format = `.${file.originalname.split('.')[1]}`
    cb(null, id + format)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 3000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      req.fileError = 'Допустимые форматы файла - jpg, png'
      return cb(null, false)
    }
    cb(null, true)
  }
}).single('ava')

const settings = (app) => {
  app.post('/api/settings', (req, res) => {
    upload(req, res, (err) => {
      if (err) return res.send({message: 'Ошибка при загрузке изображения', error: {status: true, type: 'file'}})

      if (req.fileError) return res.send({message: req.fileError, error: {status: true, type: 'file'}})

      UserModel.findById(id, (err, user) => {
        if (err || !user) return errorResponse(res)

        user.avatarLink = `${req.protocol}://${req.headers.host}/avatars/${id + format}`
        user.save(err => { if (err) return errorResponse(res) })

        res.send({message: 'Данные успешно обновлены'})
      })
    })
  })
}

module.exports = settings