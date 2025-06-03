"use client"

import { useState, useEffect } from "react"
import { Calendar, User, Filter, ExternalLink } from "lucide-react"

interface Noticia {
  id: number
  UserId: string
  Title: string
  Content: string
  image_url: string
  status_id: number
  categoria_id: number
}

interface Categoria {
  id: number
  nombre: string
}

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [filteredNoticias, setFilteredNoticias] = useState<Noticia[]>([])
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(null)
  const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedCategoria === null) {
      setFilteredNoticias(noticias)
    } else {
      setFilteredNoticias(noticias.filter((noticia) => noticia.categoria_id === selectedCategoria))
    }
  }, [noticias, selectedCategoria])

  const fetchData = async () => {
    try {
      const [noticiasResponse, categoriasResponse] = await Promise.all([
        fetch("https://rqlt4vnfja.execute-api.us-east-1.amazonaws.com/api/publicaciones/aprobadas"),
        fetch("https://rqlt4vnfja.execute-api.us-east-1.amazonaws.com/api/categorias"),
      ])

      if (!noticiasResponse.ok || !categoriasResponse.ok) {
        throw new Error("Error al obtener datos")
      }

      const noticiasData = await noticiasResponse.json()
      const categoriasData = await categoriasResponse.json()

      setNoticias(noticiasData)
      setCategorias(categoriasData)
      setFilteredNoticias(noticiasData)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Error al cargar las noticias")
    } finally {
      setLoading(false)
    }
  }

  const getCategoriaNombre = (categoriaId: number) => {
    const categoria = categorias.find((c) => c.id === categoriaId)
    return categoria ? categoria.nombre : `Categoría ${categoriaId}`
  }

  const getCategoriaColor = (categoriaId: number) => {
    const colors = [
      "from-pink-500 to-rose-500",
      "from-purple-500 to-indigo-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-yellow-500 to-orange-500",
      "from-red-500 to-pink-500",
    ]
    return colors[categoriaId % colors.length]
  }

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const handleNoticiaClick = (noticia: Noticia) => {
    setSelectedNoticia(noticia)
  }

  const closeModal = () => {
    setSelectedNoticia(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-semibold text-white mb-2">Error al cargar noticias</h3>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Noticias y Publicaciones
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Mantente al día con las últimas noticias, avances y descubrimientos en ciencia y tecnología
          </p>
        </div>

        {/* Filtros por categoría */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-white/70" />
            <span className="text-white/70">Filtrar por categoría:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategoria(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategoria === null
                  ? "bg-purple-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              Todas las categorías
            </button>
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                onClick={() => setSelectedCategoria(categoria.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategoria === categoria.id
                    ? "bg-purple-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                {categoria.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNoticias.map((noticia) => (
            <div
              key={noticia.id}
              className="card-purple group cursor-pointer"
              onClick={() => handleNoticiaClick(noticia)}
            >
              <div className="relative mb-4">
                <img
                  src={noticia.image_url || "/placeholder.svg?height=200&width=400"}
                  alt={noticia.Title}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=200&width=400&text=Imagen+no+disponible"
                  }}
                />
                <div className="absolute top-3 left-3">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoriaColor(noticia.categoria_id)}`}
                  >
                    {getCategoriaNombre(noticia.categoria_id)}
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-pink-300 transition-colors">
                {noticia.Title}
              </h3>

              <p className="text-white/70 mb-4 line-clamp-3">{truncateContent(noticia.Content)}</p>

              <div className="flex items-center justify-between text-sm text-white/60">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Autor</span>
                </div>
                <div className="text-purple-300 text-sm">Leer más →</div>
              </div>
            </div>
          ))}
        </div>

        {filteredNoticias.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              {selectedCategoria ? "No hay noticias en esta categoría" : "No hay noticias disponibles"}
            </h3>
            <p className="text-white/70">
              {selectedCategoria
                ? "Prueba con otra categoría o vuelve más tarde"
                : "Pronto tendremos más contenido informativo para ti"}
            </p>
          </div>
        )}
      </div>

      {/* Modal para mostrar noticia completa */}
      {selectedNoticia && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-purple-900/95 border border-white/20 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedNoticia.image_url || "/placeholder.svg?height=300&width=800"}
                alt={selectedNoticia.Title}
                className="w-full h-64 object-cover rounded-t-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=300&width=800&text=Imagen+no+disponible"
                }}
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
              <div className="absolute top-4 left-4">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoriaColor(selectedNoticia.categoria_id)}`}
                >
                  {getCategoriaNombre(selectedNoticia.categoria_id)}
                </div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{selectedNoticia.Title}</h2>

              <div className="flex items-center space-x-4 text-white/60 text-sm mb-6">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Autor</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Publicado recientemente</span>
                </div>
              </div>

              <div className="text-white/90 leading-relaxed whitespace-pre-wrap">{selectedNoticia.Content}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
