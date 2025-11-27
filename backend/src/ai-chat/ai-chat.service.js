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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiChatService = exports.AIChatService = void 0;
var openai_1 = require("openai");
var prisma_1 = require("../database/prisma");
// ============================================================================
// CONFIGURAÇÃO OPENAI
// ============================================================================
var openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || ''
});
// ============================================================================
// AI CHAT SERVICE
// ============================================================================
var AIChatService = /** @class */ (function () {
    function AIChatService() {
    }
    // ==========================================================================
    // SYSTEM PROMPT
    // ==========================================================================
    AIChatService.prototype.getSystemPrompt = function (context) {
        return "Voc\u00EA \u00E9 o assistente m\u00E9dico virtual do MedicControl, especializado em ajudar pacientes a entender seus exames e cuidar da sa\u00FAde.\n\nINFORMA\u00C7\u00D5ES DO PACIENTE:\n- Nome: ".concat(context.name, "\n- Idade: ").concat(context.age, " anos\n- Sexo: ").concat(context.gender, "\n- Condi\u00E7\u00F5es: ").concat(context.conditions.join(', ') || 'Nenhuma registrada', "\n- Alergias: ").concat(context.allergies.join(', ') || 'Nenhuma registrada', "\n\nMEDICAMENTOS ATUAIS:\n").concat(context.medications.map(function (m) { return "- ".concat(m.name, " ").concat(m.dosage, " - ").concat(m.frequency); }).join('\n') || '- Nenhum', "\n\nEXAMES RECENTES:\n").concat(context.recentExams.slice(0, 5).map(function (e) { return "- ".concat(e.markerName, ": ").concat(e.value, " ").concat(e.unit, " (").concat(e.status, ")"); }).join('\n') || '- Nenhum', "\n\nALERTAS:\n").concat(context.criticalAlerts.map(function (a) { return "- [".concat(a.severity, "] ").concat(a.message); }).join('\n') || '- Nenhum', "\n\nDIRETRIZES:\n1. Seja emp\u00E1tico e acolhedor\n2. Use linguagem simples\n3. SEMPRE baseie respostas nos dados REAIS acima\n4. NUNCA diagnostique - apenas eduque\n5. Em casos graves, recomende m\u00E9dico\n6. Seja conciso (m\u00E1x 3 par\u00E1grafos)\n7. Use emojis moderadamente\n8. Termine com pergunta ou a\u00E7\u00E3o");
    };
    // ==========================================================================
    // BUSCAR CONTEXTO
    // ==========================================================================
    AIChatService.prototype.getPatientContext = function (patientId) {
        return __awaiter(this, void 0, void 0, function () {
            var patient, age, genderMap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.patient.findUnique({
                            where: { id: patientId },
                            include: {
                                medications: {
                                    where: { active: true },
                                    take: 5
                                },
                                exams: {
                                    take: 2,
                                    orderBy: { date: 'desc' },
                                    include: { results: { take: 10 } }
                                },
                                examAlerts: {
                                    where: { resolved: false },
                                    take: 3
                                }
                            }
                        })];
                    case 1:
                        patient = _a.sent();
                        if (!patient)
                            throw new Error('Paciente não encontrado');
                        age = Math.floor((Date.now() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
                        genderMap = { M: 'Masculino', F: 'Feminino', O: 'Outro' };
                        return [2 /*return*/, {
                                name: patient.name,
                                age: age,
                                gender: genderMap[patient.gender] || 'Não informado',
                                conditions: patient.conditions,
                                allergies: patient.allergies,
                                medications: patient.medications.map(function (m) { return ({
                                    name: m.name,
                                    dosage: m.dosage,
                                    frequency: m.frequency
                                }); }),
                                recentExams: patient.exams.flatMap(function (e) { return e.results; }).map(function (r) { return ({
                                    markerName: r.markerName,
                                    value: r.value,
                                    unit: r.unit,
                                    status: r.status,
                                    date: r.createdAt
                                }); }),
                                criticalAlerts: patient.examAlerts.map(function (a) { return ({
                                    title: a.title,
                                    message: a.message,
                                    severity: a.severity
                                }); }),
                                trends: 'Análise de tendências disponível no dashboard'
                            }];
                }
            });
        });
    };
    // ==========================================================================
    // CHAT COM STREAMING
    // ==========================================================================
    AIChatService.prototype.chat = function (patientId_1, message_1) {
        return __asyncGenerator(this, arguments, function chat_1(patientId, message, history) {
            var context, messages, stream, _a, stream_1, stream_1_1, chunk, content, e_1_1;
            var _b, e_1, _c, _d;
            var _e, _f;
            if (history === void 0) { history = []; }
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, __await(this.getPatientContext(patientId))];
                    case 1:
                        context = _g.sent();
                        messages = __spreadArray(__spreadArray([
                            { role: 'system', content: this.getSystemPrompt(context) }
                        ], history.map(function (m) { return ({ role: m.role, content: m.content }); }), true), [
                            { role: 'user', content: message }
                        ], false);
                        return [4 /*yield*/, __await(openai.chat.completions.create({
                                model: 'gpt-4-turbo-preview',
                                messages: messages,
                                temperature: 0.7,
                                max_tokens: 500,
                                stream: true
                            }))];
                    case 2:
                        stream = _g.sent();
                        _g.label = 3;
                    case 3:
                        _g.trys.push([3, 10, 11, 16]);
                        _a = true, stream_1 = __asyncValues(stream);
                        _g.label = 4;
                    case 4: return [4 /*yield*/, __await(stream_1.next())];
                    case 5:
                        if (!(stream_1_1 = _g.sent(), _b = stream_1_1.done, !_b)) return [3 /*break*/, 9];
                        _d = stream_1_1.value;
                        _a = false;
                        chunk = _d;
                        content = (_f = (_e = chunk.choices[0]) === null || _e === void 0 ? void 0 : _e.delta) === null || _f === void 0 ? void 0 : _f.content;
                        if (!content) return [3 /*break*/, 8];
                        return [4 /*yield*/, __await(content)];
                    case 6: return [4 /*yield*/, _g.sent()];
                    case 7:
                        _g.sent();
                        _g.label = 8;
                    case 8:
                        _a = true;
                        return [3 /*break*/, 4];
                    case 9: return [3 /*break*/, 16];
                    case 10:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 16];
                    case 11:
                        _g.trys.push([11, , 14, 15]);
                        if (!(!_a && !_b && (_c = stream_1.return))) return [3 /*break*/, 13];
                        return [4 /*yield*/, __await(_c.call(stream_1))];
                    case 12:
                        _g.sent();
                        _g.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 15: return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // SUGESTÕES
    // ==========================================================================
    AIChatService.prototype.getSuggestedQuestions = function (patientId) {
        return __awaiter(this, void 0, void 0, function () {
            var context, suggestions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPatientContext(patientId)];
                    case 1:
                        context = _a.sent();
                        suggestions = [
                            'Como estão meus exames recentes?',
                            'O que significam meus resultados?'
                        ];
                        if (context.criticalAlerts.length > 0) {
                            suggestions.push('Por que recebi um alerta?');
                        }
                        if (context.recentExams.length > 0) {
                            suggestions.push("Meu ".concat(context.recentExams[0].markerName, " est\u00E1 bom?"));
                        }
                        return [2 /*return*/, suggestions.slice(0, 4)];
                }
            });
        });
    };
    return AIChatService;
}());
exports.AIChatService = AIChatService;
exports.aiChatService = new AIChatService();
