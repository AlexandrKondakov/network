const port = process.env.PORT || 5000
const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const mongoose = require('mongoose')
const { dbNetwork, siteName } = require('./config')
const user = require('./modules/user/auth')
const findUser = require('./modules/user/findUser')
const userSettings = require('./modules/user/settings')
const contacts = require('./modules/contacts')
const messages = require('./modules/messages')

const app = express()

mongoose.connect(dbNetwork, { useNewUrlParser: true })
mongoose.connection.on('error', e => { console.log(`MongoDB connection error: ${e}`) })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('static'))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', siteName)
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization')
  next()
})

app.post('/api', (req, res) => { user.checkToken(req, res) })

app.post('/api/register', (req, res) => { user.registration(req, res) })

app.post('/api/confirm', (req, res) => { user.confirmUser(req, res) })

app.post('/api/auth', (req, res) => { user.authorization(req, res) })

app.post('/api/logout', (req, res) => { user.logout(req, res) })

app.post('/api/findUser', (req, res) => { findUser(req, res) })

app.post('/api/settings', (req, res) => { userSettings(req, res) })

app.post('/api/addContact', (req, res) => { contacts.add(req, res) })

app.post('/api/removeContact', (req, res) => { contacts.remove(req, res) })

app.post('/api/getContacts', (req, res) => { contacts.get(req, res) })

app.post('/api/sendMessage', (req, res) => { messages.send(req, res) })


app.listen(port, err => { console.log(err ? `Error: ${err}` : `Listening on port: ${port}`) })

process.on('SIGINT', () => {
  mongoose.connection.close()
  process.exit()
})

