import { Router } from 'express'
import { examsInterpretationController } from './exams-interpretation.controller'
import { authenticate } from '../auth/auth.middleware'

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticate)

// Catálogo e busca
router.get('/catalog', examsInterpretationController.getCatalog.bind(examsInterpretationController))
router.get('/categories', examsInterpretationController.getCategories.bind(examsInterpretationController))
router.get('/category/:category', examsInterpretationController.getByCategory.bind(examsInterpretationController))
router.get('/marker/:markerCode', examsInterpretationController.getMarker.bind(examsInterpretationController))
router.post('/search', examsInterpretationController.searchMarkers.bind(examsInterpretationController))

// Interpretação
router.post('/interpret', examsInterpretationController.interpretResult.bind(examsInterpretationController))
router.post('/interpret-multiple', examsInterpretationController.interpretMultiple.bind(examsInterpretationController))

// Administração
router.post('/reload-catalog', examsInterpretationController.reloadCatalog.bind(examsInterpretationController))

export default router
