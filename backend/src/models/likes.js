'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Likes.belongsTo(models.User, { foreignKey: 'userId',targetKey:'userId' })
      Likes.belongsTo(models.Post, { foreignKey: 'postId' })
    }
  }
  Likes.init(
    {
      userId: DataTypes.INTEGER,
      postId: DataTypes.INTEGER,
      likesCount: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Likes'
    }
  )

  Likes.afterCreate(async likes => {  
    const post = await likes.getPost()
    await post.update({
      likes: post.likes + 1
    })
  })
  Likes.afterDestroy(async likes => {
    const post = await likes.getPost()
    post.update({
      likes: post.likes - 1
    })
  })

  Likes.afterCreate(async likes => {
    const post = await likes.getPost()
    const user = await likes.getUser()

    if (user.id == post.userId) return

    const notification = await sequelize.models.Notification.create({
      content: `<b>${user.firstName} ${
        user.lastName
      }</b> has liked your post at ${post.readableCreatedAt()}`,
      recipientUserId: post.userId,
      postId: post.id,
      senderUserId: user.userId
    })
  })

  return Likes
}