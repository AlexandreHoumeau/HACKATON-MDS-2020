// Users
const Create = require('./users/create.js')
const Show = require('./users/show')
const Delete = require('./users/delete.js')
const Update = require('./users/update.js')

// Articles
const CreateArticle = require('./articles/create')
const ShowArticle = require('./articles/show')
const UpdateArticle = require('./articles/update')
const DeleteArticle = require('./articles/delete')

module.exports = {
  users: {
    Create,
    Show, 
    Delete,
    Update
  },
  articles: {
    CreateArticle,
    ShowArticle, 
    UpdateArticle,
    DeleteArticle
  }
}
