"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function EnvDebug() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    const clientEnvs: Record<string, string> = {}

    if (typeof window !== "undefined") {
      const supabaseVars = [
        "SUPABASE_NEXT_PUBLIC_SUPABASE_URL",\
SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY",
        "SUPABASE_NEXT_PUBLIC_SUPABASE_URL",
        "SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY"
      ]

      supabaseVars.forEach((key) => {
        const value = process.env[key]
        clientEnvs[key] = value || "undefined"
      })
    }

    setEnvVars(clientEnvs)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Environment Variables Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="font-semibold">Variáveis Supabase Disponíveis:</h3>
          {Object.keys(envVars).length === 0 ? (
            <Badge variant="destructive">Nenhuma variável encontrada</Badge>
          ) : (
            Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                <span className="font-mono text-sm">{key}</span>
                <Badge variant={value && value !== "undefined" ? "default" : "destructive"}>
                  {value && value !== "undefined" ? "Set" : "Missing"}
                </Badge>
              </div>
            ))
          )}

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-semibold text-yellow-800">Variáveis Necessárias:</h4>
            <ul className="text-sm text-yellow-700 mt-1">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>SUPABASE_SERVICE_ROLE_KEY (server-side)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
