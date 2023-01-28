const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
const helmet = require('helmet')
const connectDB = require('./db')

const app = express()
dotenv.config({ path: '.env.dev' })
const port = process.env.PORT || 3000

connectDB()
app.use(helmet())
app.use(morgan('dev'))
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth', require('./routes/auth'))

// Error handling Middleware function for logging the error message
const errorLogger = (error, req, res, next) => next(error)

const errorResponder = (error, req, res, next) => {
  res.header('Content-Type', 'application/json')
  const status = error.status || 400
  res.status(status).json({ error: error.message })
}

const invalidPathHandler = (req, res, next) => res.status(404).send('invalid path')

app.use(errorLogger)
app.use(errorResponder)
app.use(invalidPathHandler)

app.listen(port, () => console.log(`Server is running on port ${port}`))