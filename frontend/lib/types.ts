// Tipos comuns do sistema MedicControl

export interface Patient {
  id: string
  name: string
  email: string
  phone?: string
  dateOfBirth: string
  age: number
  gender: 'M' | 'F' | 'O'
  bloodType?: string
  conditions?: string[]
  allergies?: string[]
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  createdAt: string
  updatedAt: string
}

export interface Medication {
  id: string
  patientId: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  instructions?: string
  prescribedBy?: string
  active: boolean
  createdAt: string
}

export interface MedicationReminder {
  id: string
  medicationId: string
  patientId: string
  medicationName: string
  dosage: string
  time: string
  frequency: string
  taken: boolean
  takenAt?: string
  nextDose?: string
}

export interface VitalSign {
  id: string
  patientId: string
  type: 'bloodPressure' | 'heartRate' | 'temperature' | 'oxygenSaturation' | 'glucose'
  value: string
  unit: string
  timestamp: string
  notes?: string
  recordedBy?: string
  status?: 'normal' | 'warning' | 'danger'
}

export interface Exam {
  id: string
  patientId: string
  name: string
  type: string
  date: string
  status: 'scheduled' | 'completed' | 'pending_results'
  result?: string
  resultFile?: string
  doctor?: string
  location?: string
  notes?: string
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'danger'
  timestamp: string
  read: boolean
  actionUrl?: string
}

export interface Caregiver {
  id: string
  name: string
  email: string
  phone?: string
  relationship?: string
  patients: Patient[]
  createdAt: string
}

export interface Professional {
  id: string
  name: string
  email: string
  specialty: string
  crm: string
  phone?: string
  patients: Patient[]
  createdAt: string
}

export interface PatientDashboardData {
  patient: Patient
  upcomingMedications: MedicationReminder[]
  recentVitalSigns: VitalSign[]
  recentExams: Exam[]
  notifications: Notification[]
}

export interface CaregiverDashboardData {
  caregiver: Caregiver
  patients: Patient[]
  upcomingMedications: MedicationReminder[]
  recentVitalSigns: VitalSign[]
  recentExams: Exam[]
  notifications: Notification[]
}

export interface ProfessionalDashboardData {
  professional: Professional
  patients: Patient[]
  upcomingAppointments: any[] // TODO: Definir tipo de consulta
  recentExams: Exam[]
  notifications: Notification[]
  stats: {
    totalPatients: number
    appointmentsToday: number
    pendingExams: number
  }
}
