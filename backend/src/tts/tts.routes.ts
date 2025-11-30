import { Router } from 'express'
import { ttsController } from './tts.controller'

const router = Router()

// POST /api/tts - Gerar áudio a partir de texto
router.post('/', (req, res) => ttsController.generateSpeech(req, res))

export default router
