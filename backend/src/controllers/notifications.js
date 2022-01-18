const db = require('../models')
const { Notification } = db.sequelize.models

exports.getNotificationsOfOneUser = (req, res, next) => {
  const options = {
    where: { recipientUserId: req.params.id }, 
    //include: [{ model: db.Users, as: 'Sender' }],
    order: [['createdAt', 'DESC']]
  }

  Notification.findAll(options)
    .then(notification => {
      res.status(200).json({ notification })
    })
    .catch(error => {
      console.log(error)
      res.status(400).json({ error })
    })
}

exports.deleteNotification = (req, res, next) => {
  Notification.findOne({
    where: { id: req.params.id, recipientUserId: req.user.recipientUserId }
  })
    .then(notification => {
      if (!notification) {
        res.status(400).json({ error: "You have no authorization!" })
      }
      notification
        .destroy()
        .then(() =>
          res.status(200).json({ message: 'Notification deleted!' })
        )
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error: error.message }))
}