const path = require("path");
const fs = require("fs");

const db = require('../models')
const { Post,User, Comments } = db.sequelize.models

exports.createPost = async (req, res, next) => {
  /*const url = req.protocol + '://' + req.get('host');
  req.post = JSON.parse(req.post);
  const post = new Post ({ //set up object with its type
      content: req.content,
      imageUrl: url + '/images/' + req.file.filename,
  });
  post.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );*/

  let postObject = req.body

  console.log(req);
  if (req.file) {
    console.log("Test 2");
    postObject = JSON.parse(req.body.post)
    
    /*
    const post = new Post ({ //set up object with its type
          content: req.content,
          imageUrl: url + '/images/' + req.file.filename,
      });
    */ 

    postObject.imageUrl = `${req.protocol}://${req.get('host')}/public/${
      req.file.filename
    }`
    
  }

  try {
    console.log("Test 3");
    let post = await Post.create({
      ...postObject,
      userId: req.user.userId
    })
    
    post = await Post.findOne({ where: { id: post.id }, include: [{model:User }]})

    res.status(201).json({ post })
  } catch (error) {
    console.log(error)
    console.log("Test 4");
    res.status(400).json({ error })
  }
}

exports.getOnePost = (req, res, next) => {
  Post.findOne({
    where: { id: req.params.id },
    include: [{model: User}, {model: Comments}]
  })
    .then(post => res.status(200).json({ post }))
    .catch(error => res.status(404).json({ error }))
}

exports.getAllPosts = (req, res, next) => {
  const limit = 4
  const page = parseInt(req.query.page) || 1

  const options = {
    include: [{ model: User }],
    limit,
    offset: limit * (page - 1),
    order: [['createdAt', 'DESC']]
  }

  if (req.query.userId) {
    options.where = {
      userId: parseInt(req.query.userId)
    }
  }

  Post.findAll(options)
    .then(posts => res.status(200).json({ posts }))
    .catch(error => res.status(400).json({error }))
}

exports.modifyPost = (req, res, next) => {
  const postObject = req.file
    ? {
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get('host')}/public/${
          req.file.filename
        }`
      }
    : { ...req.body }

  Post.findOne({
    where: { id: req.params.id, userId: req.user.userId }
  }).then(post => {
    if (!post) {
      res.status(400).json({ error: "You have no authorization!" })
    } else {
      post.update(postObject).then(post => res.status(200).json({ post }))
    }
  })
}

exports.deletePost = (req, res, next) => {
  const where = {
    id: req.params.id
  }

  if (!req.user.admin) {
    where.userId = req.user.userId
  }

  Post.findOne({ where })
    .then(post => {
      if (!post) {
        res.status(400).json({ error: "You have no authorization!" })
      }
      post
        .destroy()
        .then(() =>
          res.status(200).json({ message: 'Post deleted!' })
        )
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error: error.message }))
}
