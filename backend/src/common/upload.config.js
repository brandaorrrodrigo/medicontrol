"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadPhoto = exports.uploadExam = void 0;
var multer_1 = require("multer");
var path_1 = require("path");
var crypto_1 = require("crypto");
var env_1 = require("../config/env");
// Configuração de storage
var storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, env_1.env.UPLOAD_DIR);
    },
    filename: function (_req, file, cb) {
        var uniqueSuffix = crypto_1.default.randomBytes(16).toString('hex');
        var ext = path_1.default.extname(file.originalname);
        var filename = "".concat(uniqueSuffix).concat(ext);
        cb(null, filename);
    },
});
// Filtro de tipos de arquivo
var fileFilter = function (_req, file, cb) {
    // Tipos permitidos para exames
    var examMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
    ];
    if (examMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Tipo de arquivo não permitido. Permitidos: PDF, JPG, PNG, GIF'));
    }
};
// Filtro apenas para imagens
var imageFilter = function (_req, file, cb) {
    var imageMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
    ];
    if (imageMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Tipo de arquivo não permitido. Apenas imagens são aceitas'));
    }
};
// Middleware para upload de exames
exports.uploadExam = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: env_1.env.MAX_FILE_SIZE, // 5MB por padrão
    },
});
// Middleware para upload de fotos
exports.uploadPhoto = (0, multer_1.default)({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: env_1.env.MAX_FILE_SIZE,
    },
});
// Middleware para múltiplos arquivos
exports.uploadMultiple = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: env_1.env.MAX_FILE_SIZE,
        files: 5, // Máximo 5 arquivos por vez
    },
});
