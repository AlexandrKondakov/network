const UserModel = require('../../dbModels/user')
const { errorResponse, getUserId } = require('../../helpers')

const logout = (req, res) => {
  UserModel.findById(getUserId(req), err => {
    if (err) return errorResponse(res)

    res.send({isLoggedIn: false})
  })
}

module.exports = logout