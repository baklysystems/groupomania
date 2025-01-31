const fs = require('fs')

const db = require('../models')
const { Comments,User } = db.sequelize.models

exports.createComment = async (req, res, next) => {
  try {
    console.log(req.user);
    let comment = await Comments.create({
      ...req.body,
      postId: req.params.postId,
      userId: req.user.userId
    })

    comment = await Comments.findOne({
      where: { id: comment.id },
      include: User
    })

    res.status(201).json({ comment })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
}

exports.getOneComment = (req, res, next) => {
  Comments.findOne({ where: { id: req.params.id }, include: db.Users })
    .then(comment => res.status(200).json({ comment }))
    .catch(error => res.status(404).json({ error }))
}

exports.getAllComments = (req, res, next) => {
  const options = {
    where: { postId: req.params.postId },
    include: User,
    order: [['createdAt', 'ASC']]
  }

  if (req.query.limit) {
    options.order = [['createdAt', 'DESC']]
    options.limit = parseInt(req.query.limit)
  }

  Comments.findAndCountAll(options)
    .then(comments => {
      res.status(200).json({ comments })
    })
    .catch(error => res.status(400).json({ error }))
}

exports.modifyComment = (req, res, next) => {
  Comments.findOne({
    where: { id: req.params.id, userId: req.user.userId },
    include: User
  }).then(comment => {
    if (!comment) {
      res.status(400).json({ error: "You have no authorization!" })
    } else {
      comment
        .update(req.body)
        .then(comment => res.status(200).json({ comment }))
    }
  })
}

exports.deleteComment = async (req, res, next) => {
  const where = {
    id: req.params.id
  }

  if (!req.user.admin) {
    where.userId = req.user.userId
  }

  Comments.findOne({ where })
    .then(comment => {
      if (!comment) {
        res.status(400).json({ error: "You have no authorization!" })
      }
      comment
        .destroy()
        .then(() => res.status(200).json({ message: 'Comment deleted!' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error: error.message }))
}