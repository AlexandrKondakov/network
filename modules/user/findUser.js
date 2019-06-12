const UserModel = require('../../dbModels/user')
const { errorResponse, getUserId } = require('../../helpers')

const findUser = (req, res) => {
  if (!req.body.user) return false;

  if (req.body.user.length > 30) return errorResponse(res, 'Слишком длинное имя')

  UserModel.find({name: req.body.user}, (e, users) => {
    if (e) return errorResponse(res)

    const usersList = []

    if (!users.length) return res.send({usersList})

    for (let i = 0, len = users.length; i < len; i++) {
      if (users[i]._id.toString() === getUserId(req) || !users[i].isConfirmed) continue

      usersList.push({
        name: users[i].name,
        id: users[i]._id,
        avatarLink: users[i].avatarLink
      })

      if (i === 50) break
    }

    res.send({usersList})
  })
}

module.exports = findUser