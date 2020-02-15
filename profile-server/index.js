const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const axios = require('axios')

const cookieParser = require('cookie-parser')
const session = require('cookie-session')

const app = express()
const port = process.env.PORT || 5000

const API_URL = process.env.API_URL || 'http://localhost:1337'

/* MIDDLEWARES */
app.use(express.static(path.join(__dirname, 'profile-frontend/build')))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({name: 'jwt', keys: ['abc']}))
/* ROUTES */
app.get('/api/hi', (req, res) => {
  console.log("req.session.jwt", req.session.jwt)
  res.send({status: 'ok'})
})

app.post('/api/auth/local', async (req, res) => {
  console.log("POST: /api/auth/local")
  console.log("req.body", req.body)
  const loginRes = await axios({
    method: 'POST',
    url: `${API_URL}/auth/local`,
    data: req.body
  })

  console.log("loginRes.data", loginRes.data)
  const {jwt, user} = loginRes.data
  req.session.jwt = jwt
  console.log("req.session.jwt", req.session.jwt)
  const data = {user}
  res.send(data)
})

app.post('/api/auth/local/register', async (req, res) => {
  console.log("POST: /api/auth/local/register")

  const signupRes = await axios({
    method: 'POST',
    url: `${API_URL}/auth/local/register`,
    data: req.body
  })

  const {jwt, user} = signupRes.data
  req.session.jwt = jwt

  const data = {user}
  res.send(data)
})

app.put('/users/:userId', async (req, res) => {
  const jwtToken = req.session.jwt
  const data = req.body
  const {userId} = req.params

  console.log("PUT /users/:userId")
  console.log("jwtToken", jwtToken)
  console.log("data", data)
  console.log("userId", userId)

  const updateUserRes = await axios({
    method: 'PUT',
    url: `${API_URL}/users/${userId}`,
    data,
    headers: {
      Authorization: `Bearer ${jwtToken}`
    }
  })
})

app.get('/users/me', async (req, res) => {
  const {jwt} = req.session

  const meRes = await axios({
    method: 'GET',
    url: `${API_URL}/users/me`,
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  })
  res.send(meRes.data)
})


app.get('/users/logout', (req, res) => {
  req.session.jwt = null
  res.send({status: 200})
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/profile-frontend/build/index.html'))
})

/* FINISH SETUP */
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
