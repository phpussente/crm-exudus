import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("🧪 API de teste - Login attempt:", { email, password })

    // Validar entrada
    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Login hardcoded para teste
    if (email === "admin@exudustech.com.br" && password === "admin123") {
      return NextResponse.json({
        success: true,
        user: {
          id: 1,
          email: "admin@exudustech.com.br",
          name: "Administrador",
          role: "admin",
        },
      })
    }

    return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 })
  } catch (error) {
    console.error("Erro na API de teste:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
