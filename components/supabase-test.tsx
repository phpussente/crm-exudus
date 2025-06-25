"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<"loading" | "success" | "error">("loading")
  const [testResults, setTestResults] = useState<any[]>([])
  const [error, setError] = useState("")

  const testConnection = async () => {
    setConnectionStatus("loading")
    setError("")

    try {
      // Teste 1: Conexão básica
      const { data, error: connectionError } = await supabase.from("users").select("count").limit(1)

      if (connectionError) {
        throw new Error(`Erro de conexão: ${connectionError.message}`)
      }

      // Teste 2: Buscar usuários
      const { data: users, error: usersError } = await supabase.from("users").select("id, email, name, role").limit(5)

      if (usersError) {
        throw new Error(`Erro ao buscar usuários: ${usersError.message}`)
      }

      // Teste 3: Buscar leads
      const { data: leads, error: leadsError } = await supabase.from("leads").select("id, name, status").limit(5)

      if (leadsError) {
        throw new Error(`Erro ao buscar leads: ${leadsError.message}`)
      }

      // Teste 4: Buscar clientes
      const { data: clients, error: clientsError } = await supabase.from("clients").select("id, name, company").limit(5)

      if (clientsError) {
        throw new Error(`Erro ao buscar clientes: ${clientsError.message}`)
      }

      setTestResults([
        { name: "Usuários", count: users?.length || 0, data: users },
        { name: "Leads", count: leads?.length || 0, data: leads },
        { name: "Clientes", count: clients?.length || 0, data: clients },
      ])

      setConnectionStatus("success")
    } catch (err: any) {
      setError(err.message)
      setConnectionStatus("error")
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Teste de Conexão Supabase
          {connectionStatus === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
          {connectionStatus === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
          {connectionStatus === "error" && <XCircle className="h-5 w-5 text-red-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge
            variant={
              connectionStatus === "success" ? "default" : connectionStatus === "error" ? "destructive" : "secondary"
            }
          >
            {connectionStatus === "loading" && "Testando..."}
            {connectionStatus === "success" && "Conectado"}
            {connectionStatus === "error" && "Erro"}
          </Badge>
          <Button onClick={testConnection} size="sm" variant="outline">
            Testar Novamente
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">Resultados dos Testes:</h3>
            {testResults.map((result, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.name}</span>
                  <Badge variant="outline">{result.count} registros</Badge>
                </div>
                {result.data && result.data.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Exemplo: {JSON.stringify(result.data[0], null, 2)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>URL:</strong> {process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL || "Não configurado"}
          </p>
          <p>
            <strong>Anon Key:</strong>{" "}
            {proSUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY ? "Configurado" : "Não configurado"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
