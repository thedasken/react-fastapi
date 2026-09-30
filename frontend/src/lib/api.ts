const API_URL = import.meta.env.VITE_API_URL ?? ""
const API_ROOT = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`

export function getAccessToken(): string | null {
  return sessionStorage.getItem("access_token")
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers)
  const token = getAccessToken()
  if (token) headers.set("Authorization", `Bearer ${token}`)
  return fetch(`${API_ROOT}${path}`, { ...init, headers })
}

export async function login(username: string, password: string) {
  const body = new URLSearchParams({ username, password })
  const response = await fetch(`${API_ROOT}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })
  if (!response.ok) throw new Error("Identifiant ou mot de passe incorrect")
  return response.json() as Promise<{ access_token: string; username: string }>
}
