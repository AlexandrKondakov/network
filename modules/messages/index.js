const MessageModel = require('../../dbModels/message')
const passport = require('passport')
const { errorResponse } = require('../../helpers')

exports.send = (req, res) => {
  if (!req.body.user || !req.body.message) { return }
  if (req.body.message.length > 300) return errorResponse(res,'Сообщение слишком длинное')

  passport.authenticate('jwt', (error, user) => {
    if (error || !user) return errorResponse(res)

    const newMessage = new MessageModel({
      fromId: user._id,
      toId: req.body.user,
      date: Date.now(),
      message: req.body.message
    })

    newMessage.save()
      .then(() => { res.send({message: 'Сообщение отправлено'}) })
      .catch(() => { errorResponse(res) })
  })(req, res)
}