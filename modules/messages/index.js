const MessageModel = require('../../dbModels/message')
const { errorResponse, getUserId } = require('../../helpers')

exports.send = (req, res) => {
  if (!req.body.user && !req.body.message) { return }

  if (req.body.message.length > 300) return res.send({message: 'Сообщение слишком длинное', error: true})

  const newMessage = new MessageModel({
    fromId: getUserId(req),
    toId: req.body.user,
    date: Date.now(),
    message: req.body.message
  })

  newMessage.save()
    .then(() => { res.send({message: 'Сообщение отправлено'}) })
    .catch(e => { errorResponse(res) })
}