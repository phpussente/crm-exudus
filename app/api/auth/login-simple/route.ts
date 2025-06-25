import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("Login simples - Email:", email, "Senha:", password)

    if (email === "admin@exudustech.com.br" && password === "admin123") {
      console.log("Login simples bem-sucedido!")

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

    console.log("Login simples falhou")
    return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 })
  } catch (error) {
    console.error("Erro no login simples:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
