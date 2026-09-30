"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import logoIcon from "@/assets/logo_icon.png"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CircleHelpIcon, FolderKanbanIcon, HomeIcon } from "lucide-react"
import { useAuth } from "@/auth"

const data = {
  navMain: [
    {
      title: "Accueil",
      url: "/",
      icon: <HomeIcon />,
    },
    { title: "Projets", url: "/projects", icon: <FolderKanbanIcon /> },
  ],
  projects: [
    {
      name: "A propos",
      url: "#",
      icon: <CircleHelpIcon />,
    },
  ],
}

function ServerStatus() {
  const [isOnline, setIsOnline] = React.useState(false)

  React.useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/health`)
        setIsOnline(response.ok)
      } catch {
        setIsOnline(false)
      }
    }

    checkServer()
    const interval = window.setInterval(checkServer, 30_000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <Card className="mx-2 mb-2 gap-0 py-3 shadow-none">
      <CardContent className="flex items-center gap-2 px-3 text-xs">
        <span
          aria-label={isOnline ? "Serveur connecté" : "Serveur déconnecté"}
          className={`size-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}
        />
        <span>{isOnline ? "Connecté" : "Déconnecté"}</span>
      </CardContent>
    </Card>
  )
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  if (!user) return null
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link to="/" />}
            >
                <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-white">
                  <img src={logoIcon} alt="Logo FANLab" className="size-full object-contain" />
                </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{import.meta.env.APP_NAME}</span>
                <span className="truncate text-xs">FANLab</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <div className="mt-auto" />
        <ServerStatus />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
