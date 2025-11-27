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
var client_1 = require("@prisma/client");
var bcrypt_1 = require("bcrypt");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, patient1User, patient2User, caregiverUser, professionalUser, medication1, medication2, now;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Seeding database...');
                    return [4 /*yield*/, bcrypt_1.default.hash('password123', 10)
                        // ============================================================================
                        // CRIAR USUÁRIOS E PACIENTES
                        // ============================================================================
                    ];
                case 1:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'joao.silva@email.com',
                                password: hashedPassword,
                                role: client_1.UserRole.PATIENT,
                                patient: {
                                    create: {
                                        name: 'João Silva',
                                        phone: '(11) 98765-4321',
                                        dateOfBirth: new Date('1980-05-15'),
                                        gender: client_1.Gender.M,
                                        bloodType: 'O+',
                                        conditions: ['Hipertensão', 'Diabetes Tipo 2'],
                                        allergies: ['Penicilina'],
                                        emergencyContact: {
                                            name: 'Maria Silva',
                                            phone: '(11) 98765-1234',
                                            relationship: 'Esposa',
                                        },
                                    },
                                },
                            },
                            include: { patient: true },
                        })];
                case 2:
                    patient1User = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'jose.costa@email.com',
                                password: hashedPassword,
                                role: client_1.UserRole.PATIENT,
                                patient: {
                                    create: {
                                        name: 'José Costa',
                                        phone: '(11) 91234-5678',
                                        dateOfBirth: new Date('1955-03-20'),
                                        gender: client_1.Gender.M,
                                        bloodType: 'A+',
                                        conditions: ['Alzheimer', 'Hipertensão'],
                                        allergies: [],
                                    },
                                },
                            },
                            include: { patient: true },
                        })
                        // ============================================================================
                        // CRIAR CUIDADOR
                        // ============================================================================
                    ];
                case 3:
                    patient2User = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'ana.costa@email.com',
                                password: hashedPassword,
                                role: client_1.UserRole.CAREGIVER,
                                caregiver: {
                                    create: {
                                        name: 'Ana Costa',
                                        phone: '(11) 91234-5678',
                                        relationship: 'Filha',
                                    },
                                },
                            },
                            include: { caregiver: true },
                        })
                        // Vincular cuidador aos pacientes
                    ];
                case 4:
                    caregiverUser = _a.sent();
                    // Vincular cuidador aos pacientes
                    return [4 /*yield*/, prisma.patientCaregiver.createMany({
                            data: [
                                {
                                    patientId: patient1User.patient.id,
                                    caregiverId: caregiverUser.caregiver.id,
                                },
                                {
                                    patientId: patient2User.patient.id,
                                    caregiverId: caregiverUser.caregiver.id,
                                },
                            ],
                        })
                        // ============================================================================
                        // CRIAR PROFISSIONAL
                        // ============================================================================
                    ];
                case 5:
                    // Vincular cuidador aos pacientes
                    _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'carla.mendes@hospital.com',
                                password: hashedPassword,
                                role: client_1.UserRole.PROFESSIONAL,
                                professional: {
                                    create: {
                                        name: 'Dra. Carla Mendes',
                                        specialty: 'Cardiologia',
                                        crm: '123456-SP',
                                        phone: '(11) 3456-7890',
                                    },
                                },
                            },
                            include: { professional: true },
                        })
                        // Vincular profissional aos pacientes
                    ];
                case 6:
                    professionalUser = _a.sent();
                    // Vincular profissional aos pacientes
                    return [4 /*yield*/, prisma.patientProfessional.createMany({
                            data: [
                                {
                                    patientId: patient1User.patient.id,
                                    professionalId: professionalUser.professional.id,
                                },
                                {
                                    patientId: patient2User.patient.id,
                                    professionalId: professionalUser.professional.id,
                                },
                            ],
                        })
                        // ============================================================================
                        // CRIAR MEDICAMENTOS
                        // ============================================================================
                    ];
                case 7:
                    // Vincular profissional aos pacientes
                    _a.sent();
                    return [4 /*yield*/, prisma.medication.create({
                            data: {
                                patientId: patient1User.patient.id,
                                name: 'Losartana',
                                dosage: '50mg',
                                frequency: '1x ao dia',
                                startDate: new Date('2024-01-01'),
                                instructions: 'Tomar pela manhã, em jejum',
                                prescribedBy: 'Dra. Carla Mendes',
                                active: true,
                            },
                        })];
                case 8:
                    medication1 = _a.sent();
                    return [4 /*yield*/, prisma.medication.create({
                            data: {
                                patientId: patient1User.patient.id,
                                name: 'Metformina',
                                dosage: '850mg',
                                frequency: '2x ao dia',
                                startDate: new Date('2024-01-01'),
                                instructions: 'Tomar após as refeições',
                                prescribedBy: 'Dra. Carla Mendes',
                                active: true,
                            },
                        })
                        // Criar lembretes de medicamentos
                    ];
                case 9:
                    medication2 = _a.sent();
                    now = new Date();
                    return [4 /*yield*/, prisma.medicationSchedule.createMany({
                            data: [
                                {
                                    medicationId: medication1.id,
                                    patientId: patient1User.patient.id,
                                    scheduledFor: new Date(now.getTime() + 3600000), // +1 hora
                                    taken: false,
                                },
                                {
                                    medicationId: medication2.id,
                                    patientId: patient1User.patient.id,
                                    scheduledFor: new Date(now.getTime() + 7200000), // +2 horas
                                    taken: false,
                                },
                            ],
                        })
                        // ============================================================================
                        // CRIAR SINAIS VITAIS
                        // ============================================================================
                    ];
                case 10:
                    _a.sent();
                    // ============================================================================
                    // CRIAR SINAIS VITAIS
                    // ============================================================================
                    return [4 /*yield*/, prisma.vitalSign.createMany({
                            data: [
                                {
                                    patientId: patient1User.patient.id,
                                    type: client_1.VitalSignType.BLOOD_PRESSURE,
                                    value: '120/80',
                                    unit: 'mmHg',
                                    status: client_1.VitalSignStatus.NORMAL,
                                    timestamp: new Date(now.getTime() - 3600000),
                                },
                                {
                                    patientId: patient1User.patient.id,
                                    type: client_1.VitalSignType.GLUCOSE,
                                    value: '110',
                                    unit: 'mg/dL',
                                    status: client_1.VitalSignStatus.NORMAL,
                                    timestamp: new Date(now.getTime() - 7200000),
                                },
                                {
                                    patientId: patient1User.patient.id,
                                    type: client_1.VitalSignType.HEART_RATE,
                                    value: '72',
                                    unit: 'bpm',
                                    status: client_1.VitalSignStatus.NORMAL,
                                    timestamp: new Date(now.getTime() - 3600000),
                                },
                            ],
                        })
                        // ============================================================================
                        // CRIAR EXAMES
                        // ============================================================================
                    ];
                case 11:
                    // ============================================================================
                    // CRIAR SINAIS VITAIS
                    // ============================================================================
                    _a.sent();
                    // ============================================================================
                    // CRIAR EXAMES
                    // ============================================================================
                    return [4 /*yield*/, prisma.exam.createMany({
                            data: [
                                {
                                    patientId: patient1User.patient.id,
                                    name: 'Hemograma Completo',
                                    type: 'Exame de Sangue',
                                    date: new Date(now.getTime() - 86400000),
                                    status: client_1.ExamStatus.COMPLETED,
                                    result: 'Normal - sem alterações',
                                    doctor: 'Dra. Carla Mendes',
                                },
                                {
                                    patientId: patient1User.patient.id,
                                    name: 'Ecocardiograma',
                                    type: 'Exame Cardíaco',
                                    date: new Date(now.getTime() + 604800000), // +7 dias
                                    status: client_1.ExamStatus.SCHEDULED,
                                    doctor: 'Dra. Carla Mendes',
                                },
                            ],
                        })
                        // ============================================================================
                        // CRIAR NOTIFICAÇÕES
                        // ============================================================================
                    ];
                case 12:
                    // ============================================================================
                    // CRIAR EXAMES
                    // ============================================================================
                    _a.sent();
                    // ============================================================================
                    // CRIAR NOTIFICAÇÕES
                    // ============================================================================
                    return [4 /*yield*/, prisma.notification.createMany({
                            data: [
                                {
                                    userId: patient1User.id,
                                    title: 'Lembrete de Medicamento',
                                    message: 'Não esqueça de tomar Losartana às 14:00',
                                    type: client_1.NotificationType.INFO,
                                    read: false,
                                    timestamp: new Date(now.getTime() - 1800000),
                                },
                                {
                                    userId: patient1User.id,
                                    title: 'Exame Agendado',
                                    message: 'Ecocardiograma agendado para próxima semana',
                                    type: client_1.NotificationType.SUCCESS,
                                    read: false,
                                    timestamp: new Date(now.getTime() - 3600000),
                                },
                                {
                                    userId: caregiverUser.id,
                                    title: 'Lembrete de Medicamento',
                                    message: 'Losartana para João Silva em 1 hora',
                                    type: client_1.NotificationType.INFO,
                                    read: false,
                                    timestamp: new Date(now.getTime() - 900000),
                                },
                            ],
                        })
                        // ============================================================================
                        // CRIAR CONSULTA
                        // ============================================================================
                    ];
                case 13:
                    // ============================================================================
                    // CRIAR NOTIFICAÇÕES
                    // ============================================================================
                    _a.sent();
                    // ============================================================================
                    // CRIAR CONSULTA
                    // ============================================================================
                    return [4 /*yield*/, prisma.consultation.create({
                            data: {
                                patientId: patient1User.patient.id,
                                professionalId: professionalUser.professional.id,
                                type: 'ROUTINE',
                                date: new Date(now.getTime() + 7200000), // +2 horas
                                duration: 30,
                                notes: 'Consulta de rotina',
                            },
                        })];
                case 14:
                    // ============================================================================
                    // CRIAR CONSULTA
                    // ============================================================================
                    _a.sent();
                    console.log('✅ Database seeded successfully!');
                    console.log('\n📧 Test users created:');
                    console.log('- Patient: joao.silva@email.com / password123');
                    console.log('- Patient: jose.costa@email.com / password123');
                    console.log('- Caregiver: ana.costa@email.com / password123');
                    console.log('- Professional: carla.mendes@hospital.com / password123');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
