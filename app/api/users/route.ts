import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("id, email, name, role, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar usuários:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, role } = data

    // Verificar se email já existe
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Erro ao verificar email:", checkError)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    if (existingUser) {
      return NextResponse.json({ error: "Email já está em uso" }, { status: 400 })
    }

    const { data: newUser, error } = await supabaseAdmin
      .from("users")
      .insert([
        {
          name,
          email,
          role,
          password: "admin123", // Senha padrão
        },
      ])
      .select("id, email, name, role, created_at")
      .single()

    if (error) {
      console.error("Erro ao criar usuário:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
