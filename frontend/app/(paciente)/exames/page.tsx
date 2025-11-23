'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { MainLayout } from '@/components/layout/MainLayout'
import type { Exam } from '@/lib/types'

const EXAM_STATUS = {
  SCHEDULED: { label: 'Agendado', color: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'Realizado', color: 'bg-green-100 text-green-700' },
  PENDING_RESULTS: { label: 'Aguardando Resultado', color: 'bg-yellow-100 text-yellow-700' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
}

export default function ExamsPage() {
  const { user, isLoading: authLoading } = useAuth('PATIENT')
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    date: '',
    status: 'SCHEDULED',
    doctor: '',
    location: '',
    notes: '',
  })

  useEffect(() => {
    if (!authLoading && user) {
      loadExams()
    }
  }, [authLoading, user])

  const loadExams = async () => {
    try {
      setLoading(true)
      const { getExams } = await import('@/lib/api')
      const data = await getExams()
      setExams(data)
    } catch (error) {
      console.error('Erro ao carregar exames:', error)
      setExams([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddExam = async () => {
    try {
      const { createExam } = await import('@/lib/api')

      await createExam({
        name: formData.name,
        type: formData.type,
        date: new Date(formData.date).toISOString(),
        status: formData.status as any,
        doctor: formData.doctor || undefined,
        location: formData.location || undefined,
        notes: formData.notes || undefined,
      })

      setShowAddModal(false)
      setFormData({
        name: '',
        type: '',
        date: '',
        status: 'SCHEDULED',
        doctor: '',
        location: '',
        notes: '',
      })
      await loadExams()
    } catch (error) {
      console.error('Erro ao adicionar exame:', error)
      alert('Erro ao adicionar exame. Tente novamente.')
    }
  }

  const handleDeleteExam = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este exame?')) {
      try {
        const { deleteExam } = await import('@/lib/api')
        await deleteExam(id)
        await loadExams()
      } catch (error) {
        console.error('Erro ao remover exame:', error)
        alert('Erro ao remover exame. Tente novamente.')
      }
    }
  }

  const handleFileUpload = async (examId: string, file: File) => {
    try {
      setUploadingFile(true)
      const { uploadExamFile } = await import('@/lib/api')
      await uploadExamFile(examId, file)

      // Recarregar exames para mostrar o arquivo anexado
      await loadExams()
      alert('Arquivo enviado com sucesso!')
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload do arquivo. Tente novamente.')
    } finally {
      setUploadingFile(false)
    }
  }

  const handleViewDetails = async (examId: string) => {
    try {
      const { getExam } = await import('@/lib/api')
      const exam = await getExam(examId)
      setSelectedExam(exam)
      setShowDetailsModal(true)
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error)
      alert('Erro ao carregar detalhes do exame.')
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Exames</h1>
            <p className="text-gray-600 mt-1">Gerencie seus exames médicos e resultados</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Exame
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(EXAM_STATUS).map(([key, value]) => {
            const count = exams.filter(e => e.status === key).length
            return (
              <div key={key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-1">{value.label}</h3>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
              </div>
            )
          })}
        </div>

        {/* Exams List */}
        {exams.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum exame cadastrado</h3>
            <p className="text-gray-500">Adicione seu primeiro exame para começar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map((exam) => (
              <div key={exam.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${EXAM_STATUS[exam.status as keyof typeof EXAM_STATUS]?.color}`}>
                    {EXAM_STATUS[exam.status as keyof typeof EXAM_STATUS]?.label}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.name}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Tipo:</span>
                    <span className="font-medium text-gray-900">{exam.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Data:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(exam.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {exam.doctor && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Médico:</span>
                      <span className="font-medium text-gray-900">{exam.doctor}</span>
                    </div>
                  )}
                  {exam.files && exam.files.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-600 font-medium">{exam.files.length} arquivo(s)</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(exam.id)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                  >
                    Ver Detalhes
                  </button>
                  <button
                    onClick={() => handleDeleteExam(exam.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Adicionar Exame</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Exame *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Hemograma Completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                  <input
                    type="text"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Sangue, Imagem, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(EXAM_STATUS).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Médico</label>
                  <input
                    type="text"
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do médico"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Local</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Clínica ou hospital"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Observações sobre o exame..."
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddExam}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Detalhes do Exame</h2>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedExam.name}</h3>
                <span className={`inline-block text-sm px-3 py-1 rounded-full ${EXAM_STATUS[selectedExam.status as keyof typeof EXAM_STATUS]?.color}`}>
                  {EXAM_STATUS[selectedExam.status as keyof typeof EXAM_STATUS]?.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tipo</p>
                  <p className="font-medium text-gray-900">{selectedExam.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Data</p>
                  <p className="font-medium text-gray-900">{new Date(selectedExam.date).toLocaleDateString('pt-BR')}</p>
                </div>
                {selectedExam.doctor && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Médico</p>
                    <p className="font-medium text-gray-900">{selectedExam.doctor}</p>
                  </div>
                )}
                {selectedExam.location && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Local</p>
                    <p className="font-medium text-gray-900">{selectedExam.location}</p>
                  </div>
                )}
              </div>

              {selectedExam.notes && (
                <div className="pt-4">
                  <p className="text-sm text-gray-500 mb-2">Observações</p>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedExam.notes}</p>
                </div>
              )}

              {selectedExam.result && (
                <div className="pt-4">
                  <p className="text-sm text-gray-500 mb-2">Resultado</p>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedExam.result}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Arquivos Anexados</h4>
                {selectedExam.files && selectedExam.files.length > 0 ? (
                  <div className="space-y-2">
                    {selectedExam.files.map((file: any) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-900">{file.filename}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Nenhum arquivo anexado</p>
                    <label className="inline-block cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(selectedExam.id, file)
                        }}
                        disabled={uploadingFile}
                      />
                      {uploadingFile ? 'Enviando...' : 'Anexar Arquivo'}
                    </label>
                  </div>
                )}
              </div>
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
