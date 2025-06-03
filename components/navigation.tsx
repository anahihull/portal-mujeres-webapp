"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, BookOpen, Newspaper, Calendar, MessageCircle, Award, HelpCircle, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { href: "/", label: "Inicio", icon: BookOpen, disabled: false },
    { href: "/noticias", label: "Noticias", icon: Newspaper, disabled: false },
    { href: "/recursos", label: "Recursos", icon: BookOpen, disabled: false },
    { href: "/calendario", label: "Calendario", icon: Calendar, disabled: false },
    { href: "/carreras", label: "Carreras", icon: Award, disabled: true },
    { href: "/oportunidades", label: "Oportunidades", icon: Calendar, disabled: true },
    { href: "/preguntas", label: "Pregunta a Experta", icon: HelpCircle, disabled: false },
    { href: "/comunidad", label: "Comunidad", icon: MessageCircle, disabled: true },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-purple-900/95 backdrop-blur-sm border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">MC</span>
            </div>
            <span className="text-xl font-bold text-white">Mujeres en la Ciencia</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            {menuItems.map((item) =>
              item.disabled ? (
                <TooltipProvider key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-1 px-3 py-2 rounded-lg text-white/40 cursor-not-allowed">
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                        <AlertCircle className="w-3 h-3 ml-1" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Próximamente</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ),
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg text-white hover:bg-white/10">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            {menuItems.map((item) =>
              item.disabled ? (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-4 py-3 text-white/40 cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Próximamente</span>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
