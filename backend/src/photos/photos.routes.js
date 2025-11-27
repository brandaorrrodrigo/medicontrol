"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var photos_controller_1 = require("./photos.controller");
var auth_middleware_1 = require("../auth/auth.middleware");
var upload_config_1 = require("../common/upload.config");
var router = (0, express_1.Router)();
// Todas as rotas requerem autenticação
router.use(auth_middleware_1.authenticate);
// GET /api/photos/compare?patientId=xxx&before=xxx&after=xxx
router.get('/compare', function (req, res, next) { return photos_controller_1.photosController.comparePhotos(req, res, next); });
// GET /api/photos?patientId=xxx&type=BEFORE
router.get('/', function (req, res, next) { return photos_controller_1.photosController.getPhotos(req, res, next); });
// POST /api/photos - Upload de foto
router.post('/', upload_config_1.uploadPhoto.single('photo'), function (req, res, next) { return photos_controller_1.photosController.uploadPhoto(req, res, next); });
// PUT /api/photos/:id
router.put('/:id', function (req, res, next) { return photos_controller_1.photosController.updatePhoto(req, res, next); });
// DELETE /api/photos/:id
router.delete('/:id', function (req, res, next) { return photos_controller_1.photosController.deletePhoto(req, res, next); });
exports.default = router;
