import Link from "next/link"
import { ArrowRight, BookOpen, Newspaper, Calendar, Award, MessageCircle, HelpCircle } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Newspaper,
      title: "Noticias y Publicaciones",
      description: "Mantente al día con las últimas noticias y avances en ciencia y tecnología",
      href: "/noticias",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: BookOpen,
      title: "Recursos Educativos",
      description: "Accede a guías, tutoriales y materiales de estudio especializados",
      href: "/recursos",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Award,
      title: "Carreras en Ingeniería",
      description: "Explora diferentes carreras STEM y sus oportunidades",
      href: "/carreras",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: "Oportunidades",
      description: "Descubre becas, hackathones, mentorías y talleres",
      href: "/oportunidades",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: HelpCircle,
      title: "Pregunta a una Experta",
      description: "Obtén respuestas de profesionales experimentadas",
      href: "/preguntas",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: MessageCircle,
      title: "Comunidad",
      description: "Conecta con otras mujeres apasionadas por la ciencia",
      href: "/comunidad",
      color: "from-red-500 to-pink-500",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Mujeres en la Ciencia
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Empoderando a la próxima generación de científicas, ingenieras y tecnólogas a través de educación,
            inspiración y comunidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/noticias" className="btn-primary inline-flex items-center">
              Explorar Noticias
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/recursos" className="btn-secondary inline-flex items-center">
              Ver Recursos
              <BookOpen className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Descubre Todo lo que Ofrecemos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href} className="card-purple group cursor-pointer">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-pink-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/70 group-hover:text-white/90 transition-colors">{feature.description}</p>
                <ArrowRight className="w-5 h-5 text-pink-400 mt-4 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="card-purple">
              <div className="text-3xl font-bold text-pink-400 mb-2">50+</div>
              <div className="text-white/80">Noticias Publicadas</div>
            </div>
            <div className="card-purple">
              <div className="text-3xl font-bold text-purple-400 mb-2">200+</div>
              <div className="text-white/80">Recursos Educativos</div>
            </div>
            <div className="card-purple">
              <div className="text-3xl font-bold text-indigo-400 mb-2">15</div>
              <div className="text-white/80">Carreras Destacadas</div>
            </div>
            <div className="card-purple">
              <div className="text-3xl font-bold text-cyan-400 mb-2">100+</div>
              <div className="text-white/80">Oportunidades Activas</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
