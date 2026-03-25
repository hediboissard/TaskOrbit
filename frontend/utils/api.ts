const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (process.client) {
    const token = localStorage.getItem('auth_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/auth/login'
    }
  }
  const data = await response.json()
  if (!response.ok) {
    const validationMsg =
      Array.isArray(data.errors) && data.errors.length > 0
        ? data.errors.map((e: { message?: string }) => e.message).filter(Boolean).join(' ')
        : ''
    throw new Error(validationMsg || data.message || 'La requête a échoué')
  }
  return data
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const base = config.public.apiBase

  return {
    get: (path: string) =>
      fetch(`${base}${path}`, { headers: getHeaders() }).then(handleResponse),

    post: (path: string, body: any) =>
      fetch(`${base}${path}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
      }).then(handleResponse),

    put: (path: string, body: any) =>
      fetch(`${base}${path}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(body),
      }).then(handleResponse),

    patch: (path: string, body: any) =>
      fetch(`${base}${path}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(body),
      }).then(handleResponse),

    del: (path: string) =>
      fetch(`${base}${path}`, {
        method: 'DELETE',
        headers: getHeaders(),
      }).then(handleResponse),
  }
}
