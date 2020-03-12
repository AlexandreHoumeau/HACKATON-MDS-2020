const Article = require('../../models/article')
// const JWT = require('../../jwt.js')
// const jwt = new JWT()
/**
 * Create
 * @class
 */
class Delete {
  constructor (app, connect) {
    this.app = app
    this.ArticleModel = connect.model('Article', Article)
    this.run()
  }
  /**
   * middleware
   */
  middleware () {
    this.app.delete('/article/delete/:id', (req, res) => {
      try {
        const { id } = req.params
        this.ArticleModel.findByIdAndDelete(id).then(Article => {
          res.status(200).json(Article || {})
        }).catch(err => {
          res.status(500).json({
            'code': 500,
            'message': err
          })
        })
      } catch (err) {
        res.status(500).json({
          'code': 500,
          'message': err
        })
      }
    })
  }

  /**
   * run
   */
  run () {
    this.middleware()
  }
}

module.exports = Delete
