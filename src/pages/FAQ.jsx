import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const FAQS = [
  {
    category: '💸 Transferts',
    items: [
      { q: 'Quels pays sont couverts par AfriGate ?', a: "AfriGate couvre les transferts entre le Maroc (MAD) et 6 pays d'Afrique de l'Ouest : la Côte d'Ivoire, le Sénégal, la Guinée-Bissau, le Mali, le Niger et le Burkina Faso (FCFA)." },
      { q: 'Quels sont les frais de service ?', a: "AfriGate applique des frais de 10% sur le montant envoyé. Ces frais sont affichés clairement et calculés automatiquement avant toute confirmation. Aucune surprise." },
      { q: 'Quel est le délai de traitement ?', a: "La plupart des transferts sont traités en 15 à 30 minutes durant les heures d'activité. Notre équipe est disponible 24h/7j via WhatsApp pour tout suivi." },
      { q: "Quel est le montant minimum et maximum d'un transfert ?", a: "Il n'y a pas de montant minimum fixe. Pour les transferts de grande valeur, contactez notre support via WhatsApp pour un traitement personnalisé." },
    ]
  },
  {
    category: '💳 Moyens de paiement',
    items: [
      { q: 'Quels moyens de paiement sont acceptés depuis le Maroc ?', a: "Depuis le Maroc, vous pouvez envoyer via CIH Bank (virement), Bank of Africa (virement), Cash Plus (dépôt agence) ou Wafa Cash (dépôt agence)." },
      { q: "Quels moyens de paiement sont disponibles en Afrique de l'Ouest ?", a: "En Afrique de l'Ouest, les paiements et réceptions se font via Orange Money et Wave (Mobile Money)." },
      { q: 'Le bénéficiaire doit-il avoir un compte bancaire ?', a: "Non ! Avec Orange Money et Wave, le bénéficiaire peut recevoir directement sur son téléphone sans compte bancaire." },
    ]
  },
  {
    category: '🔒 Sécurité & Confiance',
    items: [
      { q: 'Mes données sont-elles sécurisées ?', a: "Oui. AfriGate utilise Supabase avec chiffrement de bout en bout et sécurité de niveau bancaire. Vos données ne sont jamais partagées avec des tiers." },
      { q: 'Comment puis-je suivre mon transfert ?', a: "Après confirmation, vous recevez une référence unique (ex: AFG-2025-XXXX). Utilisez-la pour contacter notre support WhatsApp et obtenir un suivi en temps réel." },
      { q: 'Que faire si mon transfert tarde à arriver ?', a: "Contactez immédiatement notre support via WhatsApp (+221 77 699 75 46) avec votre référence de transaction. Nous résolvons tout problème en moins d'une heure." },
    ]
  },
  {
    category: '👤 Compte & Inscription',
    items: [
      { q: "Dois-je créer un compte pour effectuer un transfert ?", a: "Non, vous pouvez effectuer un transfert sans compte. Cependant, créer un compte vous permet d'accéder à votre historique de transactions et de pré-remplir vos informations." },
      { q: "Comment créer un compte AfriGate ?", a: "Cliquez sur 'Inscription' dans la barre de navigation, renseignez vos informations (nom, email, téléphone, pays) et créez votre mot de passe. C'est gratuit et rapide." },
    ]
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-navy pr-4">{q}</span>
        {open ? <ChevronUp size={20} className="text-gold-DEFAULT flex-shrink-0" /> : <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-4">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-white pt-8 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold-DEFAULT text-sm font-bold uppercase tracking-widest">Aide</span>
          <h1 className="font-display text-4xl font-extrabold text-navy mt-2">Questions fréquentes</h1>
          <p className="text-gray-400 mt-3">Tout ce que vous devez savoir sur AfriGate et vos transferts.</p>
        </div>

        <div className="space-y-10">
          {FAQS.map(cat => (
            <div key={cat.category}>
              <h2 className="font-display font-bold text-xl text-navy mb-4">{cat.category}</h2>
              <div className="space-y-3">
                {cat.items.map(item => <FAQItem key={item.q} {...item} />)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-navy rounded-3xl p-8 text-center">
          <h3 className="font-display text-xl font-bold text-white mb-2">Vous n'avez pas trouvé votre réponse ?</h3>
          <p className="text-blue-200 mb-5 text-sm">Notre équipe répond en moins de 30 minutes sur WhatsApp.</p>
          <a href="https://wa.me/221776997546" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Contacter le support
          </a>
        </div>
      </div>
    </div>
  )
}
