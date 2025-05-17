const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

const users = [
  { id: 1, name: 'Іван', age: 25 },
  { id: 2, name: 'Олена', age: 30 },
]

const articles = [
  { id: 1, title: 'Перша стаття', content: 'Контент першої статті' },
  { id: 2, title: 'Друга стаття', content: 'Контент другої статті' },
]

app.get('/users', (req, res) => {
  app.set('view engine', 'pug')
  app.set('views', path.join(__dirname, 'views', 'users'))

  res.render('index', { users })
})

app.get('/users/:userId', (req, res) => {
  app.set('view engine', 'pug')
  app.set('views', path.join(__dirname, 'views', 'users'))

  const user = users.find(u => u.id === +req.params.userId)
  if (!user) return res.status(404).send('Користувача не знайдено')

  res.render('user', { user })
})

app.get('/articles', (req, res) => {
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, 'views', 'articles'))
  res.render('index', { articles })
})

app.get('/articles/:articleId', (req, res) => {
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, 'views', 'articles'))
  const article = articles.find(a => a.id === +req.params.articleId)
  if (!article) return res.status(404).send('Статтю не знайдено')
  res.render('article', { article })
})

app.get('/', (req, res) => {
  res.send(`
    <h1>Головна сторінка</h1>
    <ul>
      <li><a href="/users">Користувачі (PUG)</a></li>
      <li><a href="/articles">Статті (EJS)</a></li>
    </ul>
  `)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
