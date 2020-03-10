const User = require('../../models/user')
const JWT = require('../../jwt.js')
const jwt = new JWT()
/**
 * Create
 * @class
 */
class Update {
  constructor (app, connect) {
    this.app = app
    this.UserModel = connect.model('User', User)
    this.run()
  }
  /**
   * middleware
   */
  middleware () {
    this.app.put('/user/update/:id', jwt.express(), (req, res) => {
      const { id } = req.params
      const { body } = req

      this.UserModel.findByIdAndUpdate(id, body, {new: true}).then(user => {
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

module.exports = Update
