import app from './app'
import { env } from './config/env'
import { prisma } from './database/prisma'
import { cronService } from './cron'

const PORT = env.PORT

async function startServer() {
  try {
    // Testar conexão com o banco de dados
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    // Iniciar cron jobs
    cronService.startAll()

    // Iniciar servidor (0.0.0.0 para Railway)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📍 Environment: ${env.NODE_ENV}`)
      console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`)
      console.log(`🌐 Frontend URL: ${env.FRONTEND_URL}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏳ Shutting down gracefully...')
  cronService.stopAll()
  await prisma.$disconnect()
  console.log('✅ Database disconnected')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n⏳ Shutting down gracefully...')
  cronService.stopAll()
  await prisma.$disconnect()
  console.log('✅ Database disconnected')
  process.exit(0)
})

startServer()
