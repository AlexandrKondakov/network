const UserModel = require('../../dbModels/user')
const { errorResponse, getUserId } = require('../../helpers')

exports.add = (req, res) => {
  if (!req.body.user) { return }

  UserModel.findById(getUserId(req), (error, user) => {
    if (error || !user) return errorResponse(res)

    if (user.contacts.some(id => id === req.body.user)) {
      return errorResponse(res, 'Пользователь уже добавлен')
    }

    UserModel.findById(req.body.user, (err, userForContacts) => {
      if (err || !userForContacts) return errorResponse(res)

      user.contacts.push(req.body.user)
      user.save(e => { e
        ? errorResponse(res)
        : res.send({message: `Пользователь ${userForContacts.name} добавлен в контакты`})})
    })
  })
}

exports.get = (req, res) => {
  UserModel.findById(getUserId(req), (error, user) => {
    if (error || !user) return errorResponse(res)

    const contacts = []

    for (let i = 0, len = user.contacts.length; i < len; i++) {
      UserModel.findById(user.contacts[i], (err, userFromContacts) => {
        if (err) return errorResponse(res)

        contacts.push({name: userFromContacts.name, avatarLink: userFromContacts.avatarLink})
        if (i === len - 1) res.send({contacts})
      })
    }
  })
}

exports.remove = (req, res) => {

}
