// Users
const Create = require('./users/create.js')
const Show = require('./users/show.js')
const Delete = require('./users/delete.js')
const Update = require('./users/update.js')

module.exports = {
  users: {
    Create,
    Show, 
    Delete,
    Update
  }
}
