const port = process.env.PORT || 5000
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const dbUser = require('./config').dbUser
const mongoose = require('mongoose')
const db = mongoose.connection

const user = require('./actions/user/auth')

mongoose.connect(dbUser, { useNewUrlParser: true })
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization')

  user.checkToken(app)
  next()
})

user.registration(app)
user.authorization(app)
user.logout(app)


app.listen(port, err => console.log(err ? `error: ${err}` : `Listening on port: ${port}`) )

