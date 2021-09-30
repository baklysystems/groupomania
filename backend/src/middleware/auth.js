const db = require('../../src/models')
const jwt = require('jsonwebtoken')
const { User } = db.sequelize.models

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1] //recovery of the token from the Authorization header
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
    const userId = decodedToken.userId
    console.log('passing through try');
    if (req.body.userId && req.body.userId !== userId) {
      console.log('inside if');
      throw 'The User ID is not valid!'
    } else {
      console.log('inside else');
      User.findOne({ where: { userId: userId } }).then(user => {
        req.user = user
        next()
      }).catch((e)=>{
        console.log('did find any user with this id');

      })
    }
  } catch (error) {
    res.status(401).json({
      error: new Error('Unauthenticated request !')
    })
  }
}