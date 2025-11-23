'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { MainLayout } from '@/components/layout/MainLayout'
import { VitalSignsChart } from '@/components/charts/VitalSignsChart'
import type { VitalSign } from '@/lib/types'

const VITAL_SIGN_TYPES = [
  { value: 'BLOOD_PRESSURE', label: 'Pressão Arterial', unit: 'mmHg', icon: '💓' },
  { value: 'HEART_RATE', label: 'Frequência Cardíaca', unit: 'bpm', icon: '❤️' },
  { value: 'TEMPERATURE', label: 'Temperatura', unit: '°C', icon: '🌡️' },
  { value: 'OXYGEN_SATURATION', label: 'Saturação de Oxigênio', unit: '%', icon: '🫁' },
  { value: 'GLUCOSE', label: 'Glicose', unit: 'mg/dL', icon: '🩸' },
  { value: 'WEIGHT', label: 'Peso', unit: 'kg', icon: '⚖️' },
  { value: 'HEIGHT', label: 'Altura', unit: 'cm', icon: '📏' },
]

export default function VitalSignsPage() {
  const { user, isLoading: authLoading } = useAuth('PATIENT')
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('BLOOD_PRESSURE')
  const [formData, setFormData] = useState({
    type: 'BLOOD_PRESSURE',
    value: '',
    notes: '',
  })

  useEffect(() => {
    if (!authLoading && user) {
      loadVitalSigns()
    }
  }, [authLoading, user])

  const loadVitalSigns = async () => {
    try {
      setLoading(true)
      const { getVitalSigns } = await import('@/lib/api')
      const data = await getVitalSigns()
      setVitalSigns(data)
    } catch (error) {
      console.error('Erro ao carregar sinais vitais:', error)
      setVitalSigns([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddVitalSign = async () => {
    try {
      const { createVitalSign } = await import('@/lib/api')

      const typeConfig = VITAL_SIGN_TYPES.find(t => t.value === formData.type)

      await createVitalSign({
        type: formData.type as any,
        value: formData.value,
        unit: typeConfig?.unit || '',
        notes: formData.notes || undefined,
      })

      setShowAddModal(false)
      setFormData({ type: 'BLOOD_PRESSURE', value: '', notes: '' })
      await loadVitalSigns()
    } catch (error) {
      console.error('Erro ao adicionar sinal vital:', error)
      alert('Erro ao adicionar sinal vital. Tente novamente.')
    }
  }

  const handleDeleteVitalSign = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este registro?')) {
      try {
        const { deleteVitalSign } = await import('@/lib/api')
        await deleteVitalSign(id)
        await loadVitalSigns()
      } catch (error) {
        console.error('Erro ao remover sinal vital:', error)
        alert('Erro ao remover registro. Tente novamente.')
      }
    }
  }

  // Agrupar sinais vitais por tipo
  const groupedVitalSigns = VITAL_SIGN_TYPES.map(type => ({
    ...type,
    records: vitalSigns.filter(vs => vs.type === type.value).slice(0, 7),
  }))

  // Preparar dados para gráficos
  const getChartData = (typeValue: string) => {
    const records = vitalSigns.filter(vs => vs.type === typeValue).slice(0, 7).reverse()
    return records.map(record => ({
      date: new Date(record.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      value: parseFloat(record.value),
    }))
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
            <h1 className="text-3xl font-bold text-gray-900">Sinais Vitais</h1>
            <p className="text-gray-600 mt-1">Monitore sua saúde através de sinais vitais</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Registrar Sinal Vital
          </button>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {VITAL_SIGN_TYPES.slice(0, 4).map(type => {
            const latestRecord = vitalSigns.find(vs => vs.type === type.value)
            return (
              <div key={type.value} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{type.icon}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    latestRecord?.status === 'NORMAL' ? 'bg-green-100 text-green-700' :
                    latestRecord?.status === 'WARNING' ? 'bg-yellow-100 text-yellow-700' :
                    latestRecord?.status === 'DANGER' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {latestRecord ? (latestRecord.status === 'NORMAL' ? 'Normal' : latestRecord.status === 'WARNING' ? 'Atenção' : 'Perigo') : 'N/A'}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{type.label}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {latestRecord ? `${latestRecord.value} ${type.unit}` : '-'}
                </p>
                {latestRecord && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(latestRecord.timestamp).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VitalSignsChart
            data={getChartData('BLOOD_PRESSURE')}
            title="Pressão Arterial (7 dias)"
            color="#ef4444"
            unit=" mmHg"
          />
          <VitalSignsChart
            data={getChartData('HEART_RATE')}
            title="Frequência Cardíaca (7 dias)"
            color="#f59e0b"
            unit=" bpm"
          />
          <VitalSignsChart
            data={getChartData('GLUCOSE')}
            title="Glicose (7 dias)"
            color="#8b5cf6"
            unit=" mg/dL"
          />
          <VitalSignsChart
            data={getChartData('WEIGHT')}
            title="Peso (7 dias)"
            color="#10b981"
            unit=" kg"
          />
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Histórico de Registros</h2>
          </div>

          <div className="p-6">
            {/* Type Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedType('ALL')}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  selectedType === 'ALL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Todos
              </button>
              {VITAL_SIGN_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                    selectedType === type.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>

            {/* Records List */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notas</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vitalSigns
                    .filter(vs => selectedType === 'ALL' || vs.type === selectedType)
                    .map(record => {
                      const typeConfig = VITAL_SIGN_TYPES.find(t => t.value === record.type)
                      return (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{typeConfig?.icon}</span>
                              <span className="text-sm font-medium text-gray-900">{typeConfig?.label}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                            {record.value} {typeConfig?.unit}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              record.status === 'NORMAL' ? 'bg-green-100 text-green-700' :
                              record.status === 'WARNING' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {record.status === 'NORMAL' ? 'Normal' : record.status === 'WARNING' ? 'Atenção' : 'Perigo'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {new Date(record.timestamp).toLocaleString('pt-BR')}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {record.notes || '-'}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              onClick={() => handleDeleteVitalSign(record.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
              {vitalSigns.filter(vs => selectedType === 'ALL' || vs.type === selectedType).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhum registro encontrado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Registrar Sinal Vital</h2>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Sinal Vital *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {VITAL_SIGN_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label} ({type.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Ex: ${formData.type === 'BLOOD_PRESSURE' ? '120' : formData.type === 'HEART_RATE' ? '75' : '36.5'}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Observações sobre a medição..."
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddVitalSign}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
