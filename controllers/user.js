const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const generateToken = require('../middleware/generateToken')

// Register user
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body

    // Check input data from client side
    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please fill in all required form!')
    }

    // Check password length
    if (password.length < 6 || password.length > 32) {
        res.status(400)
        throw new Error('Password must be at least 8 character and no more than 32 character')
    }

    // Check if email exist on database
    const userExist = await User.findOne({email})
    if (userExist) {
        res.status(400)
        throw new Error('Email has already been registered')
    }

    // Register new user
    const user = await User.create({
        name,
        email,
        password
    })
    // Generate token
    const token = generateToken(user._id)
    // Send cookie to client
    res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 85400), // Expires in 1 day
        sameSite: 'none',
        secure: true
    })
    // Send message that user registered successfully or error registering user
    if (user) {
        const { _id, name, email, photo, phone, bio} = user
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

})

// Login user
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    // Validate input
    if (!email || !password) {
        res.status(400)
        throw new Error('Please fill all the required form input!')
    }

    // Check if the email exist in database
    const user = await User.findOne({email})
    if (!user) {
        res.status(404)
        throw new Error('Email has not been registered')
    }
    
    // User is exist and continue to check the password
    if (user && await bcrypt.compare(password, user.password)) {
        const {_id, name, email, photo, phone, bio} = user
        const token = generateToken(_id)
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 85400), // Expires in 1 day
            sameSite: 'none',
            secure: true
        })
        res.status(200).send({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token
        })
    } else {
        res.status(404)
        throw new Error('Wrong email or password')
    }
})

// Logout user
const logoutUser = (req, res) => {
    res.cookie('token', '', {
        path: '/',
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'none',
        secure: true
    })
    res.status(200).json({message: 'Logout success'})
}

// Get user info
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    const {_id, name, email, photo, phone, bio} = user
    if (user) {
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio
        })
    } else {
        res.status(400)
        throw new Error('User not found')
    }
})

// Login status
const loginStatus = (req, res) => {
    // Validate cookies
    const token = req.cookies.token
    if (!token) {
        return res.json(false)
    }

    //Verify user
    const verirfied = jwt.verify(token, process.env.JWT_SECRET)
    if (verirfied) {
        return res.json(true)
    }
    return res.json(false)
}

// Update user profile
const updateUser  = asyncHandler(async (req, res) => {
    const user = await User.findOneAndUpdate({_id: req.user._id}, req.body, {new: true, runValidators: true})
    const {_id, name, email, photo, phone, bio} = user

    if (user) {
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// Change password
const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    const { oldPassword, password } = req.body

    // Validate user input
    if (!oldPassword || !password) {
        res.status(400)
        throw new Error("Please add old and new password")
    }

    // Compare old password with password stored in database
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)

    // Save new password
    if (user && passwordIsCorrect) {
        user.password = password
        await user.save()
        res.status(200).send("Password changed successful")
    } else {
        res.status(400)
        throw new Error("Old password is incorrect")
    }
})

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    changePassword
}