const User = require('../../models/user')
const JWT = require('../../jwt.js')
const jwt = new JWT()
/**
 * Create
 * @class
 */
class Show {
  constructor (app, connect) {
    this.app = app
    this.UserModel = connect.model('User', User)

    this.run()
  }

  /**
   * middleware
   */
  middleware () {
    this.app.get('/user/show/:id', jwt.express(), (req, res) => {
      const { id } = req.params

      this.UserModel.findById(id).then(user => {
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
