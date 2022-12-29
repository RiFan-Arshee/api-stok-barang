const db = require('mongoose')
db.set('strictQuery', true)

const connectDB = (url) => {
    return db.connect(url)
}

module.exports = connectDB