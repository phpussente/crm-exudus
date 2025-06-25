import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Métricas gerais
    const totalClients = await sql`SELECT COUNT(*) as count FROM clients`
    const totalLeads = await sql`SELECT COUNT(*) as count FROM leads`
    const convertedLeads = await sql`SELECT COUNT(*) as count FROM leads WHERE status = 'fechado'`
    const lostLeads = await sql`SELECT COUNT(*) as count FROM leads WHERE status = 'perdido'`

    // Taxa de conversão
    const conversionRate =
      totalLeads[0].count > 0 ? Math.round((convertedLeads[0].count / totalLeads[0].count) * 100) : 0

    // Receita total
    const totalRevenue = await sql`
      SELECT COALESCE(SUM(value), 0) as total 
      FROM leads 
      WHERE status = 'fechado'
    `

    // Leads por origem
    const leadsBySource = await sql`
      SELECT source, COUNT(*) as count
      FROM leads 
      WHERE source IS NOT NULL AND source != ''
      GROUP BY source
      ORDER BY count DESC
      LIMIT 5
    `

    // Funil de conversão
    const funnelData = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM leads
      GROUP BY status
      ORDER BY 
        CASE status
          WHEN 'novo' THEN 1
          WHEN 'contato' THEN 2
          WHEN 'proposta' THEN 3
          WHEN 'negociacao' THEN 4
          WHEN 'fechado' THEN 5
          WHEN 'perdido' THEN 6
        END
    `

    // Performance mensal (últimos 6 meses)
    const monthlyPerformance = await sql`
      SELECT 
        TO_CHAR(created_at, 'Mon') as month,
        COUNT(*) as leads,
        COUNT(CASE WHEN status = 'fechado' THEN 1 END) as converted
      FROM leads
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)
      ORDER BY EXTRACT(MONTH FROM created_at)
    `

    return NextResponse.json({
      metrics: {
        totalClients: totalClients[0].count,
        totalLeads: totalLeads[0].count,
        convertedLeads: convertedLeads[0].count,
        lostLeads: lostLeads[0].count,
        conversionRate,
        totalRevenue: totalRevenue[0].total,
      },
      leadsBySource,
      funnelData,
      monthlyPerformance,
    })
  } catch (error) {
    console.error("Erro ao buscar relatórios:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
