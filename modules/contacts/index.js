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

exports.get = async idList => {
  if (!idList.length) return []

  const contactList = []

  for (let i = 0, len = idList.length; i < len; i++) {
    await UserModel.findById(idList[i], (err, user) => {
      if (err || !user) { return }

      contactList.push({
        id: user._id,
        name: user.name,
        avatarLink: user.avatarLink
      })
    })
  }
  return contactList
}

exports.remove = (req, res) => {

}
