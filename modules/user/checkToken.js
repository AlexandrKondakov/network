const UserModel = require('../../dbModels/user')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const { jwtKey } = require('../../config')
const { commonError } = require('../../helpers')
const contacts = require('../contacts')

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: jwtKey
  },
  (payload, done) => {
    UserModel.findById(payload.id, (err, user) => {
      if (err) return done(err)

      return done(null, user ? user : false)
    })
  }
))

const checkToken = (req, res) => {
  passport.authenticate('jwt', (err, user) => {
    if (err || !user) {
      return res.send({
        isLoggedIn: false,
        message: commonError,
        error: !!err
      })
    }

    contacts.get(user.contacts)
      .then(contacts => {
        res.send({
          isLoggedIn: true,
          userData: {
            name: user.name,
            id: user._id,
            avatarLink: user.avatarLink,
            contacts
          }
        })
      })
  })(req, res)
}

module.exports = checkToken