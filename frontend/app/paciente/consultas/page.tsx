'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { MainLayout } from '@/components/layout/MainLayout'

export default function ConsultationsPage() {
  const { user, isLoading: authLoading } = useAuth('PATIENT')
  const [consultations, setConsultations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null)

  useEffect(() => {
    if (!authLoading && user) {
      loadConsultations()
    }
  }, [authLoading, user])

  const loadConsultations = async () => {
    try {
      setLoading(true)
      const { getConsultations } = await import('@/lib/api')
      const data = await getConsultations()
      setConsultations(data)
    } catch (error) {
      console.error('Erro ao carregar consultas:', error)
      setConsultations([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (consultationId: string) => {
    try {
      const { getConsultation } = await import('@/lib/api')
      const consultation = await getConsultation(consultationId)
      setSelectedConsultation(consultation)
      setShowDetailsModal(true)
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error)
    }
  }

  // Separar consultas futuras e passadas
  const now = new Date()
  const upcomingConsultations = consultations.filter(c => new Date(c.date) >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const pastConsultations = consultations.filter(c => new Date(c.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

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

  return (
    <MainLayout userType="paciente">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Consultas</h1>
          <p className="text-gray-600 mt-1">Acompanhe suas consultas médicas</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total</h3>
            <p className="text-2xl font-bold text-gray-900">{consultations.length}</p>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <h3 className="text-sm font-medium text-blue-600 mb-1">Próximas</h3>
            <p className="text-2xl font-bold text-blue-900">{upcomingConsultations.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <h3 className="text-sm font-medium text-green-600 mb-1">Realizadas</h3>
            <p className="text-2xl font-bold text-green-900">{pastConsultations.length}</p>
          </div>
        </div>

        {/* Próximas Consultas */}
        {upcomingConsultations.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Próximas Consultas</h2>
            <div className="space-y-3">
              {upcomingConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer"
                  onClick={() => handleViewDetails(consultation.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {consultation.type === 'FIRST_VISIT' ? 'Primeira Consulta' :
                         consultation.type === 'RETURN' ? 'Retorno' :
                         consultation.type === 'EMERGENCY' ? 'Emergência' : 'Rotina'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Dr(a). {consultation.professional?.name || 'Não informado'}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-gray-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(consultation.date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1 text-gray-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(consultation.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Em breve
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consultas Passadas */}
        {pastConsultations.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Histórico de Consultas</h2>
            <div className="space-y-3">
              {pastConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleViewDetails(consultation.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {consultation.type === 'FIRST_VISIT' ? 'Primeira Consulta' :
                         consultation.type === 'RETURN' ? 'Retorno' :
                         consultation.type === 'EMERGENCY' ? 'Emergência' : 'Rotina'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Dr(a). {consultation.professional?.name || 'Não informado'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{new Date(consultation.date).toLocaleDateString('pt-BR')}</span>
                        {consultation.diagnosis && (
                          <span className="text-green-600">✓ Com diagnóstico</span>
                        )}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Realizada
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {consultations.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma consulta registrada</h3>
            <p className="text-gray-500">Suas consultas aparecerão aqui</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Detalhes da Consulta</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedConsultation.type === 'FIRST_VISIT' ? 'Primeira Consulta' :
                   selectedConsultation.type === 'RETURN' ? 'Retorno' :
                   selectedConsultation.type === 'EMERGENCY' ? 'Emergência' : 'Consulta de Rotina'}
                </h3>
                <p className="text-gray-600">
                  Dr(a). {selectedConsultation.professional?.name || 'Não informado'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Data</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedConsultation.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Horário</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedConsultation.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {selectedConsultation.duration && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Duração</p>
                    <p className="font-medium text-gray-900">{selectedConsultation.duration} minutos</p>
                  </div>
                )}
              </div>

              {selectedConsultation.notes && (
                <div className="pt-4">
                  <p className="text-sm text-gray-500 mb-2">Anotações</p>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {selectedConsultation.notes}
                  </p>
                </div>
              )}

              {selectedConsultation.diagnosis && (
                <div className="pt-4">
                  <p className="text-sm text-gray-500 mb-2">Diagnóstico</p>
                  <p className="text-gray-900 bg-green-50 p-4 rounded-lg border border-green-200 whitespace-pre-wrap">
                    {selectedConsultation.diagnosis}
                  </p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
