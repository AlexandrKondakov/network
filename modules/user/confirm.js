const UserModel = require('../../dbModels/user')
const { errorResponse } = require('../../helpers')

const confirmUser = (req, res) => {
  UserModel.findById(req.body.id, (err, user) => {
    if (err || !user) return errorResponse(res)

    if (!user.isConfirmed) {
      user.isConfirmed = true
      user.save(err => { if (err) return errorResponse(res) })
    }
  })
}

module.exports = confirmUser