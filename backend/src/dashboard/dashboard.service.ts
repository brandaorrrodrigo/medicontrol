import { prisma } from '../database/prisma'

export class DashboardService {
  // ============================================================================
  // PATIENT DASHBOARD
  // ============================================================================

  async getPatientDashboard(userId: string) {
    // Buscar paciente
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patient: {
          include: {
            medications: {
              where: { active: true },
              include: {
                schedules: {
                  where: {
                    scheduledFor: {
                      gte: new Date(),
                    },
                    taken: false,
                  },
                  orderBy: { scheduledFor: 'asc' },
                  take: 5,
                },
              },
            },
            vitalSigns: {
              orderBy: { timestamp: 'desc' },
              take: 5,
            },
            exams: {
              orderBy: { date: 'desc' },
              take: 5,
            },
          },
        },
        notifications: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    })

    if (!user || !user.patient) {
      throw new Error('Paciente não encontrado')
    }

    const patient = user.patient

    // Calcular idade
    const age = this.calculateAge(patient.dateOfBirth)

    // Formattar próximos medicamentos
    const upcomingMedications = patient.medications
      .flatMap((med) =>
        med.schedules.map((schedule) => ({
          id: schedule.id,
          medicationId: med.id,
          patientId: patient.id,
          medicationName: med.name,
          dosage: med.dosage,
          time: schedule.scheduledFor.toISOString(),
          frequency: med.frequency,
          taken: schedule.taken,
          takenAt: schedule.takenAt?.toISOString(),
          nextDose: this.getNextDose(med.frequency, schedule.scheduledFor),
        }))
      )
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      .slice(0, 5)

    return {
      patient: {
        id: patient.id,
        name: patient.name,
        email: user.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth.toISOString(),
        age,
        gender: patient.gender,
        bloodType: patient.bloodType,
        conditions: patient.conditions,
        allergies: patient.allergies,
        emergencyContact: patient.emergencyContact as any,
        createdAt: patient.createdAt.toISOString(),
        updatedAt: patient.updatedAt.toISOString(),
      },
      upcomingMedications,
      recentVitalSigns: patient.vitalSigns.map((vital) => ({
        id: vital.id,
        patientId: vital.patientId,
        type: vital.type,
        value: vital.value,
        unit: vital.unit,
        timestamp: vital.timestamp.toISOString(),
        status: vital.status,
        notes: vital.notes,
      })),
      recentExams: patient.exams.map((exam) => ({
        id: exam.id,
        patientId: exam.patientId,
        name: exam.name,
        type: exam.type,
        date: exam.date.toISOString(),
        status: exam.status,
        result: exam.result,
        doctor: exam.doctor,
        createdAt: exam.createdAt.toISOString(),
      })),
      notifications: user.notifications.map((notif) => ({
        id: notif.id,
        userId: notif.userId,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        timestamp: notif.timestamp.toISOString(),
        read: notif.read,
        actionUrl: notif.actionUrl,
      })),
    }
  }

  // ============================================================================
  // CAREGIVER DASHBOARD
  // ============================================================================

  async getCaregiverDashboard(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        caregiver: {
          include: {
            patients: {
              include: {
                patient: {
                  include: {
                    medications: {
                      where: { active: true },
                      include: {
                        schedules: {
                          where: {
                            scheduledFor: {
                              gte: new Date(),
                            },
                            taken: false,
                          },
                          orderBy: { scheduledFor: 'asc' },
                          take: 3,
                        },
                      },
                    },
                    vitalSigns: {
                      orderBy: { timestamp: 'desc' },
                      take: 3,
                    },
                    exams: {
                      orderBy: { date: 'desc' },
                      take: 3,
                    },
                  },
                },
              },
            },
          },
        },
        notifications: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    })

    if (!user || !user.caregiver) {
      throw new Error('Cuidador não encontrado')
    }

    const caregiver = user.caregiver

    // Agregar dados de todos os pacientes
    const patients = caregiver.patients.map((pc) => {
      const patient = pc.patient
      const age = this.calculateAge(patient.dateOfBirth)

      return {
        id: patient.id,
        name: patient.name,
        email: '', // Privacidade
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth.toISOString(),
        age,
        gender: patient.gender,
        bloodType: patient.bloodType,
        conditions: patient.conditions,
        allergies: patient.allergies,
        createdAt: patient.createdAt.toISOString(),
        updatedAt: patient.updatedAt.toISOString(),
      }
    })

    // Próximos medicamentos de todos os pacientes
    const upcomingMedications = caregiver.patients
      .flatMap((pc) =>
        pc.patient.medications.flatMap((med) =>
          med.schedules.map((schedule) => ({
            id: schedule.id,
            medicationId: med.id,
            patientId: pc.patient.id,
            medicationName: med.name,
            dosage: med.dosage,
            time: schedule.scheduledFor.toISOString(),
            frequency: med.frequency,
            taken: schedule.taken,
            takenAt: schedule.takenAt?.toISOString(),
            nextDose: this.getNextDose(med.frequency, schedule.scheduledFor),
          }))
        )
      )
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      .slice(0, 10)

    // Sinais vitais recentes de todos os pacientes
    const recentVitalSigns = caregiver.patients
      .flatMap((pc) =>
        pc.patient.vitalSigns.map((vital) => ({
          id: vital.id,
          patientId: vital.patientId,
          type: vital.type,
          value: vital.value,
          unit: vital.unit,
          timestamp: vital.timestamp.toISOString(),
          status: vital.status,
        }))
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    // Exames recentes
    const recentExams = caregiver.patients
      .flatMap((pc) =>
        pc.patient.exams.map((exam) => ({
          id: exam.id,
          patientId: exam.patientId,
          name: exam.name,
          type: exam.type,
          date: exam.date.toISOString(),
          status: exam.status,
          result: exam.result,
          doctor: exam.doctor,
          createdAt: exam.createdAt.toISOString(),
        }))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)

    return {
      caregiver: {
        id: caregiver.id,
        name: caregiver.name,
        email: user.email,
        phone: caregiver.phone,
        relationship: caregiver.relationship,
        patients: [], // Será preenchido abaixo
        createdAt: caregiver.createdAt.toISOString(),
      },
      patients,
      upcomingMedications,
      recentVitalSigns,
      recentExams,
      notifications: user.notifications.map((notif) => ({
        id: notif.id,
        userId: notif.userId,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        timestamp: notif.timestamp.toISOString(),
        read: notif.read,
        actionUrl: notif.actionUrl,
      })),
    }
  }

  // ============================================================================
  // PROFESSIONAL DASHBOARD
  // ============================================================================

  async getProfessionalDashboard(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        professional: {
          include: {
            patients: {
              include: {
                patient: true,
              },
            },
            consultations: {
              where: {
                date: {
                  gte: new Date(),
                },
              },
              orderBy: { date: 'asc' },
              take: 10,
              include: {
                patient: true,
              },
            },
          },
        },
        notifications: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    })

    if (!user || !user.professional) {
      throw new Error('Profissional não encontrado')
    }

    const professional = user.professional

    // Pacientes
    const patients = professional.patients.map((pp) => {
      const patient = pp.patient
      const age = this.calculateAge(patient.dateOfBirth)

      return {
        id: patient.id,
        name: patient.name,
        email: '', // Privacidade
        dateOfBirth: patient.dateOfBirth.toISOString(),
        age,
        gender: patient.gender,
        bloodType: patient.bloodType,
        conditions: patient.conditions,
        createdAt: patient.createdAt.toISOString(),
        updatedAt: patient.updatedAt.toISOString(),
      }
    })

    // Próximas consultas
    const upcomingAppointments = professional.consultations.map((consultation) => ({
      id: consultation.id,
      patientId: consultation.patientId,
      patientName: consultation.patient.name,
      date: consultation.date.toISOString(),
      type: consultation.type,
      duration: consultation.duration,
    }))

    // Buscar exames recentes dos pacientes do profissional
    const patientIds = professional.patients.map((pp) => pp.patientId)
    const recentExams = await prisma.exam.findMany({
      where: {
        patientId: { in: patientIds },
      },
      orderBy: { date: 'desc' },
      take: 10,
    })

    // Calcular estatísticas
    const totalPatients = professional.patients.length
    const appointmentsToday = professional.consultations.filter((c) => {
      const today = new Date()
      const consultDate = new Date(c.date)
      return (
        consultDate.getDate() === today.getDate() &&
        consultDate.getMonth() === today.getMonth() &&
        consultDate.getFullYear() === today.getFullYear()
      )
    }).length

    const pendingExams = recentExams.filter((e) => e.status === 'PENDING_RESULTS').length

    return {
      professional: {
        id: professional.id,
        name: professional.name,
        email: user.email,
        specialty: professional.specialty,
        crm: professional.crm,
        phone: professional.phone,
        patients: [],
        createdAt: professional.createdAt.toISOString(),
      },
      patients,
      upcomingAppointments,
      recentExams: recentExams.map((exam) => ({
        id: exam.id,
        patientId: exam.patientId,
        name: exam.name,
        type: exam.type,
        date: exam.date.toISOString(),
        status: exam.status,
        result: exam.result,
        doctor: exam.doctor,
        createdAt: exam.createdAt.toISOString(),
      })),
      notifications: user.notifications.map((notif) => ({
        id: notif.id,
        userId: notif.userId,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        timestamp: notif.timestamp.toISOString(),
        read: notif.read,
        actionUrl: notif.actionUrl,
      })),
      stats: {
        totalPatients,
        appointmentsToday,
        pendingExams,
      },
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  private getNextDose(frequency: string, currentDose: Date): string | undefined {
    // Parsing simples de frequência
    const match = frequency.match(/(\d+)/)
    if (!match) return undefined

    const timesPerDay = parseInt(match[1])
    const hoursInterval = 24 / timesPerDay

    const nextDose = new Date(currentDose)
    nextDose.setHours(nextDose.getHours() + hoursInterval)

    return nextDose.toISOString()
  }
}

export const dashboardService = new DashboardService()
