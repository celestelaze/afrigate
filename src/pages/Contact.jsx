import { useState } from 'react'
import { Mail, Phone, Clock, MessageCircle, CheckCircle } from 'lucide-react'
import { WHATSAPP_NUMBER } from '../lib/constants'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function handleSubmit(e) {
    e.preventDefault()
    // In production, connect to a backend or email service
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-gold-DEFAULT text-sm font-bold uppercase tracking-widest">Nous joindre</span>
          <h1 className="font-display text-4xl font-extrabold text-navy mt-2">Contactez-nous</h1>
          <p className="text-gray-400 mt-3 max-w-lg mx-auto">Notre équipe est disponible 7j/7, 24h/24 pour vous accompagner dans vos transferts.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-navy mb-2">Message envoyé !</h3>
                <p className="text-gray-400">Nous vous répondrons dans les meilleurs délais.</p>
              </div>
            ) : (
              <>
                <h2 className="font-display text-xl font-bold text-navy mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">Nom complet</label>
                      <input value={form.name} onChange={e => set('name', e.target.value)} required
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold-DEFAULT outline-none text-navy" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">Email</label>
                      <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold-DEFAULT outline-none text-navy" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">Objet</label>
                    <input value={form.subject} onChange={e => set('subject', e.target.value)} required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold-DEFAULT outline-none text-navy" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">Message</label>
                    <textarea rows={5} value={form.message} onChange={e => set('message', e.target.value)} required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold-DEFAULT outline-none text-navy resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full py-3.5 rounded-xl bg-navy text-white font-bold hover:bg-navy-light transition-colors shadow-lg shadow-navy/20">
                    Envoyer le message
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, title: 'Email', content: 'afrigate@zohomail.com', href: 'mailto:afrigate@zohomail.com', color: 'bg-blue-50', ic: 'text-blue-500' },
              { icon: Phone, title: 'Téléphone', content: '+221 77 699 75 46', href: 'tel:+221776997546', color: 'bg-green-50', ic: 'text-green-500' },
              { icon: Clock, title: 'Horaires', content: 'Lundi – Dimanche, 24h/24, 7j/7', href: null, color: 'bg-gold-DEFAULT/10', ic: 'text-gold-DEFAULT' },
            ].map(({ icon: Icon, title, content, href, color, ic }) => (
              <div key={title} className={`flex items-center gap-4 ${color} rounded-2xl p-5`}>
                <div className={`w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center ${ic}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">{title}</div>
                  {href
                    ? <a href={href} className="font-semibold text-navy hover:text-gold-DEFAULT transition-colors">{content}</a>
                    : <div className="font-semibold text-navy">{content}</div>
                  }
                </div>
              </div>
            ))}

            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour AfriGate 👋,\n\nJe souhaite obtenir de l'aide de votre support concernant une demande de transfert d'argent.\n\nPourriez-vous m'accompagner s'il vous plaît ?\n\nMerci.")}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-4 bg-green-500 rounded-2xl p-5 hover:bg-green-600 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-0.5">WhatsApp Business</div>
                <div className="text-white font-bold">Contacter le support directement</div>
              </div>
              <MessageCircle size={20} className="ml-auto text-white/70 group-hover:text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
