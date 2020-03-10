const User = require('../../models/user')

/**
 * Create
 * @class
 */
class Create {
  constructor (app, connect) {
    this.app = app
    this.UserModel = connect.model('User', User)
    this.run()
  }
  /**
   * middleware
   */
  middleware () {
    this.app.post('/user/create', async (req, res) => {
      try {
        const userModel = new this.UserModel(req.body)
        await userModel.generateAuthToken()
        res.status(201).send({userModel})
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
