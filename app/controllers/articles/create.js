const Articles = require('../../models/article')
const User = require('../../models/user')

/**
 * Create
 * @class
 */
class Create {
  constructor (app, connect) {
    this.app = app
    this.ArticleModel = connect.model('Articles', Articles)
    this.UserModel = connect.model('User', User)

    this.run()
  }
  /**
   * middleware
   */
  middleware () {
    this.app.post('/article/create', async (req, res) => {
      try {
        const articleModel = new this.ArticleModel(req.body)
        await articleModel.generatePhoto()
        // articleModel.save()
        res.status(201).send({articleModel})
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

module.exports = Create
