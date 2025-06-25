"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

export default function DebugConnection() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    const testResults = []

    try {
      // Teste 1: Variáveis de ambiente
      testResults.push({
        test: "Variáveis de Ambiente",
        status: "info",
        details: {
          SUPABASE_URL: process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL ? "✅ Configurada" : "❌ Faltando",
          SUPABASE_ANON_KEY: process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY
            ? "✅ Configurada"
            : "❌ Faltando",
        },
      })

      // Teste 2: Conexão básica
      try {
        const { data, error } = await supabase.from("users").select("count")
        testResults.push({
          test: "Conexão Supabase",
          status: error ? "error" : "success",
          details: error ? error.message : "Conexão estabelecida",
        })
      } catch (err: any) {
        testResults.push({
          test: "Conexão Supabase",
          status: "error",
          details: err.message,
        })
      }

      // Teste 3: Buscar usuários
      try {
        const { data: users, error } = await supabase
          .from("users")
          .select("id, email, name, password")
          .eq("email", "admin@exudustech.com.br")

        testResults.push({
          test: "Usuário Admin",
          status: error ? "error" : users && users.length > 0 ? "success" : "warning",
          details: error
            ? error.message
            : users && users.length > 0
              ? `Encontrado: ${users[0].email} | Senha: ${users[0].password}`
              : "Usuário não encontrado",
        })
      } catch (err: any) {
        testResults.push({
          test: "Usuário Admin",
          status: "error",
          details: err.message,
        })
      }

      // Teste 4: Login API
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "admin@exudustech.com.br",
            password: "admin123",
          }),
        })

        const data = await response.json()
        testResults.push({
          test: "API de Login",
          status: response.ok ? "success" : "error",
          details: response.ok ? "Login funcionando" : data.error || "Erro desconhecido",
        })
      } catch (err: any) {
        testResults.push({
          test: "API de Login",
          status: "error",
          details: err.message,
        })
      }
    } catch (err: any) {
      testResults.push({
        test: "Erro Geral",
        status: "error",
        details: err.message,
      })
    }

    setResults(testResults)
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 Debug de Conexão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testConnection} disabled={loading}>
          {loading ? "Testando..." : "Executar Testes"}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{result.test}</h3>
                  <Badge className={getStatusColor(result.status)}>{result.status.toUpperCase()}</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {typeof result.details === "object" ? (
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  ) : (
                    <p>{result.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
