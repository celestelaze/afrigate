export const COUNTRIES = [
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', currency: 'FCFA', dialCode: '+225' },
  { code: 'SN', name: 'Sénégal',       flag: '🇸🇳', currency: 'FCFA', dialCode: '+221' },
  { code: 'GW', name: 'Guinée-Bissau', flag: '🇬🇼', currency: 'FCFA', dialCode: '+245' },
  { code: 'ML', name: 'Mali',          flag: '🇲🇱', currency: 'FCFA', dialCode: '+223' },
  { code: 'NE', name: 'Niger',         flag: '🇳🇪', currency: 'FCFA', dialCode: '+227' },
  { code: 'BF', name: 'Burkina Faso',  flag: '🇧🇫', currency: 'FCFA', dialCode: '+226' },
]

export const MOROCCO = { code: 'MA', name: 'Maroc', flag: '🇲🇦', currency: 'MAD', dialCode: '+212' }

// 1 MAD = X FCFA
export const RATE_MAD_TO_FCFA = 57   // Maroc → Afrique
export const RATE_FCFA_TO_MAD = 63   // Afrique → Maroc (1 MAD = 63 FCFA)
export const FEES_PERCENT = 0.10

export const AFRICA_SEND_METHODS = [
  {
    id: 'orange_money',
    name: 'Orange Money',
    desc: 'Mobile Money',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_Money_logo.svg/320px-Orange_Money_logo.svg.png',
    color: '#FF7900',
  },
  {
    id: 'wave',
    name: 'Wave',
    desc: 'Mobile Money',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Wave_money_logo.svg/320px-Wave_money_logo.svg.png',
    color: '#1DC8EE',
  },
]

export const MOROCCO_RECEIVE_METHODS = [
  {
    id: 'cih',
    name: 'CIH Bank',
    desc: 'Virement bancaire',
    logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/7/79/CIH_Bank_logo.svg/320px-CIH_Bank_logo.svg.png',
    color: '#E30613',
  },
  {
    id: 'boa',
    name: 'Bank of Africa',
    desc: 'Virement bancaire',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Bank_of_Africa_logo.svg/320px-Bank_of_Africa_logo.svg.png',
    color: '#005BAA',
  },
  {
    id: 'cashplus',
    name: 'Cash Plus',
    desc: 'Retrait en agence',
    logo: 'https://www.cashplus.ma/images/logo-cashplus.png',
    color: '#009246',
  },
  {
    id: 'wafacash',
    name: 'Wafa Cash',
    desc: 'Retrait en agence',
    logo: 'https://www.wafacash.com/images/logo-wafacash.png',
    color: '#C8102E',
  },
]

export const MOROCCO_SEND_METHODS = MOROCCO_RECEIVE_METHODS

export const AFRICA_RECEIVE_METHODS = AFRICA_SEND_METHODS

export const WHATSAPP_NUMBER = '221776997546'

export const TESTIMONIALS = [
  { name: 'Fatima B.', country: 'Maroc', flag: '🇲🇦', stars: 5, text: "AfriGate m'a permis d'envoyer de l'argent à ma famille en Côte d'Ivoire en moins d'une heure. Je recommande les yeux fermés !", initials: 'FB' },
  { name: 'Moussa D.', country: 'Sénégal', flag: '🇸🇳', stars: 5, text: "Le support WhatsApp est réactif et professionnel. Je me sens vraiment en sécurité à chaque transfert.", initials: 'MD' },
  { name: 'Aminata K.', country: "Côte d'Ivoire", flag: '🇨🇮', stars: 5, text: "Les frais sont clairs, pas de mauvaises surprises. C'est rare et ça mérite d'être souligné.", initials: 'AK' },
  { name: 'Youssef M.', country: 'Maroc', flag: '🇲🇦', stars: 5, text: "Enfin un service qui inspire vraiment confiance. J'utilise AfriGate chaque mois sans aucun problème.", initials: 'YM' },
  { name: 'Ibrahim S.', country: 'Mali', flag: '🇲🇱', stars: 5, text: "Simple, rapide, efficace. Je n'utilise plus rien d'autre pour mes envois. Merci AfriGate !", initials: 'IS' },
  { name: 'Mariama C.', country: 'Burkina Faso', flag: '🇧🇫', stars: 5, text: "Le calcul automatique des frais m'a vraiment surprise. Interface magnifique et très pratique.", initials: 'MC' },
]
