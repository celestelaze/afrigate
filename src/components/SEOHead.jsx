import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SEO_DATA = {
  '/': {
    title: "AfriGate — Transfert d'argent Maroc ↔ Afrique | Rapide & Sécurisé",
    description: "Envoyez de l'argent du Maroc vers la Côte d'Ivoire, le Sénégal, la Guinée-Bissau, le Mali, le Niger et le Burkina Faso. Calcul automatique des frais, support 24h/7j.",
  },
  '/transfer': {
    title: "Effectuer un transfert | AfriGate — Envoi d'argent MAD ↔ FCFA",
    description: "Simulez et effectuez votre transfert d'argent entre le Maroc et l'Afrique. Calcul instantané des frais (10%), conversion MAD/FCFA, validation en temps réel.",
  },
  '/login': {
    title: "Connexion | AfriGate — Votre espace personnel",
    description: "Connectez-vous à votre compte AfriGate pour accéder à votre historique de transferts et effectuer vos envois d'argent.",
  },
  '/signup': {
    title: "Créer un compte | AfriGate — Inscription gratuite",
    description: "Créez votre compte AfriGate gratuitement. Accédez à votre historique de transactions et simplifiez vos transferts d'argent vers l'Afrique.",
  },
  '/contact': {
    title: "Contact | AfriGate — Support 24h/7j par WhatsApp",
    description: "Contactez l'équipe AfriGate via WhatsApp, email ou formulaire. Support disponible 7j/7, 24h/24 pour vos transferts d'argent.",
  },
  '/faq': {
    title: "FAQ | AfriGate — Questions fréquentes sur les transferts",
    description: "Toutes les réponses à vos questions sur les transferts AfriGate : frais, délais, pays couverts, moyens de paiement, sécurité.",
  },
  '/social': {
    title: "Réseaux sociaux | AfriGate — Rejoignez la communauté",
    description: "Suivez AfriGate sur Facebook, Instagram, TikTok et WhatsApp. Taux du jour, offres spéciales et actualités sur le transfert d'argent.",
  },
  '/dashboard': {
    title: "Mon historique | AfriGate — Mes transferts",
    description: "Consultez l'historique complet de vos transferts AfriGate, les statuts et les détails de chaque transaction.",
  },
}

export default function SEOHead() {
  const { pathname } = useLocation()
  const seo = SEO_DATA[pathname] || SEO_DATA['/']

  useEffect(() => {
    document.title = seo.title
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = seo.description
  }, [pathname, seo])

  return null
}
