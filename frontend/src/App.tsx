import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AppLayout } from "@/components/app-layout"
import { SettingsPage } from "@/components/settings-page"
import { ProfilePage } from "@/components/profile-page"
import { AboutPage } from "@/components/about-page"

function HomePage() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h1 className="text-lg font-semibold">Bienvenue dans votre espace de travail</h1>
      <p className="mt-1 text-sm text-muted-foreground">Votre navigation est prête. Commencez à construire votre application ici.</p>
    </div>
  )
}

export function App() {
  return <BrowserRouter><Routes><Route element={<AppLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/parametres" element={<SettingsPage />} />
    <Route path="/profil" element={<ProfilePage profile={{ name: "Utilisateur", email: "utilisateur@example.com", avatar: "" }} />} />
    <Route path="/a-propos" element={<AboutPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route></Routes></BrowserRouter>
}

export default App
