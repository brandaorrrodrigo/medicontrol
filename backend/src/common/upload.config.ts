import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import { env } from '../config/env'

// Configuração de storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, env.UPLOAD_DIR)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex')
    const ext = path.extname(file.originalname)
    const filename = `${uniqueSuffix}${ext}`
    cb(null, filename)
  },
})

// Filtro de tipos de arquivo
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Tipos permitidos para exames
  const examMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
  ]

  if (examMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Tipo de arquivo não permitido. Permitidos: PDF, JPG, PNG, GIF'))
  }
}

// Filtro apenas para imagens
const imageFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const imageMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ]

  if (imageMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Tipo de arquivo não permitido. Apenas imagens são aceitas'))
  }
}

// Middleware para upload de exames
export const uploadExam = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE, // 5MB por padrão
  },
})

// Middleware para upload de fotos
export const uploadPhoto = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
  },
})

// Middleware para múltiplos arquivos
export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
    files: 5, // Máximo 5 arquivos por vez
  },
})
