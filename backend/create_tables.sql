-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PATIENT', 'CAREGIVER', 'PROFESSIONAL', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F', 'O');

-- CreateEnum
CREATE TYPE "VitalSignType" AS ENUM ('BLOOD_PRESSURE', 'HEART_RATE', 'TEMPERATURE', 'OXYGEN_SATURATION', 'GLUCOSE', 'WEIGHT', 'HEIGHT');

-- CreateEnum
CREATE TYPE "VitalSignStatus" AS ENUM ('NORMAL', 'WARNING', 'DANGER');

-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'PENDING_RESULTS', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExamSource" AS ENUM ('PDF', 'PHOTO', 'MANUAL', 'VOICE', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'WARNING', 'SUCCESS', 'DANGER');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('EXAM_ALERT', 'MEDICATION_REMINDER', 'APPOINTMENT', 'STOCK_ALERT', 'SYSTEM', 'HEALTH_INSIGHT');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'PUSH', 'SMS');

-- CreateEnum
CREATE TYPE "ExamAlertType" AS ENUM ('CRITICAL_VALUE', 'CONCERNING_TREND', 'OUT_OF_RANGE', 'RAPID_CHANGE', 'MULTIPLE_ABNORMAL');

-- CreateEnum
CREATE TYPE "ConsultationType" AS ENUM ('FIRST_VISIT', 'RETURN', 'EMERGENCY', 'ROUTINE', 'URGENT', 'FOLLOW_UP');

-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PhotoType" AS ENUM ('BEFORE', 'AFTER', 'PROGRESS');

-- CreateEnum
CREATE TYPE "MedicationPhotoType" AS ENUM ('MEDICATION_BOX', 'BOTTLE', 'LEAFLET', 'PRESCRIPTION');

-- CreateEnum
CREATE TYPE "MedicationAlertType" AS ENUM ('DOSE_TIME', 'DRUG_INTERACTION', 'FOOD_INTERACTION', 'STOCK_LOW', 'STOCK_CRITICAL', 'STOCK_LAST_UNIT', 'TREATMENT_ENDING');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "StockUnitType" AS ENUM ('PILL', 'TABLET', 'CAPSULE', 'ML', 'MG', 'G', 'DROP', 'SPRAY', 'PATCH', 'AMPULE', 'VIAL', 'UNIT');

-- CreateEnum
CREATE TYPE "SourceDocumentStatus" AS ENUM ('PENDING', 'PROCESSING', 'PROCESSED', 'ERROR');

-- CreateEnum
CREATE TYPE "ExtractedFactStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'APPLIED');

