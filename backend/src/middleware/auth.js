const db = require('../../src/models')
const jwt = require('jsonwebtoken')
const { User } = db.sequelize.models

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1] //recovery of the token from the Authorization header
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
    const userId = decodedToken.userId
    if (req.body.userId && req.body.userId !== userId) {
      throw 'The User ID is not valid!'
    } else {
      User.findOne({ where: { id: userId } }).then(user => {
        req.user = user
        next()
      })
    }
  } catch (error) {
    res.status(401).json({
      error: new Error('Unauthenticated request !')
    })
  }
}