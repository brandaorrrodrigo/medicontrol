'use client'

import React, { useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ExamsCard } from '@/components/dashboard/ExamsCard'
import { NotificationList } from '@/components/dashboard/NotificationList'
import {
  getProfessionalDashboardData,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '@/lib/api'
import type { ProfessionalDashboardData } from '@/lib/types'

export default function ProfessionalDashboard() {
  const [dashboardData, setDashboardData] = useState<ProfessionalDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await getProfessionalDashboardData()
      setDashboardData(data)
    } catch (err) {
      setError('Erro ao carregar dados do dashboard')
      console.error(err)
    } finally {
      setLoading(false)
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
      if (dashboardData?.professional.id) {
        await markAllNotificationsAsRead()
        setDashboardData({
          ...dashboardData,
          notifications: dashboardData.notifications.map(notif => ({ ...notif, read: true })),
        })
      }
    } catch (err) {
      console.error('Erro ao marcar todas as notificações como lidas:', err)
    }
  }

  const formatAppointmentTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <MainLayout userType="profissional">
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
      <MainLayout userType="profissional">
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
    <MainLayout userType="profissional">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {dashboardData.professional.name}! 👨‍⚕️
          </h1>
          <p className="text-gray-600">
            {dashboardData.professional.specialty} • CRM {dashboardData.professional.crm}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Pacientes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.stats.totalPatients}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Consultas Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.stats.appointmentsToday}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-2xl">🔬</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Exames Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.stats.pendingExams}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Próximas Consultas</CardTitle>
              <Badge variant="info">{dashboardData.upcomingAppointments.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {dashboardData.upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-2">📅</p>
                <p>Nenhuma consulta agendada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.upcomingAppointments.map((appointment: any) => (
                  <div
                    key={appointment.id}
                    className="p-4 rounded-lg border border-gray-200 hover:border-primary-300 transition-all bg-white cursor-pointer"
                    onClick={() => {
                      console.log('Ver detalhes da consulta:', appointment.id)
                      // TODO: Navegar para página de detalhes da consulta
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                          {appointment.patientName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {appointment.patientName}
                          </h4>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary-600">
                          ⏰ {formatAppointmentTime(appointment.date)}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.duration} min</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pacientes Recentes</CardTitle>
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
      </div>
    </MainLayout>
  )
}