-- CreateEnum
CREATE TYPE "MedicalFactType" AS ENUM ('DESIRED_EFFECT', 'SIDE_EFFECT', 'SERIOUS_SIDE_EFFECT', 'DRUG_DRUG_INTERACTION', 'DRUG_FOOD_INTERACTION', 'ONSET_TIME', 'CONTRAINDICATION', 'DOSAGE_RECOMMENDATION');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "bloodType" TEXT,
    "conditions" TEXT[],
    "allergies" TEXT[],
    "emergencyContact" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caregiver" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "relationship" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Caregiver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientCaregiver" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "caregiverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientCaregiver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professional" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "crm" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientProfessional" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientProfessional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "instructions" TEXT,
    "prescribedBy" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationSchedule" (
    "id" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "taken" BOOLEAN NOT NULL DEFAULT false,
    "takenAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VitalSign" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "type" "VitalSignType" NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "status" "VitalSignStatus",
    "notes" TEXT,
    "recordedBy" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VitalSign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "ExamStatus" NOT NULL,
    "result" TEXT,
    "doctor" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "pdfUploaded" BOOLEAN NOT NULL DEFAULT false,
    "pdfPath" TEXT,
    "rawTextExtracted" TEXT,
    "extractionMethod" TEXT,
    "photoUploaded" BOOLEAN NOT NULL DEFAULT false,
    "photoPath" TEXT,
    "processedPhotoPath" TEXT,
    "ocrConfidence" DOUBLE PRECISION,
    "imageQuality" TEXT,
    "manualEntry" BOOLEAN NOT NULL DEFAULT false,
    "voiceEntry" BOOLEAN NOT NULL DEFAULT false,
    "source" "ExamSource",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamFile" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamResult" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "markerCode" TEXT NOT NULL,
    "markerName" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "interpretationText" TEXT,
    "referenceMin" DOUBLE PRECISION,
    "referenceMax" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION,
    "extractionMethod" TEXT,
    "rawTextSnippet" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "type" "PhotoType" NOT NULL,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "treatmentPhase" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationPhoto" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "prescriptionId" TEXT,
    "type" "MedicationPhotoType" NOT NULL,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "ocrText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "category" "NotificationCategory" NOT NULL DEFAULT 'SYSTEM',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "actionUrl" TEXT,
    "actionLabel" TEXT,
    "metadata" JSONB,
    "sentInApp" BOOLEAN NOT NULL DEFAULT true,
    "sentEmail" BOOLEAN NOT NULL DEFAULT false,
    "sentEmailAt" TIMESTAMP(3),
    "sentPush" BOOLEAN NOT NULL DEFAULT false,
    "sentPushAt" TIMESTAMP(3),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examAlertsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "examAlertsEmail" BOOLEAN NOT NULL DEFAULT true,
    "examAlertsPush" BOOLEAN NOT NULL DEFAULT true,
    "examAlertsCriticalOnly" BOOLEAN NOT NULL DEFAULT false,
    "medicationRemindersEnabled" BOOLEAN NOT NULL DEFAULT true,
    "medicationRemindersEmail" BOOLEAN NOT NULL DEFAULT false,
    "medicationRemindersPush" BOOLEAN NOT NULL DEFAULT true,
    "appointmentsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "appointmentsEmail" BOOLEAN NOT NULL DEFAULT true,
    "appointmentsPush" BOOLEAN NOT NULL DEFAULT true,
    "stockAlertsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "stockAlertsEmail" BOOLEAN NOT NULL DEFAULT false,
    "stockAlertsPush" BOOLEAN NOT NULL DEFAULT true,
    "healthInsightsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "healthInsightsEmail" BOOLEAN NOT NULL DEFAULT false,
    "healthInsightsPush" BOOLEAN NOT NULL DEFAULT false,
    "emailDigest" BOOLEAN NOT NULL DEFAULT false,
    "emailDigestTime" TEXT NOT NULL DEFAULT '08:00',
    "quietHoursEnabled" BOOLEAN NOT NULL DEFAULT false,
    "quietHoursStart" TEXT NOT NULL DEFAULT '22:00',
    "quietHoursEnd" TEXT NOT NULL DEFAULT '08:00',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamAlert" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "examId" TEXT,
    "markerCode" TEXT,
    "markerName" TEXT,
    "type" "ExamAlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "unit" TEXT,
    "referenceMin" DOUBLE PRECISION,
    "referenceMax" DOUBLE PRECISION,
    "trendDirection" TEXT,
    "trendSlope" DOUBLE PRECISION,
    "trendConfidence" DOUBLE PRECISION,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgedAt" TIMESTAMP(3),
    "acknowledgedBy" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "resolutionNotes" TEXT,
    "recommendedAction" TEXT,
    "actionUrl" TEXT,
    "notificationSent" BOOLEAN NOT NULL DEFAULT false,
    "notificationId" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailSentAt" TIMESTAMP(3),
    "metadata" JSONB,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "type" "ConsultationType" NOT NULL,
    "status" "ConsultationStatus" NOT NULL DEFAULT 'SCHEDULED',
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "diagnosis" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionItem" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "medicationId" TEXT,
    "medicationName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT,
    "instructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrescriptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreatmentAdherence" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalScheduled" INTEGER NOT NULL,
    "totalTaken" INTEGER NOT NULL,
    "adherenceRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TreatmentAdherence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationStock" (
    "id" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "currentQuantity" DOUBLE PRECISION NOT NULL,
    "initialQuantity" DOUBLE PRECISION NOT NULL,
    "unitType" "StockUnitType" NOT NULL,
    "lowStockThreshold" DOUBLE PRECISION NOT NULL DEFAULT 30,
    "criticalStockThreshold" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "lastRestockDate" TIMESTAMP(3),
    "nextRestockDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrugInteraction" (
    "id" TEXT NOT NULL,
    "drugA" TEXT NOT NULL,
    "drugB" TEXT NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "description" TEXT NOT NULL,
    "recommendation" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DrugInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrugFoodInteraction" (
    "id" TEXT NOT NULL,
    "drugName" TEXT NOT NULL,
    "foodName" TEXT NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "description" TEXT NOT NULL,
    "recommendation" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DrugFoodInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationAlert" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "medicationId" TEXT,
    "type" "MedicationAlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "metadata" JSONB,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalSourceDocument" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT,
    "year" INTEGER,
    "sourceType" TEXT NOT NULL DEFAULT 'ebook',
    "filePath" TEXT NOT NULL,
    "status" "SourceDocumentStatus" NOT NULL DEFAULT 'PENDING',
    "pagesCount" INTEGER,
    "notes" TEXT,
    "processingStartedAt" TIMESTAMP(3),
    "processingCompletedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalSourceDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtractedMedicalFact" (
    "id" TEXT NOT NULL,
    "sourceDocumentId" TEXT NOT NULL,
    "medicationName" TEXT NOT NULL,
    "factType" "MedicalFactType" NOT NULL,
    "otherMedicationName" TEXT,
    "foodKey" TEXT,
    "description" TEXT NOT NULL,
    "recommendation" TEXT,
    "severity" "AlertSeverity",
    "typicalOnsetHoursMin" INTEGER,
    "typicalOnsetHoursMax" INTEGER,
    "evidenceLevel" TEXT,
    "rawText" TEXT NOT NULL,
    "pageRange" TEXT,
    "status" "ExtractedFactStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "reviewNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExtractedMedicalFact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardConfig" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "widgets" JSONB NOT NULL,
    "layout" TEXT NOT NULL DEFAULT 'grid',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGamification" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "currentXP" INTEGER NOT NULL DEFAULT 0,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "totalDays" INTEGER NOT NULL DEFAULT 0,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGamification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_token_idx" ON "RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_token_key" ON "PasswordReset"("token");

-- CreateIndex
CREATE INDEX "PasswordReset_email_idx" ON "PasswordReset"("email");

-- CreateIndex
CREATE INDEX "PasswordReset_token_idx" ON "PasswordReset"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- CreateIndex
CREATE INDEX "Patient_userId_idx" ON "Patient"("userId");

-- CreateIndex
CREATE INDEX "Patient_name_idx" ON "Patient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Caregiver_userId_key" ON "Caregiver"("userId");

-- CreateIndex
CREATE INDEX "Caregiver_userId_idx" ON "Caregiver"("userId");

-- CreateIndex
CREATE INDEX "PatientCaregiver_patientId_idx" ON "PatientCaregiver"("patientId");

-- CreateIndex
CREATE INDEX "PatientCaregiver_caregiverId_idx" ON "PatientCaregiver"("caregiverId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientCaregiver_patientId_caregiverId_key" ON "PatientCaregiver"("patientId", "caregiverId");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_userId_key" ON "Professional"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_crm_key" ON "Professional"("crm");

-- CreateIndex
CREATE INDEX "Professional_userId_idx" ON "Professional"("userId");

-- CreateIndex
CREATE INDEX "Professional_crm_idx" ON "Professional"("crm");

-- CreateIndex
CREATE INDEX "PatientProfessional_patientId_idx" ON "PatientProfessional"("patientId");

-- CreateIndex
CREATE INDEX "PatientProfessional_professionalId_idx" ON "PatientProfessional"("professionalId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientProfessional_patientId_professionalId_key" ON "PatientProfessional"("patientId", "professionalId");

-- CreateIndex
CREATE INDEX "Medication_patientId_idx" ON "Medication"("patientId");

-- CreateIndex
CREATE INDEX "Medication_active_idx" ON "Medication"("active");

-- CreateIndex
CREATE INDEX "MedicationSchedule_medicationId_idx" ON "MedicationSchedule"("medicationId");

-- CreateIndex
CREATE INDEX "MedicationSchedule_patientId_idx" ON "MedicationSchedule"("patientId");

-- CreateIndex
CREATE INDEX "MedicationSchedule_scheduledFor_idx" ON "MedicationSchedule"("scheduledFor");

-- CreateIndex
CREATE INDEX "MedicationSchedule_taken_idx" ON "MedicationSchedule"("taken");

-- CreateIndex
CREATE INDEX "VitalSign_patientId_idx" ON "VitalSign"("patientId");

-- CreateIndex
CREATE INDEX "VitalSign_type_idx" ON "VitalSign"("type");

-- CreateIndex
CREATE INDEX "VitalSign_timestamp_idx" ON "VitalSign"("timestamp");

-- CreateIndex
CREATE INDEX "Exam_patientId_idx" ON "Exam"("patientId");

-- CreateIndex
CREATE INDEX "Exam_status_idx" ON "Exam"("status");

-- CreateIndex
CREATE INDEX "Exam_date_idx" ON "Exam"("date");

-- CreateIndex
CREATE INDEX "Exam_pdfUploaded_idx" ON "Exam"("pdfUploaded");

-- CreateIndex
CREATE INDEX "Exam_photoUploaded_idx" ON "Exam"("photoUploaded");

-- CreateIndex
CREATE INDEX "Exam_manualEntry_idx" ON "Exam"("manualEntry");

-- CreateIndex
CREATE INDEX "Exam_voiceEntry_idx" ON "Exam"("voiceEntry");

-- CreateIndex
CREATE INDEX "Exam_source_idx" ON "Exam"("source");

-- CreateIndex
CREATE INDEX "ExamFile_examId_idx" ON "ExamFile"("examId");

-- CreateIndex
CREATE INDEX "ExamResult_examId_idx" ON "ExamResult"("examId");

-- CreateIndex
CREATE INDEX "ExamResult_markerCode_idx" ON "ExamResult"("markerCode");

-- CreateIndex
CREATE INDEX "ExamResult_status_idx" ON "ExamResult"("status");

-- CreateIndex
CREATE INDEX "Photo_patientId_idx" ON "Photo"("patientId");

-- CreateIndex
CREATE INDEX "Photo_type_idx" ON "Photo"("type");

-- CreateIndex
CREATE INDEX "Photo_date_idx" ON "Photo"("date");

-- CreateIndex
CREATE INDEX "MedicationPhoto_patientId_idx" ON "MedicationPhoto"("patientId");

-- CreateIndex
CREATE INDEX "MedicationPhoto_medicationId_idx" ON "MedicationPhoto"("medicationId");

-- CreateIndex
CREATE INDEX "MedicationPhoto_prescriptionId_idx" ON "MedicationPhoto"("prescriptionId");

-- CreateIndex
CREATE INDEX "MedicationPhoto_type_idx" ON "MedicationPhoto"("type");

-- CreateIndex
CREATE INDEX "MedicationPhoto_takenAt_idx" ON "MedicationPhoto"("takenAt");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_category_idx" ON "Notification"("category");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_timestamp_idx" ON "Notification"("timestamp");

-- CreateIndex
CREATE INDEX "Notification_expiresAt_idx" ON "Notification"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "NotificationPreference_userId_idx" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "ExamAlert_patientId_idx" ON "ExamAlert"("patientId");

-- CreateIndex
CREATE INDEX "ExamAlert_examId_idx" ON "ExamAlert"("examId");

-- CreateIndex
CREATE INDEX "ExamAlert_markerCode_idx" ON "ExamAlert"("markerCode");

-- CreateIndex
CREATE INDEX "ExamAlert_type_idx" ON "ExamAlert"("type");

-- CreateIndex
CREATE INDEX "ExamAlert_severity_idx" ON "ExamAlert"("severity");

-- CreateIndex
CREATE INDEX "ExamAlert_acknowledged_idx" ON "ExamAlert"("acknowledged");

-- CreateIndex
CREATE INDEX "ExamAlert_resolved_idx" ON "ExamAlert"("resolved");

-- CreateIndex
CREATE INDEX "ExamAlert_triggeredAt_idx" ON "ExamAlert"("triggeredAt");

-- CreateIndex
CREATE INDEX "Consultation_patientId_idx" ON "Consultation"("patientId");

-- CreateIndex
CREATE INDEX "Consultation_professionalId_idx" ON "Consultation"("professionalId");

-- CreateIndex
CREATE INDEX "Consultation_date_idx" ON "Consultation"("date");

-- CreateIndex
CREATE INDEX "Consultation_status_idx" ON "Consultation"("status");

-- CreateIndex
CREATE INDEX "Prescription_patientId_idx" ON "Prescription"("patientId");

-- CreateIndex
CREATE INDEX "Prescription_professionalId_idx" ON "Prescription"("professionalId");

-- CreateIndex
CREATE INDEX "Prescription_date_idx" ON "Prescription"("date");

-- CreateIndex
CREATE INDEX "PrescriptionItem_prescriptionId_idx" ON "PrescriptionItem"("prescriptionId");

-- CreateIndex
CREATE INDEX "PrescriptionItem_medicationId_idx" ON "PrescriptionItem"("medicationId");

-- CreateIndex
CREATE INDEX "TreatmentAdherence_patientId_idx" ON "TreatmentAdherence"("patientId");

-- CreateIndex
CREATE INDEX "TreatmentAdherence_date_idx" ON "TreatmentAdherence"("date");

-- CreateIndex
CREATE UNIQUE INDEX "MedicationStock_medicationId_key" ON "MedicationStock"("medicationId");

-- CreateIndex
CREATE INDEX "MedicationStock_medicationId_idx" ON "MedicationStock"("medicationId");

-- CreateIndex
CREATE INDEX "MedicationStock_currentQuantity_idx" ON "MedicationStock"("currentQuantity");

-- CreateIndex
CREATE INDEX "DrugInteraction_drugA_idx" ON "DrugInteraction"("drugA");

-- CreateIndex
CREATE INDEX "DrugInteraction_drugB_idx" ON "DrugInteraction"("drugB");

-- CreateIndex
CREATE INDEX "DrugInteraction_severity_idx" ON "DrugInteraction"("severity");

-- CreateIndex
CREATE UNIQUE INDEX "DrugInteraction_drugA_drugB_key" ON "DrugInteraction"("drugA", "drugB");

-- CreateIndex
CREATE INDEX "DrugFoodInteraction_drugName_idx" ON "DrugFoodInteraction"("drugName");

-- CreateIndex
CREATE INDEX "DrugFoodInteraction_foodName_idx" ON "DrugFoodInteraction"("foodName");

-- CreateIndex
CREATE INDEX "DrugFoodInteraction_severity_idx" ON "DrugFoodInteraction"("severity");

-- CreateIndex
CREATE UNIQUE INDEX "DrugFoodInteraction_drugName_foodName_key" ON "DrugFoodInteraction"("drugName", "foodName");

-- CreateIndex
CREATE INDEX "MedicationAlert_patientId_idx" ON "MedicationAlert"("patientId");

-- CreateIndex
CREATE INDEX "MedicationAlert_medicationId_idx" ON "MedicationAlert"("medicationId");

-- CreateIndex
CREATE INDEX "MedicationAlert_type_idx" ON "MedicationAlert"("type");

-- CreateIndex
CREATE INDEX "MedicationAlert_severity_idx" ON "MedicationAlert"("severity");

-- CreateIndex
CREATE INDEX "MedicationAlert_read_idx" ON "MedicationAlert"("read");

-- CreateIndex
CREATE INDEX "MedicationAlert_resolved_idx" ON "MedicationAlert"("resolved");

-- CreateIndex
CREATE INDEX "MedicationAlert_triggeredAt_idx" ON "MedicationAlert"("triggeredAt");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalSourceDocument_filePath_key" ON "MedicalSourceDocument"("filePath");

-- CreateIndex
CREATE INDEX "MedicalSourceDocument_status_idx" ON "MedicalSourceDocument"("status");

-- CreateIndex
CREATE INDEX "MedicalSourceDocument_sourceType_idx" ON "MedicalSourceDocument"("sourceType");

-- CreateIndex
CREATE INDEX "MedicalSourceDocument_createdAt_idx" ON "MedicalSourceDocument"("createdAt");

-- CreateIndex
CREATE INDEX "ExtractedMedicalFact_sourceDocumentId_idx" ON "ExtractedMedicalFact"("sourceDocumentId");

-- CreateIndex
CREATE INDEX "ExtractedMedicalFact_medicationName_idx" ON "ExtractedMedicalFact"("medicationName");

-- CreateIndex
CREATE INDEX "ExtractedMedicalFact_factType_idx" ON "ExtractedMedicalFact"("factType");

-- CreateIndex
CREATE INDEX "ExtractedMedicalFact_status_idx" ON "ExtractedMedicalFact"("status");

-- CreateIndex
CREATE INDEX "ExtractedMedicalFact_createdAt_idx" ON "ExtractedMedicalFact"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardConfig_patientId_key" ON "DashboardConfig"("patientId");

-- CreateIndex
CREATE INDEX "DashboardConfig_patientId_idx" ON "DashboardConfig"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "UserGamification_patientId_key" ON "UserGamification"("patientId");

-- CreateIndex
CREATE INDEX "UserGamification_patientId_idx" ON "UserGamification"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_title_key" ON "Achievement"("title");

-- CreateIndex
CREATE INDEX "Achievement_category_idx" ON "Achievement"("category");

-- CreateIndex
CREATE INDEX "Achievement_rarity_idx" ON "Achievement"("rarity");

-- CreateIndex
CREATE INDEX "UserAchievement_patientId_idx" ON "UserAchievement"("patientId");

-- CreateIndex
CREATE INDEX "UserAchievement_achievementId_idx" ON "UserAchievement"("achievementId");

-- CreateIndex
CREATE INDEX "UserAchievement_unlocked_idx" ON "UserAchievement"("unlocked");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_patientId_achievementId_key" ON "UserAchievement"("patientId", "achievementId");

-- CreateIndex
CREATE INDEX "ActivityLog_patientId_date_idx" ON "ActivityLog"("patientId", "date");

-- CreateIndex
CREATE INDEX "ActivityLog_type_idx" ON "ActivityLog"("type");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caregiver" ADD CONSTRAINT "Caregiver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientCaregiver" ADD CONSTRAINT "PatientCaregiver_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientCaregiver" ADD CONSTRAINT "PatientCaregiver_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "Caregiver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientProfessional" ADD CONSTRAINT "PatientProfessional_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientProfessional" ADD CONSTRAINT "PatientProfessional_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationSchedule" ADD CONSTRAINT "MedicationSchedule_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationSchedule" ADD CONSTRAINT "MedicationSchedule_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VitalSign" ADD CONSTRAINT "VitalSign_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamFile" ADD CONSTRAINT "ExamFile_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationPhoto" ADD CONSTRAINT "MedicationPhoto_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationPhoto" ADD CONSTRAINT "MedicationPhoto_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationPhoto" ADD CONSTRAINT "MedicationPhoto_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAlert" ADD CONSTRAINT "ExamAlert_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAlert" ADD CONSTRAINT "ExamAlert_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionItem" ADD CONSTRAINT "PrescriptionItem_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionItem" ADD CONSTRAINT "PrescriptionItem_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentAdherence" ADD CONSTRAINT "TreatmentAdherence_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationStock" ADD CONSTRAINT "MedicationStock_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationAlert" ADD CONSTRAINT "MedicationAlert_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationAlert" ADD CONSTRAINT "MedicationAlert_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedMedicalFact" ADD CONSTRAINT "ExtractedMedicalFact_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "MedicalSourceDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardConfig" ADD CONSTRAINT "DashboardConfig_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGamification" ADD CONSTRAINT "UserGamification_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

