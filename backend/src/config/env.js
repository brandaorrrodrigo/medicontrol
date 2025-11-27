"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = exports.env = void 0;
var dotenv_1 = require("dotenv");
var zod_1 = require("zod");
// Carregar variáveis de ambiente do arquivo .env
dotenv_1.default.config();
// Schema de validação com Zod
var envSchema = zod_1.z.object({
    // Server
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().default(3001),
    // Frontend
    FRONTEND_URL: zod_1.z.string().default('http://localhost:3000'),
    // Database
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
    // JWT
    JWT_SECRET: zod_1.z.string().min(20, 'JWT_SECRET must be at least 20 characters'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(20, 'JWT_REFRESH_SECRET must be at least 20 characters'),
    JWT_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    // Email
    SMTP_HOST: zod_1.z.string().default('smtp.gmail.com'),
    SMTP_PORT: zod_1.z.coerce.number().default(587),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    EMAIL_FROM: zod_1.z.string().email().default('noreply@mediccontrol.com'),
    // Upload
    UPLOAD_DIR: zod_1.z.string().default('uploads'),
    MAX_FILE_SIZE: zod_1.z.coerce.number().default(5242880),
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: zod_1.z.coerce.number().default(900000),
    RATE_LIMIT_MAX_REQUESTS: zod_1.z.coerce.number().default(100),
});
// Função para validar e parsear variáveis de ambiente
var parseEnv = function () {
    try {
        var parsed = envSchema.parse(process.env);
        return parsed;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.error('❌ Invalid environment variables:');
            error.errors.forEach(function (err) {
                console.error("  ".concat(err.path.join('.'), ": ").concat(err.message));
            });
            console.error('\nPlease check your .env file and ensure all required variables are set.');
            process.exit(1);
        }
        throw error;
    }
};
// Exportar variáveis validadas
exports.env = parseEnv();
// Exportar para uso como ENV
exports.ENV = exports.env;
exports.default = exports.env;
