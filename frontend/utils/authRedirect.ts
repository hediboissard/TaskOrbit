/** Internal path only — avoids open redirects. */
export function safeRedirectPath(
  raw: string | string[] | undefined | null
): string | null {
  if (raw == null || Array.isArray(raw)) return null
  const p = raw.trim()
  if (!p.startsWith('/') || p.startsWith('//')) return null
  if (p.startsWith('/auth')) return null
  return p
}
