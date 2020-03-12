const Article = require('../../models/article')
// const JWT = require('../../jwt.js')
// const jwt = new JWT()
/**
 * Create
 * @class
 */
class Update {
  constructor (app, connect) {
    this.app = app
    this.ArticleModel = connect.model('Article', Article)
    this.run()
  }
  /**
   * middleware
   */
  middleware () {
    this.app.put('/article/update/:id', (req, res) => {
      const { id } = req.params
      const { body } = req

      this.ArticleModel.findByIdAndUpdate(id, body, {new: true}).then(article => {
        res.status(200).json(article || {})
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

module.exports = Update
