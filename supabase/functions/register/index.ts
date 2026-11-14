// Edge Function "register" — vérification du téléphone (NumLookup) + création du compte, côté serveur.
// La clé NumLookup reste ici (secret NUMLOOKUP_API_KEY) : elle n'est jamais envoyée au navigateur.
//
// Actions :
//   { action: 'verify',   countryCode, localNumber }                       → { ok, formatted, token }
//   { action: 'register', countryCode, localNumber, phoneToken,
//                         email, password, firstName, lastName }           → { ok }
//
// Toutes les réponses "métier" sont en HTTP 200 avec { ok:false, code, message }.

import { createClient } from 'npm:@supabase/supabase-js@2'
import {
  COUNTRIES, cleanLocalNumber, validEmail, cleanName, validPassword,
  numlookupAccepts, signToken, verifyToken,
} from './logic.ts'

const ALLOWED_ORIGINS = ['https://afrigate.vercel.app', 'http://localhost:5173']

function corsHeaders(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  }
}

const reply = (origin: string | null, body: unknown) =>
  new Response(JSON.stringify(body), { headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' } })
const fail = (origin: string | null, code: string, message: string) => reply(origin, { ok: false, code, message })

/** Limite par IP sur 10 minutes. Si la base est injoignable, on refuse (jamais de contournement). */
async function rateLimit(admin: any, key: string, max: number): Promise<'ok' | 'limited' | 'error'> {
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const { count, error } = await admin.from('edge_rate_limits')
    .select('id', { count: 'exact', head: true }).eq('key', key).gte('created_at', since)
  if (error) return 'error'
  if ((count ?? 0) >= max) return 'limited'
  const ins = await admin.from('edge_rate_limits').insert({ key })
  if (ins.error) return 'error'
  if (Math.random() < 0.05) {
    await admin.from('edge_rate_limits').delete().lt('created_at', new Date(Date.now() - 24 * 3600 * 1000).toISOString())
  }
  return 'ok'
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) })
  if (req.method !== 'POST') return fail(origin, 'method', 'Méthode non autorisée.')

  const url = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !serviceKey) return fail(origin, 'server', 'Service momentanément indisponible. Réessayez.')
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

  let body: any
  try { body = await req.json() } catch { return fail(origin, 'bad_request', 'Requête invalide.') }
  if (!body || (body.action !== 'verify' && body.action !== 'register')) {
    return fail(origin, 'bad_request', 'Requête invalide.')
  }

  const c = COUNTRIES[String(body.countryCode)]
  if (!c) return fail(origin, 'bad_country', 'Pays non pris en charge.')

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  const rl = await rateLimit(admin, `${body.action}:${ip}`, body.action === 'verify' ? 10 : 6)
  if (rl === 'limited') return fail(origin, 'rate_limited', 'Trop de tentatives. Réessayez dans quelques minutes.')
  if (rl === 'error') return fail(origin, 'server', 'Service momentanément indisponible. Réessayez.')

  const local = cleanLocalNumber(body.localNumber, c)
  if (!local) {
    return fail(origin, 'bad_phone', `Numéro invalide pour ${c.name} : ${c.digits} chiffres sans l'indicatif, ex : ${c.example}.`)
  }
  const e164 = `+${c.dial}${local}`

  // ── Vérification du téléphone ───────────────────────────────────────────────
  if (body.action === 'verify') {
    const numKey = Deno.env.get('NUMLOOKUP_API_KEY')
    if (!numKey) return fail(origin, 'not_configured', 'Vérification indisponible pour le moment. Contactez le support.')
    let data: any
    try {
      const r = await fetch(`https://api.numlookupapi.com/v1/validate/${encodeURIComponent(e164)}`, {
        headers: { apikey: numKey }, signal: AbortSignal.timeout(8000),
      })
      if (!r.ok) return fail(origin, 'lookup_unavailable', 'Vérification momentanément indisponible. Réessayez dans un instant.')
      data = await r.json()
    } catch {
      return fail(origin, 'lookup_unavailable', 'Vérification momentanément indisponible. Réessayez dans un instant.')
    }
    if (!numlookupAccepts(data, String(body.countryCode))) {
      return fail(origin, 'invalid_phone', `Ce numéro n'est pas reconnu comme valide pour ${c.name}.`)
    }
    const token = await signToken(serviceKey, { p: e164, exp: Date.now() + 15 * 60 * 1000 })
    return reply(origin, { ok: true, formatted: e164, token })
  }

  // ── Création du compte ──────────────────────────────────────────────────────
  const email = validEmail(body.email)
  const first = cleanName(body.firstName)
  const last = cleanName(body.lastName)
  if (!email) return fail(origin, 'bad_email', 'Adresse email invalide.')
  if (!first || !last) return fail(origin, 'bad_name', 'Prénom et nom requis.')
  if (!validPassword(body.password)) return fail(origin, 'weak_password', 'Mot de passe : 8 caractères minimum.')

  const payload = await verifyToken(serviceKey, body.phoneToken)
  if (!payload) return fail(origin, 'phone_not_verified', 'Vérifiez votre numéro de téléphone avant de créer le compte.')
  if (payload.p !== e164) return fail(origin, 'phone_mismatch', 'Le numéro a changé : vérifiez-le à nouveau.')

  const dup = await admin.from('profiles').select('id', { count: 'exact', head: true }).eq('phone', e164)
  if (dup.error) return fail(origin, 'server', 'Service momentanément indisponible. Réessayez.')
  if ((dup.count ?? 0) > 0) return fail(origin, 'phone_exists', 'Ce numéro est déjà associé à un compte. Connectez-vous.')

  const { data: created, error: cErr } = await admin.auth.admin.createUser({
    email,
    password: body.password,
    email_confirm: true,
    user_metadata: { first_name: first, last_name: last },
    app_metadata: { phone_verified: true },
  })
  if (cErr || !created?.user) {
    const m = (cErr?.message || '').toLowerCase()
    if (m.includes('already') || m.includes('registered') || m.includes('exists')) {
      return fail(origin, 'email_exists', 'Cet email est déjà utilisé. Connectez-vous plutôt.')
    }
    return fail(origin, 'create_failed', 'Création du compte impossible. Réessayez.')
  }

  const up = await admin.from('profiles').upsert(
    { id: created.user.id, first_name: first, last_name: last, phone: e164, country: c.name },
    { onConflict: 'id' },
  )
  if (up.error) {
    await admin.auth.admin.deleteUser(created.user.id) // pas de compte à moitié créé
    return fail(origin, 'profile_failed', 'Création du compte impossible. Réessayez.')
  }

  return reply(origin, { ok: true })
})
