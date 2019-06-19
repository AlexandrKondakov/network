const passport = require('passport')
const { errorResponse } = require('../../helpers')

const authentication = (req, res) => {
  passport.authenticate('jwt', (err, user) => {
    if (err) return errorResponse(res)
    if (!user) return res.send({isLoggedIn: false})

    res.send({
      isLoggedIn: true,
      userData: {
        name: user.name,
        id: user._id,
        avatarLink: user.avatarLink
      }
    })
  })(req, res)
}

module.exports = authentication

