"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var exams_interpretation_controller_1 = require("./exams-interpretation.controller");
var auth_middleware_1 = require("../auth/auth.middleware");
var router = (0, express_1.Router)();
// Todas as rotas requerem autenticação
router.use(auth_middleware_1.authenticate);
// Catálogo e busca
router.get('/catalog', exams_interpretation_controller_1.examsInterpretationController.getCatalog.bind(exams_interpretation_controller_1.examsInterpretationController));
router.get('/categories', exams_interpretation_controller_1.examsInterpretationController.getCategories.bind(exams_interpretation_controller_1.examsInterpretationController));
router.get('/category/:category', exams_interpretation_controller_1.examsInterpretationController.getByCategory.bind(exams_interpretation_controller_1.examsInterpretationController));
router.get('/marker/:markerCode', exams_interpretation_controller_1.examsInterpretationController.getMarker.bind(exams_interpretation_controller_1.examsInterpretationController));
router.post('/search', exams_interpretation_controller_1.examsInterpretationController.searchMarkers.bind(exams_interpretation_controller_1.examsInterpretationController));
// Interpretação
router.post('/interpret', exams_interpretation_controller_1.examsInterpretationController.interpretResult.bind(exams_interpretation_controller_1.examsInterpretationController));
router.post('/interpret-multiple', exams_interpretation_controller_1.examsInterpretationController.interpretMultiple.bind(exams_interpretation_controller_1.examsInterpretationController));
// Administração
router.post('/reload-catalog', exams_interpretation_controller_1.examsInterpretationController.reloadCatalog.bind(exams_interpretation_controller_1.examsInterpretationController));
exports.default = router;
