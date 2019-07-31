const user = require('./modules/user')
const contacts = require('./modules/contacts')
const messages = require('./modules/messages')

const routes = app => {
  app.post('/api', (req, res) => { user.authentication(req, res) })

  app.post('/api/register', (req, res) => { user.registration(req, res) })

  app.post('/api/confirm', (req, res) => { user.confirm(req, res) })

  app.post('/api/auth', (req, res) => { user.authorization(req, res) })

  app.post('/api/findUser', (req, res) => { user.findUser(req, res) })

  app.post('/api/settings', (req, res) => { user.settings(req, res) })

  app.post('/api/addContact', (req, res) => { contacts.add(req, res) })

  app.post('/api/removeContact', (req, res) => { contacts.remove(req, res) })

  app.post('/api/getContacts', (req, res) => { contacts.get(req, res) })

  app.post('/api/getChats', (req, res) => { messages.getChats(req, res) })

  app.post('/api/getMessages', (req, res) => { messages.getMessages(req, res) })
}

module.exports = routes