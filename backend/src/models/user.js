'use strict'
const { Model } = require('sequelize')

const {
  ensurePasswordIsStrongEnough,
  addAuthenticationOn
} = require('../services/authentication')

//const { deleteFile } = require('../services/file-removal')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Post, { foreignKey: 'userId' })
    }

    softDestroy () {
      return this.update({
        deleted: true,
        email: `deleted-user${this.id}@groupomania.com`,
        firstName: 'User',
        lastName: 'Deleted'
      })
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true/*,
          //use a method to display a custom error message
          async ensureEmailIsUnique (email) {
            if (await User.findOne({ where: { email } }))
              throw new Error('An account with this email already exists!')
          } // add else*/
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ensurePasswordIsStrongEnough
        }
      }/*,
      imageUrl: DataTypes.STRING,
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }*/,
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'User'
    }
  )

  addAuthenticationOn(User)

  /*User.afterUpdate(async user => {
    if (user.dataValues.imageUrl !== user._previousDataValues.imageUrl) {
      await deleteFile(user._previousDataValues.imageUrl)
    }
  })*/

  return User
}