const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authHandler = asyncHandler(async (req, res, next) => {
    try {
        // Verify token cookies
        const token = req.cookies.token
        if (!token) {
            res.status(401)
            throw new Error('Not authorized, please login')
        }

        // Verify user
        const verified = jwt.verify(token, process.env.JWT_SECRET)

        // Get user id from token
        const user = await User.findById(verified.id)

        if (!user) {
            res.status(404)
            throw new Error('User not found')
        }
        req.user = user
        next()
    } catch (error) {
        res.status(401)
        throw new Error('Not authorized, please login')
    }
})

module.exports = authHandler