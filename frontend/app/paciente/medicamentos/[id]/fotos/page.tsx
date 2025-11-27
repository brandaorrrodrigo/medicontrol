'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Camera, Trash2, Plus, X, Image as ImageIcon, FileText, Pill, FileCheck } from 'lucide-react'
import {
  getMedicationPhotos,
  uploadMedicationPhoto,
  deleteMedicationPhoto,
  getMedication,
} from '@/lib/api'

interface MedicationPhoto {
  id: string
  type: 'MEDICATION_BOX' | 'BOTTLE' | 'LEAFLET' | 'PRESCRIPTION'
  filename: string
  filepath: string
  takenAt: string
  notes?: string
  medication: {
    id: string
    name: string
    dosage: string
  }
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  active: boolean
}

const photoTypeLabels = {
  MEDICATION_BOX: 'Caixa do Medicamento',
  BOTTLE: 'Frasco/Embalagem',
  LEAFLET: 'Bula',
  PRESCRIPTION: 'Receita Médica',
}

const photoTypeIcons = {
  MEDICATION_BOX: Pill,
  BOTTLE: Pill,
  LEAFLET: FileText,
  PRESCRIPTION: FileCheck,
}

export default function MedicationPhotosPage() {
  const params = useParams()
  const router = useRouter()
  const medicationId = params.id as string

  const [medication, setMedication] = useState<Medication | null>(null)
  const [photos, setPhotos] = useState<MedicationPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<MedicationPhoto | null>(null)
  const [filter, setFilter] = useState<string>('all')

  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadData, setUploadData] = useState({
    type: 'MEDICATION_BOX',
    notes: '',
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadData()
  }, [medicationId, filter])

  const loadData = async () => {
    try {
      setLoading(true)
      const [medicationData, photosData] = await Promise.all([
        getMedication(medicationId),
        getMedicationPhotos(
          medicationId,
          filter !== 'all' ? filter : undefined
        ),
      ])
      setMedication(medicationData)
      setPhotos(photosData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      alert('Erro ao carregar dados do medicamento')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      alert('Selecione uma foto')
      return
    }

    try {
      setUploading(true)
      await uploadMedicationPhoto(medicationId, selectedFile, uploadData)
      setShowUploadModal(false)
      setSelectedFile(null)
      setPreviewUrl(null)
      setUploadData({ type: 'MEDICATION_BOX', notes: '' })
      await loadData()
      alert('Foto adicionada com sucesso!')
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error)
      alert(error.message || 'Erro ao fazer upload da foto')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (photoId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta foto?')) return

    try {
      await deleteMedicationPhoto(photoId)
      await loadData()
      setSelectedPhoto(null)
      alert('Foto excluída com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir foto:', error)
      alert('Erro ao excluir foto')
    }
  }

  const getPhotoUrl = (filepath: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/${filepath}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/(paciente)/medicamentos')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Voltar para Medicamentos
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Fotos do Medicamento
              </h1>
              {medication && (
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">{medication.name}</span> - {medication.dosage}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Adicionar Foto
            </button>
          </div>

          {/* Informativo */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Importante:</strong> Essas fotos são usadas para conferir o medicamento, a dose e o tratamento prescritos.
              Não são usadas para fins estéticos. Elas ajudam na segurança do tratamento e na análise de efeitos colaterais.
            </p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Todas ({photos.length})
          </button>
          {Object.entries(photoTypeLabels).map(([type, label]) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Camera size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">Nenhuma foto cadastrada</p>
          <p className="text-gray-500 mt-2">
            Adicione fotos do medicamento para melhor controle do tratamento
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => {
            const Icon = photoTypeIcons[photo.type]
            return (
              <div
                key={photo.id}
                className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={getPhotoUrl(photo.filepath)}
                    alt={photoTypeLabels[photo.type]}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-gray-400"><svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><p class="mt-2">Imagem não disponível</p></div>`
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={16} className="text-blue-600" />
                    <span className="font-semibold text-sm text-gray-900">
                      {photoTypeLabels[photo.type]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(photo.takenAt).toLocaleDateString('pt-BR')}
                  </p>
                  {photo.notes && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {photo.notes}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Adicionar Foto do Medicamento
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setSelectedFile(null)
                  setPreviewUrl(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Foto *
                </label>
                <select
                  value={uploadData.type}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {Object.entries(photoTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full"
                  required
                />
                {previewUrl && (
                  <div className="mt-3">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  value={uploadData.notes}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Ex: Mudança de embalagem, lote diferente, etc."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false)
                    setSelectedFile(null)
                    setPreviewUrl(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={uploading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? 'Enviando...' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {photoTypeLabels[selectedPhoto.type]}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(selectedPhoto.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <img
                  src={getPhotoUrl(selectedPhoto.filepath)}
                  alt={photoTypeLabels[selectedPhoto.type]}
                  className="w-full rounded-lg"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-semibold text-gray-700">
                    Medicamento:
                  </span>
                  <p className="text-gray-900">
                    {selectedPhoto.medication.name} - {selectedPhoto.medication.dosage}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-semibold text-gray-700">
                    Data:
                  </span>
                  <p className="text-gray-900">
                    {new Date(selectedPhoto.takenAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {selectedPhoto.notes && (
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      Observações:
                    </span>
                    <p className="text-gray-900">{selectedPhoto.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
