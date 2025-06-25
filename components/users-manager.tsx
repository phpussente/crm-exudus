"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Mail, Shield, User, Loader2, Key } from "lucide-react"

interface SystemUser {
  id: number
  name: string
  email: string
  role: "admin" | "gestor" | "agente"
  created_at: string
}

const roleConfig = {
  admin: { label: "Administrador", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  gestor: { label: "Gestor", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  agente: { label: "Agente", color: "bg-green-500/20 text-green-400 border-green-500/30" },
}

export default function UsersManager() {
  const [users, setUsers] = useState<SystemUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "agente" as SystemUser["role"],
  })

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)

  // Buscar usuário logado
  const getCurrentUser = () => {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }

  // Carregar usuários
  const loadUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const currentUser = getCurrentUser()
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users"
      const method = editingUser ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          currentUserId: currentUser?.id,
        }),
      })

      if (response.ok) {
        await loadUsers()
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao salvar usuário")
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error)
      alert("Erro de conexão")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (user: SystemUser) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return

    try {
      const currentUser = getCurrentUser()
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId: currentUser?.id }),
      })

      if (response.ok) {
        await loadUsers()
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao deletar usuário")
      }
    } catch (error) {
      console.error("Erro ao deletar usuário:", error)
      alert("Erro de conexão")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "agente",
    })
    setEditingUser(null)
    setIsDialogOpen(false)
  }

  const handleChangePassword = async () => {
    if (!selectedUser || !newPassword) return

    setChangingPassword(true)
    try {
      const currentUser = getCurrentUser()
      const response = await fetch(`/api/users/${selectedUser.id}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword,
          currentUserId: currentUser?.id,
        }),
      })

      if (response.ok) {
        alert("Senha alterada com sucesso!")
        setPasswordDialogOpen(false)
        setNewPassword("")
        setSelectedUser(null)
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao alterar senha")
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error)
      alert("Erro de conexão")
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Gestão de Usuários</CardTitle>
              <CardDescription className="text-muted-foreground">Gerencie usuários do sistema CRM</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    {editingUser ? "Editar Usuário" : "Novo Usuário"}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    {editingUser ? "Atualize as informações do usuário" : "Adicione um novo usuário ao sistema"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Nome
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-input border-border text-foreground"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-input border-border text-foreground"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-foreground">
                      Função
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: SystemUser["role"]) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="gestor">Gestor</SelectItem>
                        <SelectItem value="agente">Agente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm} disabled={saving}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {editingUser ? "Atualizando..." : "Salvando..."}
                        </>
                      ) : editingUser ? (
                        "Atualizar"
                      ) : (
                        "Salvar"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
              <DialogContent className="bg-background border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Alterar Senha - {selectedUser?.name}</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Digite a nova senha para o usuário
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-foreground">
                      Nova Senha
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-input border-border text-foreground"
                      placeholder="Digite a nova senha (mín. 6 caracteres)"
                      minLength={6}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPasswordDialogOpen(false)
                        setNewPassword("")
                        setSelectedUser(null)
                      }}
                      disabled={changingPassword}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleChangePassword} disabled={changingPassword || newPassword.length < 6}>
                      {changingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Alterando...
                        </>
                      ) : (
                        "Alterar Senha"
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground">Usuário</TableHead>
                <TableHead className="text-foreground">Função</TableHead>
                <TableHead className="text-foreground">Data de Criação</TableHead>
                <TableHead className="text-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleConfig[user.role].color}>
                      <Shield className="h-3 w-3 mr-1" />
                      {roleConfig[user.role].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      {getCurrentUser()?.role === "admin" || getCurrentUser()?.role === "gestor" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user)
                            setPasswordDialogOpen(true)
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Key className="h-3 w-3" />
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
