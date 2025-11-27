"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
var auth_service_1 = require("./auth.service");
// Middleware de autenticação
var authenticate = function (req, res, next) {
    try {
        // Obter token do header
        var authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: 'Token não fornecido',
            });
            return;
        }
        var token = authHeader.substring(7); // Remove "Bearer "
        // Verificar token
        var payload = auth_service_1.authService.verifyAccessToken(token);
        // Adicionar dados do usuário ao request
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: 'Token inválido ou expirado',
        });
        return;
    }
};
exports.authenticate = authenticate;
// Middleware de autorização por role
var authorize = function () {
    var allowedRoles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        allowedRoles[_i] = arguments[_i];
    }
    return function (req, res, next) {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Não autenticado',
            });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: 'Acesso negado',
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
