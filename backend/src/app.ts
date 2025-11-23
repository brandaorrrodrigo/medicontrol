import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { env } from './config/env'

// Importar rotas
import authRoutes from './auth/auth.routes'
import dashboardRoutes from './dashboard/dashboard.routes'
import notificationsRoutes from './notifications/notifications.routes'
import medicationsRoutes from './medications/medications.routes'
import remindersRoutes from './reminders/reminders.routes'
import vitalsRoutes from './vitals/vitals.routes'
import patientsRoutes from './patients/patients.routes'
import examsRoutes from './exams/exams.routes'
import photosRoutes from './photos/photos.routes'
import prescriptionsRoutes from './prescriptions/prescriptions.routes'
import consultationsRoutes from './consultations/consultations.routes'

const app: Express = express()

// Middleware de segurança
app.use(helmet())

// CORS
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
)

// Rate limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

// Body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/medications', medicationsRoutes)
app.use('/api/reminders', remindersRoutes)
app.use('/api/vitals', vitalsRoutes)
app.use('/api/patients', patientsRoutes)
app.use('/api/exams', examsRoutes)
app.use('/api/photos', photosRoutes)
app.use('/api/prescriptions', prescriptionsRoutes)
app.use('/api/consultations', consultationsRoutes)

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  })
})

// Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err)

  res.status(500).json({
    error: 'Internal Server Error',
    message: env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

export default app
