const db = require('../models')
const { Likes } = db.sequelize.models

exports.likeOnePost = async (req, res, next) => {
  try {
    const existingLike = await Likes.findOne({
      where: { userId: req.user.userId, postId: req.params.postId }
    })

    if (existingLike) {
      await existingLike.destroy()
      res.status(200).json({ like: false })
    } else {
      await Likes.create({ userId: req.user.userId, postId: req.params.postId })
      res.status(201).json({ like: true })
    }
  } catch (error) {
    res.status(400).json({ error })
  }
}

exports.getLikeOnOnePost = async (req, res, next) => {
  try {
    const existingLike = await Likes.findOne({
      where: { userId: req.user.id, postId: req.params.postId }
    })
    res.status(200).json({ like: existingLike ? true : false })
  } catch (error) {
    res.status(400).json({ error })
  }
}

exports.getAllLikesOfOnePost = async (req, res, next) => {
  try {
    const allLikes = await Likes.findAll({
      where: { postId: req.params.postId },
      include: db.Users
    })
    res.status(200).json({ allLikes })
  } catch (error) {
    res.status(400).json({ error })
  }
}

/*exports.likeOnePost = (req, res, next) => {
  
  Post.findOne({where: { userId: req.user.id, postId: req.params.postId }}).then(
    (post) => {
    let like = req.body.like;
    let userId = req.body.userId;

      if (like === 1) {
  
        if(!post.usersLiked.find(element => element === userId)){

          post.usersLiked.push(userId)
        
          post.likes ++;
        }

      } else if (like === 0) {
       
        if(post.usersLiked.find(element => element === userId)){
          
          post.usersLiked.splice(post.usersLiked.indexOf(userId), 1); 

          post.likes --;
          
        } else if (post.usersDisliked.find(element => element === userId)) {

          post.usersDisliked.splice(post.usersDisliked.indexOf(userId), 1);

          post.dislikes --;
        }

      } 
      
      else if (like === -1) {

        if(!post.usersDisliked.find(element => element === userId)){
          
          post.usersDisliked.push(userId)
        
          post.dislikes ++;
        }

      } 
      
      post.save().then(
        () => {
          res.status(201).json({
            message: 'Rating saved successfully!'
          });
      })
    }
  ) 
  .catch(
    (error) => {
        res.status(400).json({
        error: error
      });
    }
  );
} */
