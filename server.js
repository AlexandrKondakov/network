const port = process.env.PORT || 5000
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dbUser = require('./config').dbUser
const clientUrl = require('./config').clientUrl
const user = require('./actions/user/auth')

const app = express()
const db = mongoose.connection

mongoose.connect(dbUser, { useNewUrlParser: true })
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(express.static('client/public'))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', clientUrl)
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization')

  user.checkToken(app)
  next()
})

user.registration(app)
user.authorization(app)
user.logout(app)


app.listen(port, err => console.log(err ? `error: ${err}` : `Listening on port: ${port}`) )

