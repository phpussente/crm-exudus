"use client"

import { useState, useCallback } from "react"

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  timeout?: number
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callApi = useCallback(async (url: string, options: ApiOptions = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const { method = "GET", body, timeout = 10000 } = options

      const fetchOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(timeout),
      }

      if (body && method !== "GET") {
        fetchOptions.body = JSON.stringify(body)
      }

      const response = await fetch(url, fetchOptions)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      setError(errorMessage)
      console.error("API Error:", errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { callApi, isLoading, error, setError }
}
