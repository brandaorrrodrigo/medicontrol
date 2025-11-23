'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { MainLayout } from '@/components/layout/MainLayout'
import { PatientSummaryCard } from '@/components/dashboard/PatientSummaryCard'
import { MedicationReminderList } from '@/components/dashboard/MedicationReminderList'
import { VitalSignsCard } from '@/components/dashboard/VitalSignsCard'
import { ExamsCard } from '@/components/dashboard/ExamsCard'
import { NotificationList } from '@/components/dashboard/NotificationList'
import { VitalSignsChart } from '@/components/charts/VitalSignsChart'
import { MedicationAdherenceChart } from '@/components/charts/MedicationAdherenceChart'
import { StatsChart } from '@/components/charts/StatsChart'
import {
  getPatientDashboardData,
  markMedicationAsTaken,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '@/lib/api'
import type { PatientDashboardData } from '@/lib/types'

export default function PatientDashboard() {
  const { user, isLoading: authLoading } = useAuth('PATIENT')
  const [dashboardData, setDashboardData] = useState<PatientDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data para gráficos (será substituído por dados reais da API futuramente)
  const bloodPressureData = [
    { date: '18/11', value: 120 },
    { date: '19/11', value: 118 },
    { date: '20/11', value: 122 },
    { date: '21/11', value: 119 },
    { date: '22/11', value: 121 },
    { date: '23/11', value: 117 },
    { date: '24/11', value: 120 },
  ]

  const heartRateData = [
    { date: '18/11', value: 72 },
    { date: '19/11', value: 75 },
    { date: '20/11', value: 73 },
    { date: '21/11', value: 71 },
    { date: '22/11', value: 74 },
    { date: '23/11', value: 72 },
    { date: '24/11', value: 73 },
  ]

  const medicationAdherenceData = [
    { name: 'Seg', tomados: 4, perdidos: 1, total: 5 },
    { name: 'Ter', tomados: 5, perdidos: 0, total: 5 },
    { name: 'Qua', tomados: 4, perdidos: 1, total: 5 },
    { name: 'Qui', tomados: 5, perdidos: 0, total: 5 },
    { name: 'Sex', tomados: 3, perdidos: 2, total: 5 },
    { name: 'Sab', tomados: 5, perdidos: 0, total: 5 },
    { name: 'Dom', tomados: 4, perdidos: 1, total: 5 },
  ]

  const healthStatsData = [
    { name: 'Medicamentos Ativos', value: 8, color: '#3b82f6' },
    { name: 'Exames Pendentes', value: 3, color: '#f59e0b' },
    { name: 'Consultas Agendadas', value: 2, color: '#10b981' },
  ]

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData()
    }
  }, [authLoading, user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await getPatientDashboardData()
      setDashboardData(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados do dashboard')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkMedicationAsTaken = async (reminderId: string) => {
    try {
      await markMedicationAsTaken(reminderId)
      // Atualizar o estado local
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
      // Atualizar o estado local
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
      await markAllNotificationsAsRead()
      // Atualizar o estado local
      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          notifications: dashboardData.notifications.map(notif => ({ ...notif, read: true })),
        })
      }
    } catch (err) {
      console.error('Erro ao marcar todas as notificações como lidas:', err)
    }
  }

  if (authLoading || loading) {
    return (
      <MainLayout userType="paciente">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !dashboardData) {
    return (
      <MainLayout userType="paciente">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || 'Erro ao carregar dados'}</p>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout userType="paciente">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {dashboardData.patient.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Bem-vindo ao seu painel de saúde. Aqui você pode acompanhar seus medicamentos, sinais vitais e exames.
          </p>
        </div>

        {/* Patient Summary */}
        <PatientSummaryCard patient={dashboardData.patient} />

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
              window.location.href = `/(paciente)/exames`
            }}
          />

          {/* Notifications */}
          <NotificationList
            notifications={dashboardData.notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
          />
        </div>

        {/* Analytics Section */}
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Análises e Tendências</h2>
            <p className="text-gray-600">Acompanhe sua saúde através de gráficos interativos</p>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <VitalSignsChart
              data={bloodPressureData}
              title="Pressão Arterial (Sistólica)"
              color="#3b82f6"
              unit=" mmHg"
            />
            <VitalSignsChart
              data={heartRateData}
              title="Frequência Cardíaca"
              color="#10b981"
              unit=" bpm"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MedicationAdherenceChart
              data={medicationAdherenceData}
              title="Adesão aos Medicamentos (Última Semana)"
            />
            <StatsChart
              data={healthStatsData}
              title="Resumo da Saúde"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-600 font-medium mb-1">Medicamentos Hoje</p>
            <p className="text-2xl font-bold text-blue-900">
              {dashboardData.upcomingMedications.filter(m => !m.taken).length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-600 font-medium mb-1">Sinais Vitais Recentes</p>
            <p className="text-2xl font-bold text-green-900">
              {dashboardData.recentVitalSigns.length}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-purple-600 font-medium mb-1">Exames</p>
            <p className="text-2xl font-bold text-purple-900">
              {dashboardData.recentExams.length}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
