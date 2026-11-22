// Brouillon de transfert : conservé dans l'onglet (sessionStorage) le temps de s'inscrire ou de se connecter.
const KEY = 'afrigate_transfer_draft'
const MAX_AGE_MS = 30 * 60 * 1000 // 30 minutes

export function saveDraft(data) {
  try { sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), data })) } catch { /* stockage indisponible */ }
}

export function readDraft() {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const { at, data } = JSON.parse(raw)
    if (typeof at !== 'number' || Date.now() - at > MAX_AGE_MS) { sessionStorage.removeItem(KEY); return null }
    const ok = data && typeof data === 'object' && data.form && typeof data.form === 'object'
      && Number.isInteger(data.step) && data.step >= 0 && data.step <= 4
    return ok ? data : null
  } catch {
    return null
  }
}

export function clearDraft() {
  try { sessionStorage.removeItem(KEY) } catch { /* ignoré */ }
}
