const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a Name']
        },
        email: {
            type: String,
            required: [true, 'Please add an Email'],
            unique: true,
            trim: true,
            match: [
                /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Invalid Email'
            ]
        },
        password: {
            type: String,
            required: true,
            minLength: [8, 'Password must be up to 8 character'],
            maxLength: [64, 'Password must not be more than 32 character']
        },
        photo: {
            type: String,
            required: [true, 'Please add a Photo'],
            default: 'https://i.ibb.co/4pDNDk1/avatar.png'
        },
        phone: {
            type: String,
            default: '+62'
        },
        bio: {
            type: String,
            maxLength: [250, 'Bio must not be more than 250 character'],
            default: 'This is your bio'
        }
    },{
        timestamps: true,
        collection: 'User'
    }
)

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next()
    }
    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
    next()
})

module.exports = mongoose.model('User', userSchema)