"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, UserPlus, Settings, BarChart3, ChevronLeft, ChevronRight } from "lucide-react"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "leads",
    label: "Leads",
    icon: UserPlus,
  },
  {
    id: "clients",
    label: "Clientes",
    icon: Users,
  },
  {
    id: "users",
    label: "Usuários",
    icon: Settings,
  },
  {
    id: "reports",
    label: "Relatórios",
    icon: BarChart3,
  },
]

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-300",
        isCollapsed ? "sidebar-collapsed" : "sidebar-expanded",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Image src="/images/exudus-logo.jpeg" alt="ExudusTech" width={120} height={40} className="object-contain" />
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                isCollapsed && "justify-center px-2",
                isActive && "bg-primary text-primary-foreground",
              )}
              onClick={() => onPageChange(item.id)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
