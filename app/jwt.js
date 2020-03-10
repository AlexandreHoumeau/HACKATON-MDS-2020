const CryptoJS = require('crypto-js')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/facebook-api', function (err) {
  if (err) {
    console.log(err)
  }
})
const doc = mongoose.model('users', new Schema(
  {name: String})
)
/**
 * Jwt - Json Web Token
 */
class JWT {
  /**
   * Encode base64
   * @param {string} source
   * @return {string} string
   */
  encodeBase64 (source) {
    const encodedSource = CryptoJS.enc.Utf8.parse(JSON.stringify(source))

    return CryptoJS.enc.Base64.stringify(encodedSource)
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  }

  /**
   * Encode source to SHA256
   * @param {string} source
   * @return {string} string
   */
  encodeSHA256 (source) {
    const secret = 'secret'
    let encodedSource = CryptoJS.enc.Utf8.parse(JSON.stringify(source))

    encodedSource = CryptoJS.HmacSHA256(encodedSource, secret)

    return this.encodeBase64(encodedSource)
  }

  /**
   * JWT Generator
   * @param {Object} user
   * @param {string} user.id
   * @param {string} user.email
   * @return {Object} token
   * @return {string} token.header
   * @return {string} token.payload
   * @return {string} token.signature
   */
  JWTgenerator (user) {
    if (!user.id && !user.email) {
      return new Error(
        '[ERROR] JWTgenerator() -> user id or email is missing !'
      )
    }
    const header = { alg: 'HS256', typ: 'JWT' }
    const payload = { id: user.id, email: user.email }
    const signature = { header, payload, timestamp: Date.now() }
    return this.encodeSHA256(signature)
  }

  getToken (tokenSource) {
    const token = doc.findOne({token: tokenSource})
    return token
  }

  verify (tokenSource) {
    const token = this.getToken(tokenSource)
    return token
  }

  express () {
    return async (req, res, next) => {
      if (req.headers['access-token'] || req.headers['token']) {
        const token = req.headers['access-token'] || req.headers['token']

        if (await this.verify(token)) {
          next()

          return
        }

        res.status(401).json({
          code: 401,
          message: 'unauthorized'
        })

        return
      }

      res.status(403).json({
        code: 403,
        message: 'Invalid parameters in header please set token or access-token'
      })
    }
  }
}

module.exports = JWT
