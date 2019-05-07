const port = process.env.PORT || 5000
const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const fs = require('fs')
const mongoose = require('mongoose')
const { dbUser, siteName } = require('./config')
const user = require('./actions/user/auth')
const findUser = require('./actions/user/findUser')
const userSettings = require('./actions/user/settings')

const app = express()

mongoose.connect(dbUser, { useNewUrlParser: true })
mongoose.connection.on('error', e => { console.log(`MongoDB connection error: ${e}`) })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('static'))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', siteName)
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization')
  user.checkToken(app)
  next()
})

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/client/public/`)
})

user.registration(app)
user.confirmUser(app)
user.authorization(app)
user.logout(app)

findUser(app)
userSettings(app)

app.listen(port, err => { console.log(err ? `Error: ${err}` : `Listening on port: ${port}`) })

process.on('SIGINT', () => {
  mongoose.connection.close()
  process.exit()
})

