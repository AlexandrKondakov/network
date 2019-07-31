const UserModel = require('../../dbModels/user')
const passport = require('passport')
const { errorResponse } = require('../../helpers')

exports.add = (req, res) => {
  if (!req.body.user) { return }

  passport.authenticate('jwt', (error, user) => {
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
  })(req, res)
}

exports.get = (req, res) => {
  passport.authenticate('jwt', async (err, user) => {
    if (err || !user) return errorResponse(res)

    const contacts = []

    if (user.contacts.length) {
      for await (const contact of user.contacts) {
        await UserModel.findById(contact, (err, userFromContacts) => {
          if (err) return errorResponse(res)
          if (userFromContacts) {
            contacts.push({
              name: userFromContacts.name,
              avatarLink: userFromContacts.avatarLink,
              id: userFromContacts._id
            })
          }
        })
      }
    }
    res.send({contacts})
  })(req, res)
}

exports.remove = (req, res) => {
  if (!req.body.user) { return }

  passport.authenticate('jwt', (err, user) => {
    if (err || !user) return errorResponse(res)

    if (user.contacts.find(contact => contact === req.body.user)) {
      user.contacts.splice(user.contacts.indexOf(req.body.user), 1)
    }

    user.save(e => {e ? errorResponse(res) : res.send({message: `Пользователь удален из контактов`})})
  })(req, res)
}
