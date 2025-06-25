import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const { name, email, phone, company, segment } = data
    const clientId = Number.parseInt(params.id)

    const { data: updatedClient, error } = await supabaseAdmin
      .from("clients")
      .update({
        name,
        email,
        phone,
        company,
        segment,
      })
      .eq("id", clientId)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar cliente:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    if (!updatedClient) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
    }

    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = Number.parseInt(params.id)

    const { error } = await supabaseAdmin.from("clients").delete().eq("id", clientId)

    if (error) {
      console.error("Erro ao deletar cliente:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar cliente:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
