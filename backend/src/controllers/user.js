const db = require('../../src/models')
const Sequelize = db.Sequelize
const jwt = require('jsonwebtoken')
const { User } = db.sequelize.models
const fs = require('fs')

const newToken = user => {
  token = jwt.sign({ userId: user.userId }, 'RANDOM_TOKEN_SECRET', {
    expiresIn: '24h'
  })
  return { user, token }
}

exports.signup = (req, res, next) => {
  User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  })
    .then(user => res.status(201).json(newToken(user)))
    .catch(error => res.status(401).json({ error: error }))
}

exports.login = async (req, res, next) => {
  try {
    const response = await User.authenticate(req.body.email, req.body.password)

    if (response.valid) {
      res.status(201).json(newToken(response.user))
    } else {
      res.status(401).json({ error: response.message })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.editUser = (req, res, next) => {

  console.log("backend wisdom", req.file);
  try {
    const userObject = req.file
      ? {
          ...JSON.parse(req.body.user),
          imageUrl: `${req.protocol}://${req.get('host')}/uploads/${
            req.file.filename
          }`
        }
      : { ...req.body }

    //console.log(userObject)
    req.user.update(userObject).then(user => res.status(200).json({ user }))
  } catch (error) {
    res.status(400).json({ error })
  }
}

  /*try {
    const userObject = req.file
      ? {
          ...JSON.parse(req.body.user),
          imageUrl: `${req.protocol}://${req.get('host')}/uploads/${
            req.file.filename
          }`
        }
      : { ...req.body }

    req.user.update(userObject).then(user => res.status(200).json({ user }))
  } catch (error) {
    res.status(400).json({ error })
  }

  async modifyProfilePicture () {
    const changeProfile = await apiClient.put(
      `api/auth/edit${this.User.userId}${this.comment.id}`,
      { imageUrl: `${req.protocol}://${req.get('host')}/uploads/${
        req.file.filename
      }` }
    )

    this.User.updatedAt = changeProfile.User.updatedAt
    this.isEditing = false
    this.displayNotification('User Profile updated!')
  }
}*/

exports.getOneUser = (req, res, next) => {
  User.findOne({ where: { userId: req.params.userId } })
    .then(user => res.status(200).json({ user }))
    .catch(error => res.status(404).json({ error }))
}

exports.getAllUsers = (req, res, next) => {
  const options = {
    where: Sequelize.where(
      Sequelize.fn(
        'concat',
        Sequelize.col('firstName'),
        ' ',
        Sequelize.col('lastName')
      ),
      {
        [Sequelize.Op.like]: `%${req.query.search}%`
      }
    ),
    limit: 10
  }

  User.findAll(options)
    .then(users => {
      res.status(200).json({ users })
    })
    .catch(error => {
      console.log(error)
      res.status(400).json({ error })
    })
}

exports.deleteUserAccount = async (req, res, next) => {
  try {
    const user = req.user.admin
      ? await User.findOne({ where: { userId: req.params.userId } })
      : req.user
    await user.softDestroy()
    res.status(200).json({ message: 'Account deleted.' })
  } catch (error) {
    res.status(400).json({ error })
  }
}