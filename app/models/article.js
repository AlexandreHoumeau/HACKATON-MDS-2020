const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const UserSchema = new mongoose.Schema({
  title: {
    require: true,
    type: String
  },
  description: String,
  userId: ObjectId,
  photo: String,
  categories: String,
  transaction: Boolean
}, {
  collection: 'articles', 
  minimize: false, 
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
  }
})

UserSchema.methods.generateAdmin = async function (tk, userModel) {
  // Generate an admin from token
  const article = this
  const user = await userModel.findOne({token: tk}, async (err, collection) => {
    if (err) {
      return err
    }
    return collection
  })
  article.userId = user._doc._id
  await article.save()
  return article
}
module.exports = UserSchema
