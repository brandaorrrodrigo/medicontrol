import dotenv from 'dotenv'
import { z } from 'zod'

// Carregar variáveis de ambiente do arquivo .env
dotenv.config()

// Schema de validação com Zod
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),

  // Frontend
  FRONTEND_URL: z.string().default('http://localhost:3000'),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // JWT
  JWT_SECRET: z.string().min(20, 'JWT_SECRET must be at least 20 characters'),
  JWT_REFRESH_SECRET: z.string().min(20, 'JWT_REFRESH_SECRET must be at least 20 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Email
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().default('noreply@mediccontrol.com'),

  // Upload
  UPLOAD_DIR: z.string().default('uploads'),
  MAX_FILE_SIZE: z.coerce.number().default(5242880),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
})

// Tipo inferido do schema
export type Env = z.infer<typeof envSchema>

// Função para validar e parsear variáveis de ambiente
const parseEnv = (): Env => {
  try {
    const parsed = envSchema.parse(process.env)
    return parsed
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:')
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`)
      })
      console.error('\nPlease check your .env file and ensure all required variables are set.')
      process.exit(1)
    }
    throw error
  }
}

// Exportar variáveis validadas
export const env = parseEnv()

// Exportar para uso como ENV
export const ENV = env
export default env
