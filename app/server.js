const express = require('express')
const routes = require('./controllers/routes.js')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const path = require('path')

/**
 * Server
 * @Class
 */
class Server {
  constructor () {
    this.app = express()
    this.port = 3000
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
    this.app.get('/', (_, res) => 
      res.render('home', {res: res})
    )
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
