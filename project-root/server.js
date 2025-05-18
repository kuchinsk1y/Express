const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const app = express()
const PORT = 3000
const SECRET_KEY = 'your_jwt_secret_key'

app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(express.json())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.engine('ejs', require('ejs').__express)

const users = []

app.get('/ejs', (req, res) => {
  res.render('index.ejs', { theme: req.cookies.theme || 'default' })
})

app.get('/', (req, res) => {
  res.render('index.pug', { theme: req.cookies.theme || 'default' })
})

app.get('/set-theme/:theme', (req, res) => {
  const { theme } = req.params
  res.cookie('theme', theme, { maxAge: 900000 })
  res.send(`Theme set to ${theme}`)
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  const hashed = await bcrypt.hash(password, 10)
  users.push({ username, password: hashed })
  res.send('User registered')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = users.find(u => u.username === username)
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials')
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' })
  res.cookie('token', token, { httpOnly: true })
  res.send('Logged in')
})

function authMiddleware(req, res, next) {
  const token = req.cookies.token
  if (!token) return res.status(401).send('Access denied')
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).send('Invalid token')
  }
}

app.get('/profile', authMiddleware, (req, res) => {
  res.send(`Welcome ${req.user.username}`)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
