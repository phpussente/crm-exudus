"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Loader2, Eye } from "lucide-react"

interface Lead {
  id: number
  name: string
  email: string
  phone: string
  company: string
  segment: string
  status: string
  source: string
  notes: string
  value: number
  created_at: string
  updated_at: string
}

const statusColumns = [
  { id: "novo", title: "Novo", color: "bg-blue-500" },
  { id: "contato", title: "Em Contato", color: "bg-yellow-500" },
  { id: "proposta", title: "Proposta", color: "bg-orange-500" },
  { id: "negociacao", title: "Negociação", color: "bg-purple-500" },
  { id: "fechado", title: "Fechado", color: "bg-green-500" },
  { id: "perdido", title: "Perdido", color: "bg-red-500" },
]

export default function LeadsKanban() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    segment: "",
    status: "novo",
    source: "",
    notes: "",
    value: 0,
  })

  // Carregar leads
  const loadLeads = async () => {
    try {
      const response = await fetch("/api/leads")
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      } else {
        console.error("Erro ao carregar leads")
      }
    } catch (error) {
      console.error("Erro ao carregar leads:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingLead ? `/api/leads/${editingLead.id}` : "/api/leads"
      const method = editingLead ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await loadLeads()
        setIsDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao salvar lead")
      }
    } catch (error) {
      console.error("Erro ao salvar lead:", error)
      alert("Erro de conexão")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este lead?")) return

    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadLeads()
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao deletar lead")
      }
    } catch (error) {
      console.error("Erro ao deletar lead:", error)
      alert("Erro de conexão")
    }
  }

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead)
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      segment: lead.segment,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      value: lead.value,
    })
    setIsDialogOpen(true)
  }

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailsOpen(true)
  }

  const resetForm = () => {
    setEditingLead(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      segment: "",
      status: "novo",
      source: "",
      notes: "",
      value: 0,
    })
  }

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      const lead = leads.find((l) => l.id === leadId)
      if (!lead) return

      const updatedData = { ...lead, status: newStatus }

      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (response.ok) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)))
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao atualizar status")
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      alert("Erro de conexão")
    }
  }

  // Funções de Drag and Drop
  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", lead.id.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    e.stopPropagation()

    const leadId = e.dataTransfer.getData("text/plain")
    const lead = leads.find((l) => l.id.toString() === leadId)

    if (lead && lead.status !== newStatus) {
      handleStatusChange(lead.id, newStatus)
    }
    setDraggedLead(null)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault()
    setDraggedLead(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pipeline de Leads</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingLead ? "Editar Lead" : "Novo Lead"}</DialogTitle>
              <DialogDescription>
                {editingLead ? "Edite as informações do lead" : "Adicione um novo lead ao pipeline"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="segment">Segmento</Label>
                  <Select
                    value={formData.segment}
                    onValueChange={(value) => setFormData({ ...formData, segment: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o segmento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="saude">Saúde</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="varejo">Varejo</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusColumns.map((status) => (
                        <SelectItem key={status.id} value={status.id}>
                          {status.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="source">Origem</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="value">Valor (R$)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingLead ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
            <DialogDescription>Informações completas do lead selecionado</DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Nome</Label>
                  <p className="text-sm text-muted-foreground">{selectedLead.name}</p>
                </div>
                <div>
                  <Label className="font-medium">Empresa</Label>
                  <p className="text-sm text-muted-foreground">{selectedLead.company}</p>
                </div>
                <div>
                  <Label className="font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedLead.email}</p>
                </div>
                <div>
                  <Label className="font-medium">Telefone</Label>
                  <p className="text-sm text-muted-foreground">{selectedLead.phone}</p>
                </div>
                <div>
                  <Label className="font-medium">Segmento</Label>
                  <p className="text-sm text-muted-foreground">{selectedLead.segment}</p>
                </div>
                <div>
                  <Label className="font-medium">Status</Label>
                  <Badge className="ml-0">{statusColumns.find((s) => s.id === selectedLead.status)?.title}</Badge>
                </div>
                <div>
                  <Label className="font-medium">Origem</Label>
                  <p className="text-sm text-muted-foreground">{selectedLead.source}</p>
                </div>
                <div>
                  <Label className="font-medium">Valor</Label>
                  <p className="text-sm text-muted-foreground font-medium text-green-600">
                    R$ {selectedLead.value.toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedLead.notes && (
                <div>
                  <Label className="font-medium">Observações</Label>
                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">{selectedLead.notes}</p>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => handleEdit(selectedLead)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statusColumns.map((column) => (
          <Card
            key={column.id}
            className="min-h-[500px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                {column.title}
                <Badge variant="secondary" className="ml-auto">
                  {leads.filter((lead) => lead.status === column.id).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 min-h-[400px]">
              {leads
                .filter((lead) => lead.status === column.id)
                .map((lead) => (
                  <Card
                    key={lead.id}
                    className={`p-2 cursor-pointer hover:shadow-md transition-all duration-200 group ${
                      draggedLead?.id === lead.id ? "opacity-50 rotate-2" : ""
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewDetails(lead)
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="font-medium text-sm leading-tight break-words hyphens-auto">{lead.name}</h4>
                          <p className="text-xs text-muted-foreground leading-tight break-words hyphens-auto">
                            {lead.company}
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEdit(lead)
                            }}
                            className="h-5 w-5 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(lead.id)
                            }}
                            className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {lead.value > 0 && (
                        <p className="text-xs font-medium text-green-600">R$ {lead.value.toLocaleString()}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {lead.segment}
                        </Badge>
                        <Eye className="h-3 w-3 text-muted-foreground opacity-50" />
                      </div>
                    </div>
                  </Card>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
