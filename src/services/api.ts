const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

/**
 * Access token conservé en mémoire uniquement (jamais en localStorage : XSS).
 * Le refresh token vit dans un cookie HttpOnly géré par le serveur.
 */
let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

/** Tente de renouveler l'access token via le cookie HttpOnly. */
async function tryRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!response.ok) return false
    const data = (await response.json()) as { accessToken: string }
    accessToken = data.accessToken
    return true
  } catch {
    return false
  }
}

async function request<T>(path: string, options?: RequestInit, retry = true): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers,
  })

  // Access token expiré (15 min) : un seul essai de refresh puis rejeu de la requête
  if (response.status === 401 && retry && !path.startsWith('/auth/')) {
    if (await tryRefresh()) {
      return request<T>(path, options, false)
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }))
    throw new Error(error.message ?? `HTTP ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
