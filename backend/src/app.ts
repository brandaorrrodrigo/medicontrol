import express, { Express, Request, Response, NextFunction } from 'express'
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
import alertsRoutes from './alerts/alerts.routes'
import gamificationRoutes from './gamification/gamification.routes'
import calendarRoutes from './calendar/calendar.routes'

const app: Express = express()

// ========================
// Middleware de segurança
// ========================
app.use(helmet())

// ========================
// CORS MANUAL – RESOLVE O ERRO DE "not equal to the supplied origin"
// ========================
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin

  const allowedOrigins = [
    env.FRONTEND_URL?.trim(),
    'https://medcontrol-six.vercel.app',
    'https://medicontrol-olu292sal-rodrigos-projects-2fb5b2ab.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
  ].filter(Boolean) as string[]

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

  // Responde preflight imediatamente
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  next()
})

// ========================
// Rate limiting
// ========================
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// ========================
// Body parsers & cookies
// ========================
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ========================
// Health check
// ========================
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    frontendUrl: env.FRONTEND_URL,
  })
})

// ========================
// Rotas da API
// ========================
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
app.use('/api/alerts', alertsRoutes)
app.use('/api/gamification', gamificationRoutes)
app.use('/api/calendar', calendarRoutes)

// ========================
// 404 Handler
// ========================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  })
})

// ========================
// Error Handler Global
// ========================
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Erro não tratado:', err)
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: env.NODE_ENV === 'development' ? err.message : 'Algo deu errado',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

export default app