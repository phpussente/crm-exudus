"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, DollarSign, Target } from "lucide-react"

export default function ReportsDashboard() {
  const metrics = [
    {
      title: "Leads Convertidos",
      value: "23",
      change: "+12%",
      trend: "up",
      icon: Target,
    },
    {
      title: "Taxa de Conversão",
      value: "35%",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Receita Mensal",
      value: "R$ 45.200",
      change: "+18%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Leads Perdidos",
      value: "8",
      change: "-3%",
      trend: "down",
      icon: TrendingDown,
    },
  ]

  const leadsBySource = [
    { source: "Website", count: 15, percentage: 35 },
    { source: "LinkedIn", count: 12, percentage: 28 },
    { source: "Indicação", count: 8, percentage: 19 },
    { source: "Google Ads", count: 5, percentage: 12 },
    { source: "WhatsApp", count: 3, percentage: 6 },
  ]

  const conversionFunnel = [
    { stage: "Leads Gerados", count: 43, percentage: 100 },
    { stage: "Primeiro Contato", count: 35, percentage: 81 },
    { stage: "Proposta Enviada", count: 28, percentage: 65 },
    { stage: "Em Negociação", count: 18, percentage: 42 },
    { stage: "Fechados", count: 15, percentage: 35 },
  ]

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className="flex items-center gap-1">
                  <Badge variant={metric.trend === "up" ? "default" : "destructive"} className="text-xs">
                    {metric.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads por Origem */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Leads por Origem</CardTitle>
            <CardDescription className="text-muted-foreground">
              Distribuição de leads por canal de aquisição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadsBySource.map((item) => (
                <div key={item.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <span className="font-medium text-foreground">{item.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{item.count} leads</span>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Funil de Conversão */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Funil de Conversão</CardTitle>
            <CardDescription className="text-muted-foreground">Taxa de conversão por etapa do pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionFunnel.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{stage.count}</span>
                      <Badge variant="outline">{stage.percentage}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Mensal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Performance Mensal</CardTitle>
          <CardDescription className="text-muted-foreground">
            Comparativo de performance dos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { month: "Jan", leads: 32, converted: 8 },
              { month: "Fev", leads: 28, converted: 12 },
              { month: "Mar", leads: 45, converted: 15 },
              { month: "Abr", leads: 38, converted: 18 },
              { month: "Mai", leads: 52, converted: 22 },
              { month: "Jun", leads: 43, converted: 15 },
            ].map((data) => (
              <div key={data.month} className="text-center space-y-2">
                <div className="text-sm font-medium text-foreground">{data.month}</div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{data.leads}</div>
                  <div className="text-xs text-muted-foreground">Leads</div>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-green-600">{data.converted}</div>
                  <div className="text-xs text-muted-foreground">Convertidos</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metas e Objetivos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Target className="h-5 w-5" />
              Meta Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-foreground">
                <span>Leads: 15/50</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "30%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <DollarSign className="h-5 w-5" />
              Meta de Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-foreground">
                <span>R$ 45.200/R$ 100.000</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "45%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5" />
              Novos Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-foreground">
                <span>5/20</span>
                <span>25%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "25%" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
