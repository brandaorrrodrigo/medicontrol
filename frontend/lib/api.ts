import {
  PatientDashboardData,
  CaregiverDashboardData,
  ProfessionalDashboardData,
  Patient,
  Medication,
  VitalSign,
  Exam,
  Notification,
} from './types'
import { useAuthStore } from '../store/auth.store'
import { authService } from '../services/auth.service'

// Base URL da API - ajustar conforme o ambiente
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Helper para fazer requisições com tratamento de erros e autenticação
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const token = useAuthStore.getState().accessToken

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      credentials: 'include', // Para incluir cookies (refresh token)
      ...options,
    })

    // Se receber 401, tentar renovar o token
    if (response.status === 401) {
      const newToken = await authService.refreshToken()

      if (newToken) {
        // Tentar novamente com o novo token
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`,
            ...options?.headers,
          },
          credentials: 'include',
          ...options,
        })

        if (!retryResponse.ok) {
          throw new Error(`API Error: ${retryResponse.status} ${retryResponse.statusText}`)
        }

        const data = await retryResponse.json()
        return data.data || data
      } else {
        // Se não conseguir renovar, redirecionar para login
        throw new Error('Session expired')
      }
    }

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || `API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    // A API retorna { success: true, data: {...} }, então extraímos data
    return data.data || data
  } catch (error) {
    console.error('API Request failed:', error)
    throw error
  }
}

// ============================================================================
// PATIENT APIs
// ============================================================================

/**
 * Busca dados do dashboard do paciente
 */
export async function getPatientDashboardData(): Promise<PatientDashboardData> {
  return await fetchAPI<PatientDashboardData>('/dashboard/patient')
}

// ============================================================================
// CAREGIVER APIs
// ============================================================================

/**
 * Busca dados do dashboard do cuidador
 */
export async function getCaregiverDashboardData(): Promise<CaregiverDashboardData> {
  return await fetchAPI<CaregiverDashboardData>('/dashboard/caregiver')
}

// ============================================================================
// PROFESSIONAL APIs
// ============================================================================

/**
 * Busca dados do dashboard do profissional de saúde
 */
export async function getProfessionalDashboardData(): Promise<ProfessionalDashboardData> {
  return await fetchAPI<ProfessionalDashboardData>('/dashboard/professional')
}

// ============================================================================
// GENERIC APIs
// ============================================================================

/**
 * Marca um medicamento como tomado
 */
export async function markMedicationAsTaken(reminderId: string, notes?: string): Promise<void> {
  await fetchAPI(`/reminders/${reminderId}/mark-taken`, {
    method: 'POST',
    body: JSON.stringify({ notes }),
  })
}

/**
 * Marca uma notificação como lida
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await fetchAPI(`/notifications/${notificationId}/read`, {
    method: 'POST',
  })
}

/**
 * Marca todas as notificações como lidas
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  await fetchAPI('/notifications/read-all', {
    method: 'POST',
  })
}

// ============================================================================
// MEDICATIONS APIs
// ============================================================================

/**
 * Busca todos os medicamentos do paciente
 */
export async function getMedications(active?: boolean): Promise<Medication[]> {
  const params = active !== undefined ? `?active=${active}` : ''
  return await fetchAPI<Medication[]>(`/medications${params}`)
}

/**
 * Busca um medicamento específico
 */
export async function getMedication(id: string): Promise<Medication> {
  return await fetchAPI<Medication>(`/medications/${id}`)
}

/**
 * Cria um novo medicamento
 */
