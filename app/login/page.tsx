"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2, AlertCircle, Bug } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import EnvDebug from "@/components/env-debug"

export default function LoginPage() {
  const [email, setEmail] = useState("admin@exudustech.com.br")
  const [password, setPassword] = useState("admin123")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [debugOpen, setDebugOpen] = useState(false)
  const [useSimpleLogin, setUseSimpleLogin] = useState(true)
  const router = useRouter()

  useEffect(() => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")

    console.log("Login page loaded - using simple login mode")
    setUseSimpleLogin(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("Starting login with:", { email, password })

    try {
      const response = await fetch("/api/auth/login-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("API response:", response.status, response.statusText)

      const data = await response.json()
      console.log("Response data:", data)

      if (response.ok && data.success) {
        console.log("Login successful!")
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("user", JSON.stringify(data.user))

        setTimeout(() => {
          router.push("/dashboard")
        }, 100)
      } else {
        console.log("Login failed:", data.error)
        setError(data.error || "Erro ao fazer login")
      }
    } catch (error) {
      console.error("Connection error:", error)
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
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
            <CardDescription className="text-zinc-400">
              Revolução em Agentes de IA
              {useSimpleLogin && (
                <span className="block text-yellow-400 text-xs mt-1">(Modo de teste - Supabase não configurado)</span>
              )}
            </CardDescription>
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
                  placeholder="admin@exudustech.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
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
                    placeholder="admin123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 pr-10"
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

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar no Sistema"
                )}
              </Button>
            </form>

            <div className="mt-4 flex justify-between items-center">
              <Button variant="link" className="text-zinc-400 hover:text-white text-sm">
                Esqueceu sua senha?
              </Button>

              <Dialog open={debugOpen} onOpenChange={setDebugOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-300">
                    <Bug className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800 max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white">Debug de Variáveis</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                      Verificar configuração das variáveis de ambiente
                    </DialogDescription>
                  </DialogHeader>
                  <EnvDebug />
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-6 text-center text-sm text-zinc-400">
              <p className="mb-2">Credenciais de teste:</p>
              <div className="bg-zinc-800 p-3 rounded border border-zinc-700">
                <p>
                  <strong>Email:</strong> admin@exudustech.com.br
                </p>
                <p>
                  <strong>Senha:</strong> admin123
                </p>
              </div>

              <div className="mt-3 p-2 bg-yellow-900/20 border border-yellow-800 rounded text-yellow-300 text-xs">
                <p>Usando login de teste. Configure o Supabase para funcionalidade completa.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
