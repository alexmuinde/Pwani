import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import path from 'path'

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

// Set root path (one level up from /api)
const __dirname = path.resolve()

// Global Middleware
app.use(express.json())
app.use(cookieParser())

// API Routes
app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/createDoc', createDocRoute)

// Serve Static Files (Vite uses client/dist, CRA uses client/build)
app.use(express.static(path.join(__dirname, '/client/dist')))

// Catch-All Route for Frontend SPA Routing
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

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