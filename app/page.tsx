"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return

      try {
        const isAuthenticated = localStorage.getItem("isAuthenticated")
        const user = localStorage.getItem("user")

        if (isAuthenticated === "true" && user) {
          router.push("/dashboard")
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Erro:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    // Aguardar um pouco para garantir que está no cliente
    setTimeout(checkAuth, 200)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto mb-4" />
          <div className="text-white">Carregando...</div>
        </div>
      </div>
    )
  }

  return null
}
