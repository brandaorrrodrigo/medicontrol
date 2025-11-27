"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = sendPasswordResetEmail;
exports.sendEmail = sendEmail;
var nodemailer_1 = require("nodemailer");
var env_1 = require("../config/env");
// Criar transporter do nodemailer
var transporter = nodemailer_1.default.createTransport({
    host: env_1.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(env_1.env.SMTP_PORT) || 587,
    secure: false, // true para 465, false para outras portas
    auth: {
        user: env_1.env.SMTP_USER,
        pass: env_1.env.SMTP_PASS,
    },
});
// Verificar configuração do transporter
transporter.verify(function (error, _success) {
    if (error) {
        console.error('Erro na configuração do email:', error);
    }
    else {
        console.log('Servidor de email pronto para enviar mensagens');
    }
});
/**
 * Envia um email de recuperação de senha
 */
function sendPasswordResetEmail(to, resetToken) {
    return __awaiter(this, void 0, void 0, function () {
        var resetUrl, mailOptions, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resetUrl = "".concat(env_1.env.FRONTEND_URL, "/reset-password?token=").concat(resetToken);
                    mailOptions = {
                        from: "\"MedicControl\" <".concat(env_1.env.SMTP_USER, ">"),
                        to: to,
                        subject: 'Recuperação de Senha - MedicControl',
                        html: "\n      <!DOCTYPE html>\n      <html lang=\"pt-BR\">\n      <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Recupera\u00E7\u00E3o de Senha</title>\n      </head>\n      <body style=\"margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;\">\n        <table role=\"presentation\" style=\"width: 100%; border-collapse: collapse;\">\n          <tr>\n            <td align=\"center\" style=\"padding: 40px 0;\">\n              <table role=\"presentation\" style=\"width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);\">\n                <!-- Header -->\n                <tr>\n                  <td style=\"padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;\">\n                    <h1 style=\"margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;\">MedicControl</h1>\n                  </td>\n                </tr>\n\n                <!-- Content -->\n                <tr>\n                  <td style=\"padding: 40px;\">\n                    <h2 style=\"margin: 0 0 20px; color: #111827; font-size: 24px;\">Recupera\u00E7\u00E3o de Senha</h2>\n                    <p style=\"margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.5;\">\n                      Voc\u00EA solicitou a recupera\u00E7\u00E3o de senha da sua conta no MedicControl.\n                    </p>\n                    <p style=\"margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.5;\">\n                      Clique no bot\u00E3o abaixo para redefinir sua senha:\n                    </p>\n\n                    <!-- Button -->\n                    <table role=\"presentation\" style=\"width: 100%; border-collapse: collapse;\">\n                      <tr>\n                        <td align=\"center\" style=\"padding: 0;\">\n                          <a href=\"".concat(resetUrl, "\" style=\"display: inline-block; padding: 14px 40px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;\">\n                            Redefinir Senha\n                          </a>\n                        </td>\n                      </tr>\n                    </table>\n\n                    <p style=\"margin: 30px 0 20px; color: #6b7280; font-size: 14px; line-height: 1.5;\">\n                      Ou copie e cole este link no seu navegador:\n                    </p>\n                    <p style=\"margin: 0 0 30px; padding: 12px; background-color: #f3f4f6; border-radius: 4px; word-break: break-all; font-size: 12px; color: #4b5563;\">\n                      ").concat(resetUrl, "\n                    </p>\n\n                    <p style=\"margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;\">\n                      <strong>Este link expira em 1 hora.</strong>\n                    </p>\n\n                    <hr style=\"margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;\">\n\n                    <p style=\"margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5;\">\n                      Se voc\u00EA n\u00E3o solicitou a recupera\u00E7\u00E3o de senha, ignore este email. Sua senha permanecer\u00E1 inalterada.\n                    </p>\n                  </td>\n                </tr>\n\n                <!-- Footer -->\n                <tr>\n                  <td style=\"padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;\">\n                    <p style=\"margin: 0 0 10px; color: #6b7280; font-size: 12px;\">\n                      \u00A9 ").concat(new Date().getFullYear(), " MedicControl. Todos os direitos reservados.\n                    </p>\n                    <p style=\"margin: 0; color: #9ca3af; font-size: 12px;\">\n                      Este \u00E9 um email autom\u00E1tico, por favor n\u00E3o responda.\n                    </p>\n                  </td>\n                </tr>\n              </table>\n            </td>\n          </tr>\n        </table>\n      </body>\n      </html>\n    "),
                        text: "\nRecupera\u00E7\u00E3o de Senha - MedicControl\n\nVoc\u00EA solicitou a recupera\u00E7\u00E3o de senha da sua conta no MedicControl.\n\nPara redefinir sua senha, acesse o link abaixo:\n".concat(resetUrl, "\n\nEste link expira em 1 hora.\n\nSe voc\u00EA n\u00E3o solicitou a recupera\u00E7\u00E3o de senha, ignore este email.\n\n\u00A9 ").concat(new Date().getFullYear(), " MedicControl\n    ").trim(),
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, transporter.sendMail(mailOptions)];
                case 2:
                    _a.sent();
                    console.log("Email de recupera\u00E7\u00E3o de senha enviado para: ".concat(to));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Erro ao enviar email:', error_1);
                    throw new Error('Falha ao enviar email de recuperação');
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Envia um email genérico
 */
function sendEmail(to, subject, html, text) {
    return __awaiter(this, void 0, void 0, function () {
        var mailOptions, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mailOptions = {
                        from: "\"MedicControl\" <".concat(env_1.env.SMTP_USER, ">"),
                        to: to,
                        subject: subject,
                        html: html,
                        text: text,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, transporter.sendMail(mailOptions)];
                case 2:
                    _a.sent();
                    console.log("Email enviado para: ".concat(to));
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Erro ao enviar email:', error_2);
                    throw new Error('Falha ao enviar email');
                case 4: return [2 /*return*/];
            }
        });
    });
}
