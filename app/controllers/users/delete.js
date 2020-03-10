const User = require('../../models/user')
const JWT = require('../../jwt.js')
const jwt = new JWT()
/**
 * Create
 * @class
 */
class Delete {
  constructor (app, connect) {
    this.app = app
    this.UserModel = connect.model('User', User)
    this.run()
  }
  /**
   * middleware
   */
  middleware () {
    this.app.delete('/user/delete/:id', jwt.express(), (req, res) => {
      try {
        const { id } = req.params
        this.UserModel.findByIdAndDelete(id).then(user => {
          res.status(200).json(user || {})
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
