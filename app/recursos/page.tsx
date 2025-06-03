"use client"

import { useState, useEffect } from "react"
import { Download, FileText, ExternalLink, Filter } from "lucide-react"

interface Recurso {
  id: number
  titulo: string
  descripcion: string
  materia_id: number
  recurso_url: string
  status_id: number
}

interface Materia {
  id: number
  nombre_materia: string
}

interface Status {
  id: number
  nombre: string
}

export default function RecursosPage() {
  const [recursos, setRecursos] = useState<Recurso[]>([])
  const [materias, setMaterias] = useState<Materia[]>([])
  const [filteredRecursos, setFilteredRecursos] = useState<Recurso[]>([])
  const [selectedMateria, setSelectedMateria] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedMateria === null) {
      setFilteredRecursos(recursos)
    } else {
      setFilteredRecursos(recursos.filter((recurso) => recurso.materia_id === selectedMateria))
    }
  }, [recursos, selectedMateria])

  const fetchData = async () => {
    try {
      const [recursosResponse, materiasResponse] = await Promise.all([
        fetch("https://rqlt4vnfja.execute-api.us-east-1.amazonaws.com/api/recursos/status/aprobado"),
        fetch("https://rqlt4vnfja.execute-api.us-east-1.amazonaws.com/api/materias"),
      ])

      if (!recursosResponse.ok || !materiasResponse.ok) {
        throw new Error("Error al obtener datos")
      }

      const recursosData = await recursosResponse.json()
      const materiasData = await materiasResponse.json()

      setRecursos(recursosData)
      setMaterias(materiasData)
      setFilteredRecursos(recursosData)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Error al cargar los recursos")
    } finally {
      setLoading(false)
    }
  }

  const getMateriaName = (materiaId: number) => {
    const materia = materias.find((m) => m.id === materiaId)
    return materia ? materia.nombre_materia : `Materia ${materiaId}`
  }

  const isImageUrl = (url: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
    return imageExtensions.some((ext) => url.toLowerCase().includes(ext))
  }

  const getFileType = (url: string) => {
    if (isImageUrl(url)) return "Imagen"
    if (url.includes(".pdf")) return "PDF"
    if (url.includes(".doc")) return "Documento"
    if (url.includes(".xls")) return "Hoja de cálculo"
    if (url.includes(".ppt")) return "Presentación"
    return "Archivo"
  }

  const handleResourceClick = (url: string) => {
    window.open(url, "_blank")
  }

  const getMateriaColor = (materiaId: number) => {
    const colors = [
      "from-pink-500 to-rose-500",
      "from-purple-500 to-indigo-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-yellow-500 to-orange-500",
      "from-red-500 to-pink-500",
    ]
    return colors[materiaId % colors.length]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-semibold text-white mb-2">Error al cargar recursos</h3>
          <p className="text-white/70">{error}</p>
          <button onClick={fetchData} className="btn-primary mt-4">
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Recursos Educativos
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Accede a una amplia colección de materiales educativos diseñados para impulsar tu carrera en STEM
          </p>
        </div>

        {/* Filtros por materia */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-white/70" />
            <span className="text-white/70">Filtrar por materia:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedMateria(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedMateria === null
                  ? "bg-purple-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              Todas las materias
            </button>
            {materias.map((materia) => (
              <button
                key={materia.id}
                onClick={() => setSelectedMateria(materia.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedMateria === materia.id
                    ? "bg-purple-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                {materia.nombre_materia}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecursos.map((recurso) => (
            <div
              key={recurso.id}
              className="card-purple group cursor-pointer"
              onClick={() => handleResourceClick(recurso.recurso_url)}
            >
              <div className="relative mb-4">
                {isImageUrl(recurso.recurso_url) ? (
                  <img
                    src={recurso.recurso_url || "/placeholder.svg"}
                    alt={recurso.titulo}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=200&width=400&text=Imagen+no+disponible"
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-white/80 mx-auto mb-2" />
                      <span className="text-white/80 text-sm">{getFileType(recurso.recurso_url)}</span>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getMateriaColor(recurso.materia_id)}`}
                  >
                    {getMateriaName(recurso.materia_id)}
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-300 transition-colors">
                {recurso.titulo}
              </h3>

              <p className="text-white/70 mb-4 line-clamp-3">{recurso.descripcion}</p>

              <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>{getFileType(recurso.recurso_url)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="flex items-center space-x-2 text-sm text-purple-300">
                  {isImageUrl(recurso.recurso_url) ? (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      <span>Ver imagen</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Abrir recurso</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecursos.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              {selectedMateria ? "No hay recursos en esta materia" : "No hay recursos disponibles"}
            </h3>
            <p className="text-white/70">
              {selectedMateria
                ? "Prueba con otra materia o vuelve más tarde"
                : "Pronto tendremos más contenido educativo para ti"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
