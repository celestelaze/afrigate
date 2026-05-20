export const COUNTRIES = [
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', currency: 'FCFA', dialCode: '+225' },
  { code: 'SN', name: 'Sénégal',       flag: '🇸🇳', currency: 'FCFA', dialCode: '+221' },
  { code: 'GW', name: 'Guinée-Bissau', flag: '🇬🇼', currency: 'FCFA', dialCode: '+245' },
  { code: 'ML', name: 'Mali',          flag: '🇲🇱', currency: 'FCFA', dialCode: '+223' },
  { code: 'NE', name: 'Niger',         flag: '🇳🇪', currency: 'FCFA', dialCode: '+227' },
  { code: 'BF', name: 'Burkina Faso',  flag: '🇧🇫', currency: 'FCFA', dialCode: '+226' },
]

export const MOROCCO = { code: 'MA', name: 'Maroc', flag: '🇲🇦', currency: 'MAD', dialCode: '+212' }

export const RATE_MAD_TO_FCFA = 57
export const RATE_FCFA_TO_MAD = 63
export const FEES_PERCENT = 0.10

export const AFRICA_SEND_METHODS = [
  {
    id: 'orange_money',
    name: 'Orange Money',
    desc: 'Mobile Money',
    logo: '/logos/orangemoney.jpeg',
    color: '#FF7900',
  },
  {
    id: 'wave',
    name: 'Wave',
    desc: 'Mobile Money',
    logo: '/logos/wave.png',
    color: '#1DC8EE',
  },
]

export const MOROCCO_RECEIVE_METHODS = [
  {
    id: 'cih',
    name: 'CIH Bank',
    desc: 'Virement bancaire',
    logo: '/logos/cihbank.jpeg',
    color: '#E30613',
  },
  {
    id: 'boa',
    name: 'Bank of Africa',
    desc: 'Virement bancaire',
    logo: '/logos/bankofafrica.png',
    color: '#1B4F9F',
  },
  {
    id: 'cashplus',
    name: 'Cash Plus',
    desc: 'Retrait en agence',
    logo: '/logos/cashplus.webp',
    color: '#00A99D',
  },
  {
    id: 'wafacash',
    name: 'Wafa Cash',
    desc: 'Retrait en agence',
    logo: '/logos/wafacash.png',
    color: '#F5C400',
  },
]

export const MOROCCO_SEND_METHODS = MOROCCO_RECEIVE_METHODS
export const AFRICA_RECEIVE_METHODS = AFRICA_SEND_METHODS

export const WHATSAPP_NUMBER = '221776997546'
export const CONTACT_PHONE = '+221 77 699 75 46'
export const CONTACT_EMAIL = 'afrigate@zohomail.com'

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/14d6oQuFg65/?mibextid=wwXIfr',
  instagram: 'https://www.instagram.com/afrigate_transfert?igsh=ZmJmdWEyMjJjNmll&utm_source=qr',
  tiktok: 'https://www.tiktok.com/@afrigate_transfert?_r=1&_t=ZS-96WbVH8fpau',
  whatsapp: 'https://wa.me/221776997546',
}

export const TESTIMONIALS = [
  { name: 'Fatima B.', country: 'Maroc', flag: '🇲🇦', stars: 5, text: "AfriGate m'a permis d'envoyer de l'argent à ma famille en Côte d'Ivoire en moins d'une heure. Je recommande les yeux fermés !", initials: 'FB' },
  { name: 'Moussa D.', country: 'Sénégal', flag: '🇸🇳', stars: 5, text: "Le support WhatsApp est réactif et professionnel. Je me sens vraiment en sécurité à chaque transfert.", initials: 'MD' },
  { name: 'Aminata K.', country: "Côte d'Ivoire", flag: '🇨🇮', stars: 5, text: "Les frais sont clairs, pas de mauvaises surprises. C'est rare et ça mérite d'être souligné.", initials: 'AK' },
  { name: 'Youssef M.', country: 'Maroc', flag: '🇲🇦', stars: 5, text: "Enfin un service qui inspire vraiment confiance. J'utilise AfriGate chaque mois sans aucun problème.", initials: 'YM' },
  { name: 'Ibrahim S.', country: 'Mali', flag: '🇲🇱', stars: 5, text: "Simple, rapide, efficace. Je n'utilise plus rien d'autre pour mes envois. Merci AfriGate !", initials: 'IS' },
  { name: 'Mariama C.', country: 'Burkina Faso', flag: '🇧🇫', stars: 5, text: "Le calcul automatique des frais m'a vraiment surprise. Interface magnifique et très pratique.", initials: 'MC' },
]

export const ALL_PARTNERS = [
  { name: 'Orange Money', logo: '/logos/orangemoney.jpeg', bg: 'white' },
  { name: 'Wave',         logo: '/logos/wave.png',        bg: '#1DC8EE' },
  { name: 'CIH Bank',    logo: '/logos/cihbank.jpeg',     bg: 'white' },
  { name: 'Bank of Africa', logo: '/logos/bankofafrica.png', bg: '#1B4F9F' },
  { name: 'Cash Plus',   logo: '/logos/cashplus.webp',    bg: 'white' },
  { name: 'Wafa Cash',   logo: '/logos/wafacash.png',     bg: 'white' },
]
