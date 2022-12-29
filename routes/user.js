const express = require('express')
const router = express.Router()
const {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    changePassword
} = require('../controllers/user')
const authHandler = require('../middleware/authMiddleware')

router.route('/register')
    .post(registerUser)

router.route('/login')
    .post(loginUser)

router.route('/logout')
    .get(logoutUser)

router.route('/get-user')
    .get(authHandler, getUser)

router.route('/login-status')
    .get(loginStatus)

router.route('/update-user')
    .patch(authHandler , updateUser)

router.route('/change-password')
    .patch(authHandler, changePassword)

module.exports = router
