const port = process.env.PORT || 5000

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const passport = require('passport')

const registration = require('./actions/registration')
const authorization = require('./actions/authorization')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/', (req, res) => {
  res.send({ isLoggedIn: false })
})

app.post('/api/registr', (req, res) => {
	const checkAndSaveUser = async () => await registration({login: req.body.login, pass: req.body.pass})

	checkAndSaveUser()
		.then(loginIsUsing => 
			loginIsUsing ? 
			res.send({ userData: {message: 'Пользователь с таким именем уже зарегистрирован'}, error: true }) :
			res.send({ userData: {message: `Вы зарегистрированы, как ${req.body.login}. Можете авторизоваться.`} }) 
		)
})

app.post('/api/auth', (req, res) => {
	const checkLogAndPass = async () => await authorization({login: req.body.login, pass: req.body.pass})

	checkLogAndPass()
		.then(data => 
			data.status ? 
			res.send({ userData: {name: req.body.login}, isLoggedIn: true }) :
			res.send({ userData: {message: data.reason}, error: true })			
		)
})

app.listen(port, err => console.log(err ? `error: ${err}` : `Listening on port: ${port}`) )

