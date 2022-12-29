require('dotenv').config()

const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = process.env.PORT
const errorHandler = require('./middleware/errorMiddleware')
const cookieParser = require('cookie-parser')

// Initialize server and database
const start = async () => {
    try {
        await connectDB(process.env.DATABASE_URL)
        app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`))
    } catch (err) {
        console.error(err)
    }
}

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

// Initialize routes
const userRoute = require('./routes/user')

// Routes middlewares
app.use('/api/users', userRoute)

// Routes
app.get('/', (req, res) => {
    res.send('<h1>Homepage</h1>')
})

// Error handler middleware
app.use(errorHandler)

// Invoke server and database
start()