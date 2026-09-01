// Dial codes per country (ISO code → dial code without +)
export const DIAL_CODES = {
  MA: { code: '212', label: 'Maroc',        flag: '🇲🇦', digits: 9 },
  CI: { code: '225', label: "Côte d'Ivoire", flag: '🇨🇮', digits: 10 },
  SN: { code: '221', label: 'Sénégal',       flag: '🇸🇳', digits: 9 },
  GW: { code: '245', label: 'Guinée-Bissau', flag: '🇬🇼', digits: 9 },
  ML: { code: '223', label: 'Mali',          flag: '🇲🇱', digits: 8 },
  NE: { code: '227', label: 'Niger',         flag: '🇳🇪', digits: 8 },
  BF: { code: '226', label: 'Burkina Faso',  flag: '🇧🇫', digits: 8 },
}

const NUMLOOKUP_API_KEY = 'num_live_8KItMVicYhtNF4PSG3ySADadCl46YEExbzdxturC'

/**
 * Clean the local number: remove spaces, leading zeros, 
 * and also strip the country dial code if user accidentally typed it
 */
function cleanLocalNumber(raw, countryCode) {
  const dial = DIAL_CODES[countryCode]
  if (!dial) return raw.replace(/\s+/g, '')

  let num = raw.replace(/\s+/g, '').replace(/^0+/, '').replace(/^\+/, '')
  
  // If user typed the full number with country code, strip it
  if (num.startsWith(dial.code)) {
    num = num.slice(dial.code.length)
  }
  // Remove any leading zeros again after stripping
  num = num.replace(/^0+/, '')
  return num
}

/**
 * Basic local format validation (digits only, reasonable length)
 */
function isReasonableFormat(localNum, countryCode) {
  const digits = localNum.replace(/\D/g, '')
  const dial = DIAL_CODES[countryCode]
  if (!dial) return digits.length >= 6
  // Accept ±2 digits tolerance around expected length
  return digits.length >= dial.digits - 2 && digits.length <= dial.digits + 2
}

/**
 * Validate phone number.
 * - First cleans the input
 * - Tries NumLookup API
 * - Falls back to format check if API unavailable
 * - NEVER blocks the user if format looks reasonable
 */
export async function validatePhone(localNumber, countryCode) {
  if (!localNumber || !countryCode) {
    return { valid: false, formatted: '', error: 'Veuillez saisir votre numéro' }
  }

  const dial = DIAL_CODES[countryCode]
  if (!dial) return { valid: true, formatted: localNumber, error: null }

  const clean = cleanLocalNumber(localNumber, countryCode)
  const fullNumber = `${dial.code}${clean}`
  const formatted = `+${fullNumber}`

  // If format is clearly wrong, reject early
  if (!isReasonableFormat(clean, countryCode)) {
    return {
      valid: false,
      formatted,
      error: `Numéro trop court ou trop long pour ${dial.label}`
    }
  }

  // Try API validation (non-blocking - if API fails, accept the number)
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000) // 5s timeout

    const res = await fetch(
      `https://api.numlookupapi.com/v1/validate/${fullNumber}`,
      {
        headers: { apikey: NUMLOOKUP_API_KEY },
        signal: controller.signal
      }
    )
    clearTimeout(timeout)

    if (res.ok) {
      const data = await res.json()
      if (data.valid === false) {
        // API says invalid but format looks ok → still allow (non-blocking)
        // Only hard-block if format also seems wrong
        return { valid: true, formatted, error: null }
      }
      return {
        valid: true,
        formatted: data.international_format || formatted,
        carrier: data.carrier || '',
        error: null
      }
    }
  } catch (e) {
    // API timeout or network error → don't block user
  }

  // Fallback: format looked ok, allow it
  return { valid: true, formatted, error: null }
}

/**
 * Placeholder example per country
 */
export function getPlaceholder(countryCode) {
  const examples = {
    MA: '6 12 34 56 78',
    CI: '07 00 00 00 00',
    SN: '77 000 00 00',
    GW: '95 000 00 00',
    ML: '70 00 00 00',
    NE: '90 00 00 00',
    BF: '70 00 00 00',
  }
  return examples[countryCode] || '00 00 00 00'
}
