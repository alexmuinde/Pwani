import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

// Route Imports
import userRoute from './routes/userRoute.js'
import authRoute from './routes/authRoute.js'
import createDocRoute from './routes/createDocRoute.js'


dotenv.config()

// Database Connection
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB Transporter Database')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
  })

const app = express()

// Global Middleware
app.use(express.json())
app.use(cookieParser())

// API Routes
app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/createDoc', createDocRoute)


// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000!!!')
})