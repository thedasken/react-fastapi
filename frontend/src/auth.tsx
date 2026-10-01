/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { login as requestLogin } from "@/lib/api"

type AuthUser = { name: string; email: string; avatar: string }
type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  sessionExpired: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

function createUser(username: string): AuthUser {
  return { name: username, email: `${username}@example.com`, avatar: "" }
}

const AuthContext = createContext<AuthContextValue | null>(null)

function initialAuthState(): { user: AuthUser | null; sessionExpired: boolean } {
  let token: string | null
  try {
    token = sessionStorage.getItem("access_token")
  } catch {
    return { user: null, sessionExpired: false }
  }
  if (!token) return { user: null, sessionExpired: false }
  try {
    const payloadPart = token.split(".")[1]
    if (!payloadPart) throw new Error("Invalid token")
    const payload = JSON.parse(atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/"))) as { sub?: string; exp?: number }
    if (!payload.sub || typeof payload.exp !== "number" || payload.exp <= Math.floor(Date.now() / 1000)) throw new Error("Expired token")
    return { user: createUser(payload.sub), sessionExpired: false }
  } catch {
    sessionStorage.removeItem("access_token")
    sessionStorage.removeItem("username")
    return { user: null, sessionExpired: true }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initialState] = useState(initialAuthState)
  const [user, setUser] = useState<AuthUser | null>(initialState.user)
  const [sessionExpired, setSessionExpired] = useState(initialState.sessionExpired)
  useEffect(() => {
    const handleSessionExpired = () => {
      sessionStorage.removeItem("access_token")
      sessionStorage.removeItem("username")
      setUser(null)
      setSessionExpired(true)
    }
    window.addEventListener("session-expired", handleSessionExpired)
    return () => window.removeEventListener("session-expired", handleSessionExpired)
  }, [])
  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user && sessionStorage.getItem("access_token")),
    sessionExpired,
    async login(username, password) {
      setSessionExpired(false)
      const result = await requestLogin(username, password)
      sessionStorage.setItem("access_token", result.access_token)
      sessionStorage.setItem("username", result.username)
      setUser(createUser(result.username))
    },
    logout() {
      sessionStorage.removeItem("access_token")
      sessionStorage.removeItem("username")
      setUser(null)
      setSessionExpired(false)
    },
  }), [user, sessionExpired])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