export async function createMedication(data: Partial<Medication>): Promise<Medication> {
  return await fetchAPI<Medication>('/medications', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Atualiza um medicamento
 */
export async function updateMedication(id: string, data: Partial<Medication>): Promise<Medication> {
  return await fetchAPI<Medication>(`/medications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Deleta (soft delete) um medicamento
 */
export async function deleteMedication(id: string): Promise<void> {
  await fetchAPI(`/medications/${id}`, {
    method: 'DELETE',
  })
}

// ============================================================================
// PATIENTS APIs
// ============================================================================

/**
 * Atualiza os dados do perfil do paciente
 */
export async function updatePatientProfile(patientId: string, data: Partial<Patient>): Promise<Patient> {
  return await fetchAPI<Patient>(`/patients/${patientId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ============================================================================
// VITAL SIGNS APIs
// ============================================================================

/**
 * Busca todos os sinais vitais do paciente
 */
export async function getVitalSigns(): Promise<VitalSign[]> {
  return await fetchAPI<VitalSign[]>('/vitals')
}

/**
 * Busca estatísticas dos sinais vitais
 */
export async function getVitalSignsStats(): Promise<any> {
  return await fetchAPI('/vitals/stats')
}

/**
 * Cria um novo registro de sinal vital
 */
export async function createVitalSign(data: Partial<VitalSign>): Promise<VitalSign> {
  return await fetchAPI<VitalSign>('/vitals', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Deleta um registro de sinal vital
 */
export async function deleteVitalSign(id: string): Promise<void> {
  await fetchAPI(`/vitals/${id}`, {
    method: 'DELETE',
  })
}

// ============================================================================
// EXAMS APIs
// ============================================================================

/**
 * Busca todos os exames do paciente
 */
export async function getExams(): Promise<Exam[]> {
  return await fetchAPI<Exam[]>('/exams')
}

/**
 * Busca um exame específico
 */
export async function getExam(id: string): Promise<Exam> {
  return await fetchAPI<Exam>(`/exams/${id}`)
}

/**
 * Cria um novo exame
 */
export async function createExam(data: Partial<Exam>): Promise<Exam> {
  return await fetchAPI<Exam>('/exams', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Atualiza um exame
 */
export async function updateExam(id: string, data: Partial<Exam>): Promise<Exam> {
  return await fetchAPI<Exam>(`/exams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Deleta um exame
 */
export async function deleteExam(id: string): Promise<void> {
  await fetchAPI(`/exams/${id}`, {
    method: 'DELETE',
  })
}

/**
 * Faz upload de arquivo de exame
 */
export async function uploadExamFile(examId: string, file: File): Promise<any> {
  const formData = new FormData()
  formData.append('file', file)

  const token = useAuthStore.getState().accessToken
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams/${examId}/upload`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Erro ao fazer upload do arquivo')
  }

  const data = await response.json()
  return data.data || data
}

// ============================================================================
// PHOTOS APIs
// ============================================================================

/**
 * Busca todas as fotos do paciente
 */
export async function getPhotos(): Promise<any[]> {
  return await fetchAPI<any[]>('/photos')
}

/**
 * Faz upload de uma foto
 */
export async function uploadPhoto(file: File, type: string, notes?: string): Promise<any> {
  const formData = new FormData()
  formData.append('photo', file)
  formData.append('type', type)
  if (notes) formData.append('notes', notes)

  const token = useAuthStore.getState().accessToken
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/photos`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Erro ao fazer upload da foto')
  }

  const data = await response.json()
  return data.data || data
}

/**
 * Deleta uma foto
 */
export async function deletePhoto(id: string): Promise<void> {
  await fetchAPI(`/photos/${id}`, {
    method: 'DELETE',
  })
}

/**
 * Busca fotos para comparação
 */
export async function getPhotosComparison(): Promise<any> {
  return await fetchAPI('/photos/compare')
}

// ============================================================================
// CONSULTATIONS APIs
// ============================================================================

/**
 * Busca todas as consultas do paciente
 */
export async function getConsultations(): Promise<any[]> {
  return await fetchAPI<any[]>('/consultations')
}

/**
 * Busca uma consulta específica
 */
export async function getConsultation(id: string): Promise<any> {
  return await fetchAPI(`/consultations/${id}`)
}

/**
 * Cria uma nova consulta
 */
export async function createConsultation(data: any): Promise<any> {
  return await fetchAPI('/consultations', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Atualiza uma consulta
 */
export async function updateConsultation(id: string, data: any): Promise<any> {
  return await fetchAPI(`/consultations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Deleta uma consulta
 */
export async function deleteConsultation(id: string): Promise<void> {
  await fetchAPI(`/consultations/${id}`, {
    method: 'DELETE',
  })
}

// ============================================================================
// PRESCRIPTIONS APIs
// ============================================================================

/**
 * Busca todas as prescrições do paciente
 */
export async function getPrescriptions(): Promise<any[]> {
  return await fetchAPI<any[]>('/prescriptions')
}

/**
 * Busca uma prescrição específica
 */
export async function getPrescription(id: string): Promise<any> {
  return await fetchAPI(`/prescriptions/${id}`)
}

/**
 * Cria uma nova prescrição
 */
export async function createPrescription(data: any): Promise<any> {
  return await fetchAPI('/prescriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Deleta uma prescrição
 */
export async function deletePrescription(id: string): Promise<void> {
  await fetchAPI(`/prescriptions/${id}`, {
    method: 'DELETE',
  })
}

// ============================================================================
// MEDICATION PHOTOS APIs
// ============================================================================

/**
 * Busca fotos de um medicamento
 */
export async function getMedicationPhotos(medicationId: string, type?: string): Promise<any[]> {
  const params = type ? `?type=${type}` : ''
  return await fetchAPI<any[]>(`/medications/${medicationId}/photos${params}`)
}

/**
 * Busca uma foto específica de medicamento
 */
export async function getMedicationPhoto(photoId: string): Promise<any> {
  return await fetchAPI(`/medications/photos/${photoId}`)
}

/**
 * Faz upload de uma foto de medicamento
 */
export async function uploadMedicationPhoto(
  medicationId: string,
  file: File,
  data: {
    type: string
    prescriptionId?: string
    notes?: string
    takenAt?: string
  }
): Promise<any> {
  const token = useAuthStore.getState().accessToken

  const formData = new FormData()
  formData.append('photo', file)
  formData.append('type', data.type)
  if (data.prescriptionId) formData.append('prescriptionId', data.prescriptionId)
  if (data.notes) formData.append('notes', data.notes)
  if (data.takenAt) formData.append('takenAt', data.takenAt)

  const response = await fetch(
    `${API_BASE_URL}/medications/${medicationId}/photos`,
    {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
      body: formData,
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao fazer upload da foto')
  }

  const result = await response.json()
  return result.data || result
}

/**
 * Atualiza metadados de uma foto de medicamento
 */
export async function updateMedicationPhoto(
  photoId: string,
  data: {
    type?: string
    notes?: string
    ocrText?: string
  }
): Promise<any> {
  return await fetchAPI(`/medications/photos/${photoId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Deleta uma foto de medicamento
 */
export async function deleteMedicationPhoto(photoId: string): Promise<void> {
  await fetchAPI(`/medications/photos/${photoId}`, {
    method: 'DELETE',
  })
}

/**
 * Busca todas as fotos de medicamentos de um paciente
 */
export async function getPatientMedicationPhotos(patientId: string, type?: string): Promise<any[]> {
  const params = type ? `?type=${type}` : ''
  return await fetchAPI<any[]>(`/patients/${patientId}/medication-photos${params}`)
}
