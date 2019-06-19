const port = process.env.PORT || 5000
const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const mongoose = require('mongoose')
const setRoutes = require('./routes')
const { dbNetwork, siteName } = require('./config')

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

setRoutes(app)

app.listen(port, err => { console.log(err ? `Error: ${err}` : `Listening on port: ${port}`) })

process.on('SIGINT', () => {
  mongoose.connection.close()
  process.exit()
})

