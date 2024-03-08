import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.js'
import tasksRoutes from './routes/tasks.js'
import usersRoutes from './routes/users.js'

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true)
  const allowedOrigins = ['http://localhost:3000']
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  next()
})

app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/users', usersRoutes)

app.listen(8800, () => {
  console.log('Api working')
})
