const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const UserSchema = new mongoose.Schema({
  title: {
    require: true,
    type: String
  },
  first_name: String,
  last_name: String,
  description: String,
  userId: ObjectId,
  photo: String,
  categories: String,
  transaction: Boolean,
  type: String,
  date_time: Date
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

UserSchema.methods.generatePhoto = async function () {
  // Generate an admin from token
  const article = this
  if (article._doc.categories === 'Nourriture') {
    article.photo = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80'
  }

  if (article._doc.categories === 'Électronique') {
    article.photo = 'https://images.unsplash.com/photo-1476966162421-d6f1dde41279?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80'
  }

  if (article._doc.categories === 'Fournitures de bureau') {
    article.photo = 'https://images.unsplash.com/photo-1472851422705-2ae0e0a551f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  }

  if (article._doc.categories === 'Meubles') {
    article.photo = 'https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80'
  }

  // const user = await userModel.findOne({token: tk}, async (err, collection) => {
  //   if (err) {
  //     return err
  //   }
  //   return collection
  // })
  // article.userId = user._doc._id
  await article.save()
  return article
}
module.exports = UserSchema
