import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const { name, email, phone, company, segment, status, source, notes, value } = data
    const leadId = Number.parseInt(params.id)

    const { data: updatedLead, error } = await supabaseAdmin
      .from("leads")
      .update({
        name,
        email,
        phone,
        company,
        segment,
        status,
        source,
        notes,
        value,
      })
      .eq("id", leadId)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar lead:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    if (!updatedLead) {
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 })
    }

    return NextResponse.json(updatedLead)
  } catch (error) {
    console.error("Erro ao atualizar lead:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const leadId = Number.parseInt(params.id)

    const { error } = await supabaseAdmin.from("leads").delete().eq("id", leadId)

    if (error) {
      console.error("Erro ao deletar lead:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar lead:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
