import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Zap, Users, Lock, TrendingUp, Smartphone, Star, ChevronRight, ArrowRight } from 'lucide-react'
import { COUNTRIES, MOROCCO, TESTIMONIALS } from '../lib/constants'

/* ── Animated counter ── */
function Counter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        let start = 0
        const step = end / (duration / 16)
        const t = setInterval(() => {
          start += step
          if (start >= end) { setCount(end); clearInterval(t) }
          else setCount(Math.floor(start))
        }, 16)
      }
    })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

/* ── Payment method pill for hero ── */
const methodBadges = ['Orange Money', 'Wave', 'CIH Bank', 'Bank of Africa', 'Cash Plus', 'Wafa Cash']

export default function Home() {
  const allCountries = [MOROCCO, ...COUNTRIES]

  return (
    <div className="overflow-x-hidden">

      {/* ═══ HERO ═══ */}
      <section className="bg-mesh min-h-screen flex items-center pt-20 pb-16 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gold-DEFAULT/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/6 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="text-white animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Service disponible 24h/7j
              </div>

              <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-6">
                Envoyez de l'argent{' '}
                <span className="text-gradient">en toute confiance</span>
              </h1>

              <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-lg">
                Transferts rapides et sécurisés entre le <strong className="text-white">Maroc</strong>, la <strong className="text-white">Côte d'Ivoire</strong>, le <strong className="text-white">Sénégal</strong>, la <strong className="text-white">Guinée-Bissau</strong>, le <strong className="text-white">Mali</strong>, le <strong className="text-white">Niger</strong> et le <strong className="text-white">Burkina Faso</strong>.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link to="/transfer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gold-DEFAULT text-navy font-bold text-base hover:bg-gold-light transition-all shadow-lg shadow-gold-DEFAULT/30 animate-pulse-gold">
                  Envoyer de l'argent <ArrowRight size={18} />
                </Link>
                <a href="#how-it-works"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all">
                  Comment ça marche
                </a>
              </div>

              {/* Payment badges */}
              <div className="flex flex-wrap gap-2">
                {methodBadges.map(m => (
                  <span key={m} className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/10">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — countries + stats */}
            <div className="animate-fade-up animate-delay-200">
              {/* Countries grid */}
              <div className="glass rounded-3xl p-6 mb-6">
                <p className="text-white/60 text-xs uppercase tracking-widest mb-4 font-semibold">Pays couverts</p>
                <div className="grid grid-cols-2 gap-3">
                  {allCountries.map((c, i) => (
                    <div key={c.code}
                      className="flex items-center gap-3 bg-white/10 rounded-xl px-3 py-2.5 hover:bg-white/15 transition-colors cursor-default"
                      style={{ animationDelay: `${i * 80}ms` }}>
                      <span className="text-2xl">{c.flag}</span>
                      <span className="text-white text-sm font-medium">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: 10000, suffix: '+', label: 'Transactions' },
                  { val: 7, suffix: '', label: 'Pays couverts' },
                  { val: 98, suffix: '%', label: 'Satisfaction' },
                  { val: 24, suffix: 'h/7j', label: 'Support humain' },
                ].map(s => (
                  <div key={s.label} className="glass rounded-2xl p-4 text-center">
                    <div className="text-2xl font-display font-extrabold text-gold-DEFAULT">
                      <Counter end={s.val} suffix={s.suffix} />
                    </div>
                    <div className="text-white/60 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gold-DEFAULT text-sm font-bold uppercase tracking-widest">Simple & rapide</span>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-navy mt-2">Comment ça marche</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">En 3 étapes simples, envoyez de l'argent à vos proches où qu'ils soient.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              { num: '01', icon: '🔢', title: 'Simulez votre transfert', desc: 'Choisissez les pays, entrez le montant, et voyez instantanément le calcul des frais et le montant reçu.' },
              { num: '02', icon: '💬', title: 'Confirmez sur WhatsApp', desc: "Un message pré-rempli avec tous les détails s'envoie à notre équipe via WhatsApp Business." },
              { num: '03', icon: '✅', title: 'Transfert confirmé', desc: "Notre équipe traite votre demande et confirme rapidement. Votre bénéficiaire reçoit l'argent." },
            ].map((s, i) => (
              <div key={i} className="relative text-center group">
                <div className="w-16 h-16 rounded-2xl bg-navy/5 flex items-center justify-center text-3xl mx-auto mb-5 group-hover:bg-gold-DEFAULT/10 transition-colors">
                  {s.icon}
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-7 h-7 rounded-full bg-gold-DEFAULT text-navy text-xs font-extrabold flex items-center justify-center">
                  {s.num.split('')[1]}
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] right-[calc(-50%+40px)] h-0.5 bg-gradient-to-r from-gold-DEFAULT/60 to-navy/20" />
                )}
                <h3 className="font-display font-bold text-navy text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/transfer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-navy text-white font-bold hover:bg-navy-light transition-colors shadow-lg shadow-navy/20">
              Démarrer un transfert <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ QUICK SIMULATOR ═══ */}
      <section className="py-20 bg-navy/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold-DEFAULT text-sm font-bold uppercase tracking-widest">Calcul instantané</span>
          <h2 className="font-display text-3xl font-extrabold text-navy mt-2 mb-3">Simulez votre transfert</h2>
          <p className="text-gray-500 mb-8">Estimez en temps réel le montant que votre bénéficiaire recevra.</p>
          <QuickSimulator />
        </div>
      </section>

      {/* ═══ WHY US ═══ */}
      <section id="trust" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gold-DEFAULT text-sm font-bold uppercase tracking-widest">Notre engagement</span>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-navy mt-2">Pourquoi choisir AfriGate</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Sécurité maximale', desc: 'Chiffrement de bout en bout. Vos données et votre argent sont protégés à chaque instant.' },
              { icon: Zap, title: 'Rapide et fiable', desc: 'Traitement express par notre équipe dédiée. Chaque transfert est suivi en temps réel.' },
              { icon: Users, title: 'Support humain 24/7', desc: 'Un vrai agent vous accompagne via WhatsApp à chaque étape de votre transfert.' },
              { icon: Lock, title: 'Données privées', desc: 'Aucune donnée personnelle n\'est partagée avec des tiers. Vie privée garantie.' },
              { icon: TrendingUp, title: 'Taux compétitifs', desc: 'Taux de change transparents et affichés clairement. Aucune surprise à la fin.' },
              { icon: Smartphone, title: 'Simple et intuitif', desc: 'Interface pensée pour tous. Effectuez un transfert en moins de 3 minutes.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="card-hover bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-gold-DEFAULT/10 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-gold-DEFAULT" />
                </div>
                <h3 className="font-display font-bold text-navy mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" className="py-24 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gold-DEFAULT text-sm font-bold uppercase tracking-widest">Ils nous font confiance</span>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-white mt-2">Ce que disent nos clients</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass rounded-2xl p-6 card-hover">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} className="text-gold-DEFAULT fill-gold-DEFAULT" />
                  ))}
                </div>
                <p className="text-blue-100 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-DEFAULT/20 flex items-center justify-center text-gold-DEFAULT font-bold text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-blue-300 text-xs">{t.flag} {t.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PARTNERS ═══ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm uppercase tracking-widest font-semibold mb-10">Nos partenaires de confiance</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              { name: 'CIH Bank', bg: '#E30613', text: 'white' },
              { name: 'Bank of Africa', bg: '#005BAA', text: 'white' },
              { name: 'Cash Plus', bg: '#009246', text: 'white' },
              { name: 'Wafa Cash', bg: '#C8102E', text: 'white' },
              { name: 'Orange Money', bg: '#FF7900', text: 'white' },
              { name: 'Wave', bg: '#1DC8EE', text: 'white' },
            ].map(p => (
              <div key={p.name}
                className="px-6 py-3 rounded-xl font-display font-bold text-sm shadow-md"
                style={{ backgroundColor: p.bg, color: p.text }}>
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="py-20 bg-mesh">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-white mb-4">
            Prêt à envoyer de l'argent ?
          </h2>
          <p className="text-blue-200 mb-8">Créez votre compte gratuitement et effectuez votre premier transfert en quelques minutes.</p>
          <Link to="/transfer"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-gold-DEFAULT text-navy font-bold text-lg hover:bg-gold-light transition-all shadow-xl shadow-gold-DEFAULT/30 animate-pulse-gold">
            Commencer maintenant <ArrowRight size={20} />
          </Link>
        </div>
      </section>

    </div>
  )
}

/* ── Quick simulator widget ── */
function QuickSimulator() {
  const [dir, setDir] = useState('MAD_TO_FCFA')
  const [amount, setAmount] = useState('')

  const isMad = dir === 'MAD_TO_FCFA'
  const rate = isMad ? 57 : 63
  const fees = amount ? Math.round(parseFloat(amount) * 0.1 * 100) / 100 : 0
  const total = amount ? Math.round((parseFloat(amount) + fees) * 100) / 100 : 0
  const received = amount
    ? isMad
      ? Math.round(parseFloat(amount) * rate)
      : Math.round((parseFloat(amount) / rate) * 100) / 100
    : 0

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 text-left">
      {/* Direction toggle */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { val: 'MAD_TO_FCFA', label: '🇲🇦 Maroc → Afrique', sub: '1 MAD = 57 FCFA' },
          { val: 'FCFA_TO_MAD', label: '🌍 Afrique → 🇲🇦 Maroc', sub: '1 MAD = 63 FCFA' },
        ].map(d => (
          <button key={d.val} onClick={() => { setDir(d.val); setAmount('') }}
            className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all text-center ${
              dir === d.val ? 'border-gold-DEFAULT bg-gold-DEFAULT/5 text-navy' : 'border-gray-200 text-gray-400 hover:border-gray-300'
            }`}>
            <div>{d.label}</div>
            <div className={`text-xs mt-0.5 ${dir === d.val ? 'text-gold-dark' : 'text-gray-400'}`}>{d.sub}</div>
          </button>
        ))}
      </div>

      {/* Amount */}
      <label className="block text-sm font-semibold text-navy mb-2">
        Montant à envoyer ({isMad ? 'MAD' : 'FCFA'})
      </label>
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
        placeholder={isMad ? 'ex: 500' : 'ex: 25000'}
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-navy font-semibold text-lg focus:border-gold-DEFAULT outline-none transition-colors mb-6" />

      {/* Result */}
      {amount && parseFloat(amount) > 0 && (
        <div className="bg-navy rounded-2xl p-5 space-y-3">
          {[
            ['Montant envoyé', `${parseFloat(amount).toLocaleString()} ${isMad ? 'MAD' : 'FCFA'}`, false],
            ['Frais de service (10%)', `+ ${fees.toLocaleString()} ${isMad ? 'MAD' : 'FCFA'}`, false],
            ['Total à payer', `${total.toLocaleString()} ${isMad ? 'MAD' : 'FCFA'}`, false],
            ['Le bénéficiaire reçoit', `${received.toLocaleString()} ${isMad ? 'FCFA' : 'MAD'}`, true],
          ].map(([label, val, highlight]) => (
            <div key={label} className={`flex justify-between items-center ${highlight ? 'pt-3 border-t border-white/10' : ''}`}>
              <span className={`text-sm ${highlight ? 'text-white font-bold' : 'text-blue-200'}`}>{label}</span>
              <span className={`font-bold ${highlight ? 'text-gold-DEFAULT text-lg' : 'text-white'}`}>{val}</span>
            </div>
          ))}
        </div>
      )}

      <Link to="/transfer"
        className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gold-DEFAULT text-navy font-bold hover:bg-gold-light transition-colors">
        Continuer le transfert <ChevronRight size={18} />
      </Link>
    </div>
  )
}
