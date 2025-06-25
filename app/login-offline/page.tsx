"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"

export default function LoginOfflinePage() {
  const [email, setEmail] = useState("admin@exudustech.com.br")
  const [password, setPassword] = useState("admin123")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Limpar qualquer sessão anterior
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simular login offline para desenvolvimento
    setTimeout(() => {
      if (email === "admin@exudustech.com.br" && password === "admin123") {
        const mockUser = {
          id: 1,
          email: "admin@exudustech.com.br",
          name: "Admin ExudusTech",
          role: "admin",
        }

        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("user", JSON.stringify(mockUser))

        router.push("/dashboard")
      } else {
        setError("Email ou senha incorretos")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="dark min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Image
                src="/images/exudus-logo.jpeg"
                alt="ExudusTech"
                width={150}
                height={50}
                className="object-contain"
              />
            </div>
            <CardTitle className="text-2xl text-white">CRM ExudusTech</CardTitle>
            <CardDescription className="text-zinc-400">Modo Offline - Revolução em Agentes de IA</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-200">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white pr-10"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && <div className="text-red-400 text-sm text-center">{error}</div>}

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar no Sistema (Offline)"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-400">
              <div className="bg-zinc-800 p-3 rounded border border-zinc-700">
                <p className="text-yellow-400 mb-2">⚠️ Modo Offline Ativo</p>
                <p>
                  <strong>Email:</strong> admin@exudustech.com.br
                </p>
                <p>
                  <strong>Senha:</strong> admin123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
