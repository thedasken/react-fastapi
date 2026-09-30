import { Outlet, useLocation } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"

const breadcrumbs: Record<string, string> = {
  "/": "Accueil",
  "/projects": "Projets",
  "/parametres": "Paramètres",
  "/profil": "Profil",
  "/a-propos": "A propos",
}

export function AppLayout() {
  const { pathname } = useLocation()
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbPage>{breadcrumbs[pathname] ?? "Accueil"}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4"><Outlet /></main>
      </SidebarInset>
    </SidebarProvider>
  )
}
