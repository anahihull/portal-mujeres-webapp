import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mujeres en la Ciencia",
  description: "Plataforma educativa para promover la participación de mujeres en STEM"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 min-h-screen`}
      >
        <Navigation />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  )
}
