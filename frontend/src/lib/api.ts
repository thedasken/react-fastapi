const API_URL = import.meta.env.VITE_API_URL ?? ""
const API_ROOT = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`

export type Page<T> = { items: T[]; page: number; page_size: number; total: number }
export type Project = { id: string; name: string; description: string | null; created_at: string; updated_at: string }
export type ProjectCreate = { name: string; description?: string | null }
export type ProjectPatch = Partial<ProjectCreate>

export function getAccessToken(): string | null {
  return sessionStorage.getItem("access_token")
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers)
  const token = getAccessToken()
  if (token) headers.set("Authorization", `Bearer ${token}`)
  return fetch(`${API_ROOT}${path}`, { ...init, headers })
}

async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await apiFetch(path, init)
  if (!response.ok) {
    const detail = await response.json().catch(() => null) as { detail?: string } | null
    throw new Error(detail?.detail ?? "Une erreur est survenue")
  }
  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>
}

export const listProjects = (page = 1, pageSize = 10, search?: string) => apiJson<Page<Project>>(`/projects?page=${page}&page_size=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ""}`)
export const createProject = (payload: ProjectCreate) => apiJson<Project>("/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
export const updateProject = (id: string, payload: ProjectPatch) => apiJson<Project>(`/projects/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
export const deleteProject = (id: string) => apiJson<void>(`/projects/${id}`, { method: "DELETE" })
export const deleteProjects = (ids: string[]) => apiJson<{ deleted: number }>("/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }) })

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
