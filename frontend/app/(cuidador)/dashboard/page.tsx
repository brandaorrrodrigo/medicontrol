'use client'

import React, { useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MedicationReminderList } from '@/components/dashboard/MedicationReminderList'
import { VitalSignsCard } from '@/components/dashboard/VitalSignsCard'
import { ExamsCard } from '@/components/dashboard/ExamsCard'
import { NotificationList } from '@/components/dashboard/NotificationList'
import {
  getCaregiverDashboardData,
  markMedicationAsTaken,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '@/lib/api'
import type { CaregiverDashboardData } from '@/lib/types'

export default function CaregiverDashboard() {
  const [dashboardData, setDashboardData] = useState<CaregiverDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await getCaregiverDashboardData()
      setDashboardData(data)
    } catch (err) {
      setError('Erro ao carregar dados do dashboard')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkMedicationAsTaken = async (reminderId: string) => {
    try {
      await markMedicationAsTaken(reminderId)
      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          upcomingMedications: dashboardData.upcomingMedications.map(med =>
            med.id === reminderId ? { ...med, taken: true, takenAt: new Date().toISOString() } : med
          ),
        })
      }
    } catch (err) {
      console.error('Erro ao marcar medicamento como tomado:', err)
    }
  }

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          notifications: dashboardData.notifications.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          ),
        })
      }
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err)
    }
  }

  const handleMarkAllNotificationsAsRead = async () => {
    try {
      if (dashboardData?.caregiver.id) {
        await markAllNotificationsAsRead(dashboardData.caregiver.id)
        setDashboardData({
          ...dashboardData,
          notifications: dashboardData.notifications.map(notif => ({ ...notif, read: true })),
        })
      }
    } catch (err) {
      console.error('Erro ao marcar todas as notificações como lidas:', err)
    }
  }

  if (loading) {
    return (
      <MainLayout userType="cuidador">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !dashboardData) {
    return (
      <MainLayout userType="cuidador">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || 'Erro ao carregar dados'}</p>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout userType="cuidador">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {dashboardData.caregiver.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Bem-vindo ao painel de cuidador. Acompanhe a saúde dos seus pacientes em um só lugar.
          </p>
        </div>

        {/* Caregiver Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Cuidador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
                {dashboardData.caregiver.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {dashboardData.caregiver.name}
                </h4>
                <p className="text-sm text-gray-600">{dashboardData.caregiver.email}</p>
                {dashboardData.caregiver.phone && (
                  <p className="text-sm text-gray-600">{dashboardData.caregiver.phone}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patients Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pacientes sob Cuidado</CardTitle>
              <Badge variant="info">{dashboardData.patients.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboardData.patients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-primary-300 transition-all bg-white cursor-pointer"
                  onClick={() => {
                    console.log('Ver detalhes do paciente:', patient.id)
                    // TODO: Navegar para página de detalhes do paciente
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                      <p className="text-sm text-gray-600">
                        {patient.age} anos • {patient.bloodType || 'Tipo sanguíneo não informado'}
                      </p>
                    </div>
                  </div>
                  {patient.conditions && patient.conditions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {patient.conditions.map((condition, index) => (
                        <Badge key={index} variant="warning">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medication Reminders */}
          <MedicationReminderList
            reminders={dashboardData.upcomingMedications}
            onMarkAsTaken={handleMarkMedicationAsTaken}
          />

          {/* Vital Signs */}
          <VitalSignsCard vitalSigns={dashboardData.recentVitalSigns} />

          {/* Exams */}
          <ExamsCard
            exams={dashboardData.recentExams}
            onViewDetails={(examId) => {
              console.log('Ver detalhes do exame:', examId)
              // TODO: Navegar para página de detalhes do exame
            }}
          />

          {/* Notifications */}
          <NotificationList
            notifications={dashboardData.notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-600 font-medium mb-1">Pacientes</p>
            <p className="text-2xl font-bold text-blue-900">
              {dashboardData.patients.length}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-purple-600 font-medium mb-1">Medicamentos Hoje</p>
            <p className="text-2xl font-bold text-purple-900">
              {dashboardData.upcomingMedications.length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-600 font-medium mb-1">Sinais Vitais</p>
            <p className="text-2xl font-bold text-green-900">
              {dashboardData.recentVitalSigns.length}
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <p className="text-sm text-orange-600 font-medium mb-1">Notificações</p>
            <p className="text-2xl font-bold text-orange-900">
              {dashboardData.notifications.filter(n => !n.read).length}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
