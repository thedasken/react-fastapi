/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react"
import { login as requestLogin } from "@/lib/api"

type AuthUser = { name: string; email: string; avatar: string }
type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

function createUser(username: string): AuthUser {
  return { name: username, email: `${username}@example.com`, avatar: "" }
}

const AuthContext = createContext<AuthContextValue | null>(null)

function userFromStorage(): AuthUser | null {
  const token = sessionStorage.getItem("access_token")
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { sub?: string }
    return payload.sub ? createUser(payload.sub) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(userFromStorage)
  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user && sessionStorage.getItem("access_token")),
    async login(username, password) {
      const result = await requestLogin(username, password)
      sessionStorage.setItem("access_token", result.access_token)
      sessionStorage.setItem("username", result.username)
      setUser(createUser(result.username))
    },
    logout() {
      sessionStorage.removeItem("access_token")
      sessionStorage.removeItem("username")
      setUser(null)
    },
  }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
