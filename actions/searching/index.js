const UserModel = require('../../dbModels/userModel')
const commonError = require('../../helpers').commonError

const searching = (app) => {
  app.post('/usersSearch', (req, res) => {
    if (!req.body.user) return false;

    if (req.body.user.length > 30) return res.send({message: 'Слишком длинное имя', error: true})

    UserModel.find({name: req.body.user}, (e, users) => {
      if (e) res.send({message: commonError, error: true})

      const usersList = []

      if (users.length) {
        users.forEach(user => {
          usersList.push({
            name: user.name,
            id: user._id
          })
        })
      }

      res.send({usersList})
    })
  })
}

module.exports = searching