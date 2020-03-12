const Article = require('../../models/article')
// const JWT = require('../../jwt.js')
// const jwt = new JWT()
/**
 * Create
 * @class
 */
class Show {
  constructor (app, connect) {
    this.app = app
    this.ArticleModel = connect.model('Article', Article)
    this.run()
  }

  /**
   * middleware
   */
  middleware () {
    this.app.get('/article/show/:id', (req, res) => {
      const { id } = req.params

      this.ArticleModel.findById(id).then(user => {
        res.status(200).json(user || {})
      }).catch(err => {
        res.status(500).json({
          'code': 500,
          'message': err
        })
      })
    })
  }

  /**
   * run
   */
  run () {
    this.middleware()
  }
}

module.exports = Show
