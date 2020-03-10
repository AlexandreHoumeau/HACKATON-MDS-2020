const mongoose = require('mongoose')
const JWT = require('../jwt')
const jwt = new JWT()
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const UserSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String, 
    required: true
  },
  token: {
    type: String,
    required: true
  },
  articleID: {
    type: [ObjectId]
  },
  points: Number,
  image_profil: {
    type: String
  }
}, {
  collection: 'users', 
  minimize: false, 
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
  }
})

UserSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this
  const token = jwt.JWTgenerator(user)
  user.token = token
  await user.save()
  return token
}

module.exports = UserSchema
