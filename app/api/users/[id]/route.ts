import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const { name, email, role } = data
    const userId = Number.parseInt(params.id)

    // Verificar se email já existe em outro usuário
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .neq("id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Erro ao verificar email:", checkError)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    if (existingUser) {
      return NextResponse.json({ error: "Email já está em uso" }, { status: 400 })
    }

    const { data: updatedUser, error } = await supabaseAdmin
      .from("users")
      .update({
        name,
        email,
        role,
      })
      .eq("id", userId)
      .select("id, email, name, role, created_at")
      .single()

    if (error) {
      console.error("Erro ao atualizar usuário:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)
    const { currentUserId } = await request.json()

    // Não permitir deletar o próprio usuário
    if (userId === currentUserId) {
      return NextResponse.json({ error: "Não é possível deletar seu próprio usuário" }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from("users").delete().eq("id", userId)

    if (error) {
      console.error("Erro ao deletar usuário:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar usuário:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
