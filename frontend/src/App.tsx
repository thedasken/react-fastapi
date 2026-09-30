import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider, useAuth } from "@/auth"
import { AppLayout } from "@/components/app-layout"
import { LoginPage } from "@/components/login-page"
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
  return <BrowserRouter><AuthProvider><Routes><Route path="/login" element={<LoginRoute />} /><Route element={<ProtectedLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/parametres" element={<SettingsPage />} />
    <Route path="/profil" element={<ProfilePage />} />
    <Route path="/a-propos" element={<AboutPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route></Routes></AuthProvider></BrowserRouter>
}

function LoginRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
}

function ProtectedLayout() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />
}

export default App
