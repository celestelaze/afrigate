import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Check, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthContext'
import {
  COUNTRIES, MOROCCO,
  RATE_MAD_TO_FCFA, RATE_FCFA_TO_MAD, FEES_PERCENT,
  AFRICA_SEND_METHODS, AFRICA_RECEIVE_METHODS,
  MOROCCO_SEND_METHODS, MOROCCO_RECEIVE_METHODS,
  WHATSAPP_NUMBER,
} from '../lib/constants'

const STEPS = ['Direction', 'Pays', 'Paiement', 'Montant', 'Résumé']

export default function Transfer() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    direction: '',        // 'MAD_TO_FCFA' | 'FCFA_TO_MAD'
    originCountry: null,
    destCountry: null,
    sendMethod: null,
    receiveMethod: null,
    amount: '',
    beneficiaryFirst: '',
    beneficiaryLast: '',
    beneficiaryPhone: '',
    senderName: profile ? `${profile.first_name} ${profile.last_name}` : '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const isMad = form.direction === 'MAD_TO_FCFA'
  const rate = isMad ? RATE_MAD_TO_FCFA : RATE_FCFA_TO_MAD
  const amt = parseFloat(form.amount) || 0
  const fees = Math.round(amt * FEES_PERCENT * 100) / 100
  const total = Math.round((amt + fees) * 100) / 100
  const received = isMad
    ? Math.round(amt * rate)
    : Math.round((amt / rate) * 100) / 100

  const sendMethods = isMad ? MOROCCO_SEND_METHODS : AFRICA_SEND_METHODS
  const receiveMethods = isMad ? AFRICA_RECEIVE_METHODS : MOROCCO_RECEIVE_METHODS

  function canNext() {
    if (step === 0) return !!form.direction
    if (step === 1) return form.originCountry && form.destCountry
    if (step === 2) return form.sendMethod && form.receiveMethod
    if (step === 3) return amt > 0 && form.beneficiaryFirst && form.beneficiaryLast && form.beneficiaryPhone
    return true
  }

  async function handleConfirm() {
    const ref = `AFG-2025-${Math.random().toString(36).substring(2,8).toUpperCase()}`

    // Save to Supabase if logged in
    if (user) {
      await supabase.from('transfers').insert({
        user_id: user.id,
        direction: form.direction,
        origin_country: form.originCountry?.name,
        destination_country: form.destCountry?.name,
        send_method: form.sendMethod?.name,
        receive_method: form.receiveMethod?.name,
        amount: amt,
        fees,
        total_to_pay: total,
        amount_received: received,
        origin_currency: isMad ? 'MAD' : 'FCFA',
        destination_currency: isMad ? 'FCFA' : 'MAD',
        beneficiary_first_name: form.beneficiaryFirst,
        beneficiary_last_name: form.beneficiaryLast,
        beneficiary_phone: form.beneficiaryPhone,
        status: 'pending',
        reference: ref,
      })
    }

    // Build WhatsApp message
    const msg = `Bonjour AfriGate 👋

Je souhaite effectuer un transfert :

📤 Envoi depuis : ${form.originCountry?.flag} ${form.originCountry?.name}
📥 Destination : ${form.destCountry?.flag} ${form.destCountry?.name}
💳 Moyen d'envoi : ${form.sendMethod?.name}
📦 Moyen de réception : ${form.receiveMethod?.name}
💵 Montant envoyé : ${amt.toLocaleString()} ${isMad ? 'MAD' : 'FCFA'}
💰 Frais (10%) : ${fees.toLocaleString()} ${isMad ? 'MAD' : 'FCFA'}
✅ Total à payer : ${total.toLocaleString()} ${isMad ? 'MAD' : 'FCFA'}
🎯 Le bénéficiaire recevra : ${received.toLocaleString()} ${isMad ? 'FCFA' : 'MAD'}

👤 Bénéficiaire : ${form.beneficiaryFirst} ${form.beneficiaryLast}
📱 Tél bénéficiaire : ${form.beneficiaryPhone}
🔖 Référence : ${ref}

Merci de prendre en charge ma demande. 🙏`

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-navy/3 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-extrabold text-navy">Effectuer un transfert</h1>
          <p className="text-gray-500 mt-2">Calcul automatique des frais et conversion instantanée</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 px-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  i < step ? 'bg-green-500 text-white' : i === step ? 'bg-navy text-white shadow-lg shadow-navy/30' : 'bg-gray-200 text-gray-400'
                }`}>
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <span className={`text-xs mt-1.5 font-medium hidden sm:block ${i === step ? 'text-navy' : 'text-gray-400'}`}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 transition-all ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* STEP 0 — Direction */}
          {step === 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-navy mb-6">Quelle est la direction du transfert ?</h2>
              <div className="grid gap-4">
                {[
                  { val: 'MAD_TO_FCFA', from: MOROCCO, to: null, label: 'Depuis le Maroc vers l\'Afrique', sub: '1 MAD = 57 FCFA' },
                  { val: 'FCFA_TO_MAD', from: null, to: MOROCCO, label: 'Depuis l\'Afrique vers le Maroc', sub: '1 MAD = 63 FCFA' },
                ].map(d => (
                  <button key={d.val} onClick={() => set('direction', d.val)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${
                      form.direction === d.val ? 'border-gold-DEFAULT bg-gold-DEFAULT/5' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl">{d.val === 'MAD_TO_FCFA' ? '🇲🇦' : '🌍'}</span>
                      <span className="text-2xl">→</span>
                      <span className="text-2xl">{d.val === 'MAD_TO_FCFA' ? '🌍' : '🇲🇦'}</span>
                    </div>
                    <div className="font-display font-bold text-navy">{d.label}</div>
                    <div className="text-sm text-gold-dark font-medium mt-0.5">{d.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 — Countries */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-xl font-bold text-navy mb-6">Sélectionnez les pays</h2>
              {isMad ? (
                <>
                  <CountrySelect
                    label="🇲🇦 Pays d'envoi"
                    options={[MOROCCO]}
                    value={form.originCountry || MOROCCO}
                    onChange={v => set('originCountry', v)}
                    disabled
                  />
                  <CountrySelect
                    label="Pays de destination"
                    options={COUNTRIES}
                    value={form.destCountry}
                    onChange={v => { set('destCountry', v); set('originCountry', MOROCCO) }}
                  />
                </>
              ) : (
                <>
                  <CountrySelect
                    label="Pays d'origine"
                    options={COUNTRIES}
                    value={form.originCountry}
                    onChange={v => { set('originCountry', v); set('destCountry', MOROCCO) }}
                  />
                  <CountrySelect
                    label="🇲🇦 Pays de destination"
                    options={[MOROCCO]}
                    value={form.destCountry || MOROCCO}
                    onChange={v => set('destCountry', v)}
                    disabled
                  />
                </>
              )}
            </div>
          )}

          {/* STEP 2 — Payment methods */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-xl font-bold text-navy mb-6">Moyens de paiement</h2>
              <MethodSelect
                label={`Moyen d'envoi (${isMad ? 'Maroc' : form.originCountry?.name || 'Afrique'})`}
                options={sendMethods}
                value={form.sendMethod}
                onChange={v => set('sendMethod', v)}
              />
              <MethodSelect
                label={`Moyen de réception (${isMad ? form.destCountry?.name || 'Afrique' : 'Maroc'})`}
                options={receiveMethods}
                value={form.receiveMethod}
                onChange={v => set('receiveMethod', v)}
              />
            </div>
          )}

          {/* STEP 3 — Amount + beneficiary */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-xl font-bold text-navy mb-6">Montant et bénéficiaire</h2>
              <label className="block text-sm font-semibold text-navy mb-2">
                Montant à envoyer ({isMad ? 'MAD' : 'FCFA'})
              </label>
              <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)}
                placeholder={isMad ? 'ex: 500' : 'ex: 25000'}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-navy font-semibold text-lg focus:border-gold-DEFAULT outline-none transition-colors mb-4" />

              {/* Live calc */}
              {amt > 0 && (
                <div className="bg-navy rounded-2xl p-5 mb-6 space-y-2.5">
                  {[
                    ['Montant envoyé', `${amt.toLocaleString()} ${isMad ? 'MAD' : 'FCFA'}`, false],
                    ['Frais (10%)', `+ ${fees.toLocaleString()} ${isMad ? 'MAD' : 'FCFA'}`, false],
                    ['Total à payer', `${total.toLocaleString()} ${isMad ? 'MAD' : 'FCFA'}`, false],
                    ['Bénéficiaire reçoit', `${received.toLocaleString()} ${isMad ? 'FCFA' : 'MAD'}`, true],
                  ].map(([l, v, h]) => (
                    <div key={l} className={`flex justify-between ${h ? 'pt-2 border-t border-white/10' : ''}`}>
                      <span className={`text-sm ${h ? 'text-white font-bold' : 'text-blue-200'}`}>{l}</span>
                      <span className={`font-bold ${h ? 'text-gold-DEFAULT' : 'text-white'}`}>{v}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Prénom bénéficiaire</label>
                  <input value={form.beneficiaryFirst} onChange={e => set('beneficiaryFirst', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-navy focus:border-gold-DEFAULT outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Nom bénéficiaire</label>
                  <input value={form.beneficiaryLast} onChange={e => set('beneficiaryLast', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-navy focus:border-gold-DEFAULT outline-none" />
                </div>
              </div>
              <label className="block text-sm font-semibold text-navy mb-2">Téléphone bénéficiaire</label>
              <input value={form.beneficiaryPhone} onChange={e => set('beneficiaryPhone', e.target.value)}
                placeholder="+225 00 00 00 00"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-navy focus:border-gold-DEFAULT outline-none mb-4" />

              <label className="block text-sm font-semibold text-navy mb-2">Votre nom (expéditeur)</label>
              <input value={form.senderName} onChange={e => set('senderName', e.target.value)}
                placeholder="Votre prénom et nom"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-navy focus:border-gold-DEFAULT outline-none" />
            </div>
          )}

          {/* STEP 4 — Summary */}
          {step === 4 && (
            <div>
              <h2 className="font-display text-xl font-bold text-navy mb-2">Récapitulatif du transfert</h2>
              <p className="text-gray-400 text-sm mb-6">Vérifiez les informations avant de confirmer.</p>

              <div className="space-y-3 mb-8">
                {[
                  ['Direction', `${form.originCountry?.flag} ${form.originCountry?.name} → ${form.destCountry?.flag} ${form.destCountry?.name}`],
                  ['Envoi via', form.sendMethod?.name],
                  ['Réception via', form.receiveMethod?.name],
                  ['Montant envoyé', `${amt.toLocaleString()} ${isMad ? 'MAD' : 'FCFA'}`],
                  ['Frais (10%)', `${fees.toLocaleString()} ${isMad ? 'MAD' : 'FCFA'}`],
                  ['Total à payer', `${total.toLocaleString()} ${isMad ? 'MAD' : 'FCFA'}`],
                  ['Bénéficiaire reçoit', `${received.toLocaleString()} ${isMad ? 'FCFA' : 'MAD'}`],
                  ['Bénéficiaire', `${form.beneficiaryFirst} ${form.beneficiaryLast}`],
                  ['Tél bénéficiaire', form.beneficiaryPhone],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-2.5 border-b border-gray-100">
                    <span className="text-sm text-gray-500">{l}</span>
                    <span className="text-sm font-semibold text-navy text-right max-w-[60%]">{v}</span>
                  </div>
                ))}
              </div>

              <button onClick={handleConfirm}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-base transition-colors shadow-lg shadow-green-500/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Confirmer et contacter via WhatsApp
                <ExternalLink size={16} />
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold disabled:opacity-30 hover:border-navy hover:text-navy transition-colors">
              <ChevronLeft size={18} /> Retour
            </button>
            {step < 4 && (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy text-white font-bold disabled:opacity-30 hover:bg-navy-light transition-colors shadow-lg shadow-navy/20">
                Suivant <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Country selector ── */
function CountrySelect({ label, options, value, onChange, disabled }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-navy mb-3">{label}</label>
      <div className="grid gap-2">
        {options.map(c => (
          <button key={c.code} onClick={() => !disabled && onChange(c)} disabled={disabled}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
              value?.code === c.code
                ? 'border-gold-DEFAULT bg-gold-DEFAULT/5'
                : disabled ? 'border-gray-100 bg-gray-50 cursor-default' : 'border-gray-200 hover:border-gray-300'
            }`}>
            <span className="text-2xl">{c.flag}</span>
            <div>
              <div className="font-semibold text-navy text-sm">{c.name}</div>
              <div className="text-xs text-gray-400">{c.currency} · {c.dialCode}</div>
            </div>
            {value?.code === c.code && <Check size={16} className="ml-auto text-gold-DEFAULT" />}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Payment method selector ── */
function MethodSelect({ label, options, value, onChange }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-navy mb-3">{label}</label>
      <div className="grid gap-3">
        {options.map(m => (
          <button key={m.id} onClick={() => onChange(m)}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
              value?.id === m.id ? 'border-gold-DEFAULT bg-gold-DEFAULT/5' : 'border-gray-200 hover:border-gray-300'
            }`}>
            {/* Logo fallback with colored badge */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white text-xs text-center leading-tight"
              style={{ backgroundColor: m.color }}>
              {m.name.split(' ')[0]}
            </div>
            <div>
              <div className="font-bold text-navy">{m.name}</div>
              <div className="text-xs text-gray-400">{m.desc}</div>
            </div>
            {value?.id === m.id && <Check size={16} className="ml-auto text-gold-DEFAULT" />}
          </button>
        ))}
      </div>
    </div>
  )
}
