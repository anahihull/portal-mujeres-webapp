import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Noticias - Mujeres en la Ciencia",
  description: "Últimas noticias y publicaciones en ciencia y tecnología",
}

export default function NoticiasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
