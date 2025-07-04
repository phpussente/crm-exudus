'use client'

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, Target, TrendingUp, LogOut } from "lucide-react"
import LeadsKanban from "@/components/leads-kanban"
import ClientsManager from "@/components/clients-manager"
import UsersManager from "@/components/users-manager"
import ReportsDashboard from "@/components/reports-dashboard"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando sessão...</p>
        </div>
      </div>
    )
  }

  const user = session?.user

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">CRM ExudusTech</h1>
              <Badge variant="outline" className="text-xs">
                {user?.role === "admin" ? "Administrador" : user?.role === "gestor" ? "Gestor" : "Usuário"}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Olá, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>
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
            {(user?.role === "admin" || user?.role === "gestor") && <TabsTrigger value="users">Usuários</TabsTrigger>}
            <TabsTrigger value="test">Teste DB</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Cards aqui (mantidos como estavam) */}
              {/* ... (mantenha os mesmos cards de leads, clientes, etc.) */}
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

          {(user?.role === "admin" || user?.role === "gestor") && (
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
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
