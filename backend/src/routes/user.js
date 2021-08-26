const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/user')

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

router.post('/signup', userCtrl.signup)

router.post('/login', userCtrl.login)

router.put('/edit', auth, multer, userCtrl.editUser)

router.get('/users/userId', auth, userCtrl.getOneUser)
router.get('/users', auth, userCtrl.getAllUsers)
router.delete('/users/:id', auth, userCtrl.deleteUserAccount)

module.exports = router