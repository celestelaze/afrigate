// Logique pure (sans réseau) de l'inscription AfriGate.
// Compatible Deno (Supabase Edge) et Node 22 pour les tests.

export interface CountryInfo {
  name: string
  dial: string       // indicatif sans "+"
  digits: number     // longueur du numéro national attendu
  keepZero: boolean  // true si le 0 initial fait partie du numéro (Côte d'Ivoire)
  example: string
}

export const COUNTRIES: Record<string, CountryInfo> = {
  MA: { name: 'Maroc',         dial: '212', digits: 9,  keepZero: false, example: '6 12 34 56 78' },
  CI: { name: "Côte d'Ivoire", dial: '225', digits: 10, keepZero: true,  example: '07 00 00 00 00' },
  SN: { name: 'Sénégal',       dial: '221', digits: 9,  keepZero: false, example: '77 000 00 00' },
  GW: { name: 'Guinée-Bissau', dial: '245', digits: 9,  keepZero: false, example: '95 000 00 00' },
  ML: { name: 'Mali',          dial: '223', digits: 8,  keepZero: false, example: '70 00 00 00' },
  NE: { name: 'Niger',         dial: '227', digits: 8,  keepZero: false, example: '90 00 00 00' },
  BF: { name: 'Burkina Faso',  dial: '226', digits: 8,  keepZero: false, example: '70 00 00 00' },
}

/** Nettoie le numéro saisi et le ramène à sa forme nationale, sans indicatif. null si invalide. */
export function cleanLocalNumber(raw: unknown, c: CountryInfo): string | null {
  if (typeof raw !== 'string' || raw.length > 40) return null
  let d = raw.replace(/[\s().\-]/g, '')
  if (d.startsWith('+')) d = d.slice(1)
  else if (d.startsWith('00')) d = d.slice(2)
  if (!/^\d+$/.test(d)) return null
  // L'utilisateur a tapé l'indicatif par erreur
  if (d.length === c.digits + c.dial.length && d.startsWith(c.dial)) d = d.slice(c.dial.length)
  if (!c.keepZero) d = d.replace(/^0+/, '')
  return d.length === c.digits ? d : null
}

export function validEmail(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const e = v.trim().toLowerCase()
  if (e.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return null
  return e
}

export function cleanName(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const n = v.replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim()
  return n.length >= 1 && n.length <= 60 ? n : null
}

/** 8 caractères minimum ; 72 octets maximum (limite de bcrypt). */
export function validPassword(v: unknown): boolean {
  if (typeof v !== 'string' || v.length < 8) return false
  return new TextEncoder().encode(v).length <= 72
}

const BLOCKED_LINE_TYPES = new Set(['premium_rate', 'toll_free', 'special_services', 'paging', 'satellite'])

/** Réponse NumLookup acceptable : numéro valide, du bon pays, pas une ligne surtaxée/spéciale. */
export function numlookupAccepts(data: any, expectedIso: string): boolean {
  return !!data && data.valid === true && data.country_code === expectedIso && !BLOCKED_LINE_TYPES.has(data.line_type)
}

// ── Jeton signé "numéro vérifié" (HMAC-SHA256) ────────────────────────────────
const enc = new TextEncoder()
const b64u = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const unb64u = (s: string): Uint8Array => {
  const pad = '='.repeat((4 - (s.length % 4)) % 4)
  return Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad), (ch) => ch.charCodeAt(0))
}
const hmacKey = (secret: string, usage: KeyUsage[]) =>
  crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, usage)

export async function signToken(secret: string, payload: { p: string; exp: number }): Promise<string> {
  const body = b64u(enc.encode(JSON.stringify(payload)))
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', await hmacKey(secret, ['sign']), enc.encode(body)))
  return `${body}.${b64u(sig)}`
}

export async function verifyToken(secret: string, token: unknown): Promise<{ p: string; exp: number } | null> {
  if (typeof token !== 'string' || token.length > 600) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  try {
    const ok = await crypto.subtle.verify('HMAC', await hmacKey(secret, ['verify']), unb64u(sig), enc.encode(body))
    if (!ok) return null
    const payload = JSON.parse(new TextDecoder().decode(unb64u(body)))
    if (typeof payload?.p !== 'string' || typeof payload?.exp !== 'number' || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
