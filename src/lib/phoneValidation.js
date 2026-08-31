const NUMLOOKUP_API_KEY = 'num_live_8KItMVicYhtNF4PSG3ySADadCl46YEExbzdxturC'

// Dial codes per country (ISO code → dial code without +)
export const DIAL_CODES = {
  MA: { code: '212', label: 'Maroc', flag: '🇲🇦', digits: 9 },
  CI: { code: '225', label: "Côte d'Ivoire", flag: '🇨🇮', digits: 10 },
  SN: { code: '221', label: 'Sénégal', flag: '🇸🇳', digits: 9 },
  GW: { code: '245', label: 'Guinée-Bissau', flag: '🇬🇼', digits: 9 },
  ML: { code: '223', label: 'Mali', flag: '🇲🇱', digits: 8 },
  NE: { code: '227', label: 'Niger', flag: '🇳🇪', digits: 8 },
  BF: { code: '226', label: 'Burkina Faso', flag: '🇧🇫', digits: 8 },
}

/**
 * Validate a phone number via NumLookup API.
 * @param {string} localNumber - number without country prefix
 * @param {string} countryCode - ISO Alpha-2 code (e.g. 'SN')
 * @returns {Promise<{valid: boolean, formatted: string, carrier: string, error?: string}>}
 */
export async function validatePhone(localNumber, countryCode) {
  if (!localNumber || !countryCode) return { valid: false, error: 'Numéro ou pays manquant' }

  // Strip any leading 0 or spaces
  const clean = localNumber.replace(/\s+/g, '').replace(/^0+/, '')
  const dial = DIAL_CODES[countryCode]
  if (!dial) return { valid: false, error: 'Pays non reconnu' }

  const fullNumber = `${dial.code}${clean}`

  try {
    const res = await fetch(
      `https://api.numlookupapi.com/v1/validate/${fullNumber}?country_code=${countryCode}`,
      { headers: { apikey: NUMLOOKUP_API_KEY } }
    )
    const data = await res.json()

    if (data.valid) {
      return {
        valid: true,
        formatted: data.international_format,
        carrier: data.carrier || '',
        line_type: data.line_type,
      }
    } else {
      return { valid: false, error: 'Numéro invalide ou non reconnu' }
    }
  } catch {
    // If API fails, allow submission (don't block user)
    return { valid: true, formatted: `+${fullNumber}`, carrier: '', error: null }
  }
}

/**
 * Format placeholder based on country
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
