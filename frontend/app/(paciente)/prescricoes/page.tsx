'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { MainLayout } from '@/components/layout/MainLayout'

export default function PrescriptionsPage() {
  const { user, isLoading: authLoading } = useAuth('PATIENT')
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)

  useEffect(() => {
    if (!authLoading && user) {
      loadPrescriptions()
    }
  }, [authLoading, user])

  const loadPrescriptions = async () => {
    try {
      setLoading(true)
      const { getPrescriptions } = await import('@/lib/api')
      const data = await getPrescriptions()
      setPrescriptions(data)
    } catch (error) {
      console.error('Erro ao carregar prescrições:', error)
      setPrescriptions([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (prescriptionId: string) => {
    try {
      const { getPrescription } = await import('@/lib/api')
      const prescription = await getPrescription(prescriptionId)
      setSelectedPrescription(prescription)
      setShowDetailsModal(true)
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error)
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

  return (
    <MainLayout userType="paciente">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Prescrições</h1>
          <p className="text-gray-600 mt-1">Visualize suas receitas médicas</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total de Prescrições</h3>
            <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <h3 className="text-sm font-medium text-blue-600 mb-1">Este Mês</h3>
            <p className="text-2xl font-bold text-blue-900">
              {prescriptions.filter(p => {
                const date = new Date(p.date)
                const now = new Date()
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
              }).length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <h3 className="text-sm font-medium text-green-600 mb-1">Medicamentos</h3>
            <p className="text-2xl font-bold text-green-900">
              {prescriptions.reduce((acc, p) => acc + (p.items?.length || 0), 0)}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
            <h3 className="text-sm font-medium text-purple-600 mb-1">Profissionais</h3>
            <p className="text-2xl font-bold text-purple-900">
              {new Set(prescriptions.map(p => p.professionalId)).size}
            </p>
          </div>
        </div>

        {/* Prescriptions List */}
        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma prescrição registrada</h3>
            <p className="text-gray-500">Suas receitas médicas aparecerão aqui</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
                onClick={() => handleViewDetails(prescription.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Prescrição Médica</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(prescription.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-600">
                      Dr(a). {prescription.professional?.name || 'Não informado'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span className="text-gray-600">
                      {prescription.items?.length || 0} medicamento(s)
                    </span>
                  </div>

                  {prescription.notes && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-3 line-clamp-2">
                      {prescription.notes}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Ver detalhes →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Detalhes da Prescrição</h2>
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

            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-2">Prescrição Médica</h3>
                <p className="text-purple-100">
                  Dr(a). {selectedPrescription.professional?.name || 'Não informado'}
                </p>
                <p className="text-purple-100 text-sm mt-1">
                  Data: {new Date(selectedPrescription.date).toLocaleDateString('pt-BR')}
                </p>
              </div>

              {/* Medications */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Medicamentos Prescritos
                </h4>
                <div className="space-y-3">
                  {selectedPrescription.items?.map((item: any, index: number) => (
                    <div key={item.id || index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-2">{item.medicationName || item.medication?.name}</h5>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Dosagem:</span>
                          <span className="ml-2 text-gray-900 font-medium">{item.dosage}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Frequência:</span>
                          <span className="ml-2 text-gray-900 font-medium">{item.frequency}</span>
                        </div>
                        {item.duration && (
                          <div className="col-span-2">
                            <span className="text-gray-500">Duração:</span>
                            <span className="ml-2 text-gray-900 font-medium">{item.duration}</span>
                          </div>
                        )}
                      </div>
                      {item.instructions && (
                        <p className="mt-2 text-sm text-gray-700 bg-blue-50 p-3 rounded border border-blue-200">
                          <strong>Instruções:</strong> {item.instructions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedPrescription.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Observações Gerais</h4>
                  <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg border border-yellow-200 whitespace-pre-wrap">
                    {selectedPrescription.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
