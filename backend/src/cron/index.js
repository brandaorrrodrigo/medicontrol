"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronService = exports.CronService = void 0;
var medication_reminders_cron_1 = require("./medication-reminders.cron");
var consultation_reminders_cron_1 = require("./consultation-reminders.cron");
var CronService = /** @class */ (function () {
    function CronService() {
    }
    // Iniciar todos os cron jobs
    CronService.prototype.startAll = function () {
        console.log('[CRON] Iniciando sistema de cron jobs...');
        medication_reminders_cron_1.medicationRemindersCron.start();
        consultation_reminders_cron_1.consultationRemindersCron.start();
        console.log('[CRON] Todos os cron jobs iniciados com sucesso');
    };
    // Parar todos os cron jobs
    CronService.prototype.stopAll = function () {
        console.log('[CRON] Parando sistema de cron jobs...');
        medication_reminders_cron_1.medicationRemindersCron.stop();
        consultation_reminders_cron_1.consultationRemindersCron.stop();
        console.log('[CRON] Todos os cron jobs parados');
    };
    return CronService;
}());
exports.CronService = CronService;
exports.cronService = new CronService();
