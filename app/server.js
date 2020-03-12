const express = require('express')
const routes = require('./controllers/routes.js')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const path = require('path')
var fetch = require('node-fetch')

/**
 * Server
 * @Class
 */
class Server {
  constructor () {
    this.app = express()
    this.port = 3000
  }

  fecthArticle () {
    const article = fetch('http://localhost:3000/article/list/')
      .then(response => response.json())
      .then(data => {
        return data
      })
    return article
  }

  showArtice (id) {
    const article = fetch(`http://localhost:3000/article/show/${id}`)
      .then(response => response.json())
      .then(data => {
        return data
      })
    return article
  }
  /**
   * db connect
   * @return {Object} connect
   */
  dbConnect () {
    const host = 'mongodb://localhost:27017/checo'
    const connect = mongoose.createConnection(host)

    connect.on('error', (err) => {
      setTimeout(() => {
        console.log('[ERROR] api dbConnect() -> mongodb error')
        this.connect = this.dbConnect(host)
      }, 5000)

      console.error(`[ERROR] api dbConnect() -> ${err}`)
    })

    connect.on('disconnected', () => {
      setTimeout(() => {
        console.log('[DISCONNECTED] api dbConnect() -> mongodb disconnected')
        this.connect = this.dbConnect(host)
      }, 5000) 
    })

    process.on('SIGINT', () => {
      connect.close(() => {
        console.log('[API END PROCESS] api dbConnect() -> close mongodb connection ')
        process.exit(0)
      })
    })
    return connect
  }

  /**
   * middleware
   */
  middleware () {
    this.app.use('/public', express.static(path.join(__dirname, '../public')))
    this.app.engine('.hbs', exphbs({
      extname: '.hbs',
      defaultLayout: 'main', 
      layoutsDir: path.join(__dirname, '/views/layouts/'),
      partialsDir: path.join(__dirname, '/views/partials/')
    }))

    this.app.set('views', path.join(__dirname, '/views'))
    this.app.set('view engine', '.hbs')
    this.app.get('/home', async (_, res) => {
      const articles = await this.fecthArticle()
      res.render('home', {res: articles})
    })

    // this.app.get('/article-show', (_, res) => {
    //   res.render('show-article', {res: res})
    // })

    this.app.post(`/article-show/:id`, async (request, response) => {
      const id = request.params.id
      const article = await this.showArtice(id)
      response.render('show-article', {res: article})
    })

    this.app.use(bodyParser.urlencoded({ 'extended': true }))
    this.app.use(bodyParser.json())
  }

  /**
   * routes
   */
  routes () {
    // Users
    new routes.users.Create(this.app, this.connect)
    new routes.users.Show(this.app, this.connect)
    new routes.users.Update(this.app, this.connect)
    new routes.users.Delete(this.app, this.connect)

    // articles
    new routes.articles.CreateArticle(this.app, this.connect)
    new routes.articles.ShowArticle(this.app, this.connect)
    new routes.articles.UpdateArticle(this.app, this.connect)
    new routes.articles.DeleteArticle(this.app, this.connect)
    new routes.articles.ListArticle(this.app, this.connect)

    this.app.use((_, res) => {
      res.status(404).json({
        'code': 404,
        'message': 'Not Found'
      })
    })
  }

  /**
   * run
   */
  run () {
    try {
      this.connect = this.dbConnect()
      this.dbConnect()
      this.middleware()
      this.routes()
      this.app.listen(this.port, () => console.log(`Server is listening on port ${this.port} and dirname is ${__dirname}`))
    } catch (err) {
      console.error(`[ERROR] Server -> ${err}`)
    }
  }
}

module.exports = Server
