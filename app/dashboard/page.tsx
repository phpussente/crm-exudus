"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, Target, TrendingUp, LogOut } from "lucide-react"
import LeadsKanban from "@/components/leads-kanban"
import ClientsManager from "@/components/clients-manager"
import UsersManager from "@/components/users-manager"
import ReportsDashboard from "@/components/reports-dashboard"
import SupabaseTest from "@/components/supabase-test"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar autenticação
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const userData = localStorage.getItem("user")

    if (!isAuthenticated || !userData) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error("Erro ao parsear dados do usuário:", error)
      router.push("/login")
      return
    }

    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">CRM ExudusTech</h1>
              <Badge variant="outline" className="text-xs">
                {user.role === "admin" ? "Administrador" : user.role === "gestor" ? "Gestor" : "Usuário"}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Olá, {user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            {(user.role === "admin" || user.role === "gestor") && <TabsTrigger value="users">Usuários</TabsTrigger>}
            <TabsTrigger value="test">Teste DB</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">+8% em relação ao mês passado</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23.5%</div>
                  <p className="text-xs text-muted-foreground">+2.1% em relação ao mês passado</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 145.2K</div>
                  <p className="text-xs text-muted-foreground">+18% em relação ao mês passado</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo ao CRM ExudusTech</CardTitle>
                <CardDescription>
                  Sistema de gestão de relacionamento com clientes para a revolução em agentes de IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Use as abas acima para navegar entre as diferentes seções do sistema. Gerencie seus leads, clientes e
                  acompanhe o desempenho através dos relatórios.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <LeadsKanban />
          </TabsContent>

          <TabsContent value="clients">
            <ClientsManager />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsDashboard />
          </TabsContent>

          {(user.role === "admin" || user.role === "gestor") && (
            <TabsContent value="users">
              <UsersManager />
            </TabsContent>
          )}

          <TabsContent value="test">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Teste de Conexão com Supabase</CardTitle>
                  <CardDescription>
                    Verifique se a conexão com o banco de dados está funcionando corretamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SupabaseTest />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
