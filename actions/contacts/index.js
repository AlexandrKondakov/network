const UserModel = require('../../dbModels/userModel')
const { errorResponse, getUserId } = require('../../helpers')

exports.add = (req, res) => {
  if (!req.body.user) return false;

  UserModel.findById(getUserId(req), (error, user) => {
    if (error || !user) return errorResponse(res)

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

exports.remove = (req, res) => {}
