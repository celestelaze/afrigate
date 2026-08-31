import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Clock, CheckCircle, XCircle, Loader, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthContext'

const STATUS_CONFIG = {
  pending:    { label: 'En attente',  icon: Clock,         color: 'text-yellow-500', bg: 'bg-yellow-50' },
  processing: { label: 'En cours',    icon: Loader,        color: 'text-blue-500',   bg: 'bg-blue-50' },
  completed:  { label: 'Complété',    icon: CheckCircle,   color: 'text-green-500',  bg: 'bg-green-50' },
  cancelled:  { label: 'Annulé',      icon: XCircle,       color: 'text-red-400',    bg: 'bg-red-50' },
}

export default function Dashboard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchTransfers()
  }, [user])

  async function fetchTransfers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('transfers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setTransfers(data || [])
    setLoading(false)
  }

  const totalSent = transfers.filter(t => t.status === 'completed').length
  const totalAmount = transfers.filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-navy">Mon historique</h1>
            <p className="text-gray-400 mt-1">
              Bonjour {profile?.first_name || ''} — voici tous vos transferts
            </p>
          </div>
          <button onClick={fetchTransfers}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-navy text-navy font-semibold text-sm hover:bg-navy hover:text-white transition-colors">
            <RefreshCw size={15} /> Actualiser
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total transferts', value: transfers.length, color: 'text-navy' },
            { label: 'Complétés', value: totalSent, color: 'text-green-500' },
            { label: 'Montant total envoyé', value: totalAmount > 0 ? `${totalAmount.toLocaleString('fr-FR')}` : '—', color: 'text-gold-DEFAULT' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <div className={`font-display font-extrabold text-2xl ${s.color}`}>{s.value}</div>
              <div className="text-gray-400 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Transfers list */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <Loader size={32} className="animate-spin mx-auto mb-3" />
            Chargement de vos transferts...
          </div>
        ) : transfers.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-12 text-center border border-gray-100">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-display font-bold text-navy text-xl mb-2">Aucun transfert</h3>
            <p className="text-gray-400 mb-6">Vous n'avez pas encore effectué de transfert.</p>
            <Link to="/transfer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy text-white font-bold hover:bg-navy-light transition-colors">
              Effectuer un transfert <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {transfers.map(t => {
              const cfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.pending
              const Icon = cfg.icon
              const isOut = t.direction === 'MAD_TO_FCFA'
              return (
                <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Direction */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-navy text-sm">
                          {t.origin_country}
                        </span>
                        {isOut ? <ArrowRight size={14} className="text-gold-DEFAULT" /> : <ArrowLeft size={14} className="text-gold-DEFAULT" />}
                        <span className="font-semibold text-navy text-sm">
                          {t.destination_country}
                        </span>
                      </div>
                      {/* Amounts */}
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-2">
                        <span>Envoyé : <strong className="text-navy">{(t.amount || 0).toLocaleString('fr-FR')} {t.origin_currency}</strong></span>
                        <span>Reçu : <strong style={{color:'#F5A623'}}>{(t.amount_received || 0).toLocaleString('fr-FR')} {t.destination_currency}</strong></span>
                      </div>
                      {/* Beneficiary */}
                      <div className="text-xs text-gray-400">
                        Bénéficiaire : {t.beneficiary_first_name} {t.beneficiary_last_name} · {t.beneficiary_phone}
                      </div>
                      {/* Methods */}
                      <div className="text-xs text-gray-400 mt-0.5">
                        {t.send_method} → {t.receive_method}
                      </div>
                    </div>
                    {/* Status + date */}
                    <div className="text-right flex-shrink-0">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                        <Icon size={12} /> {cfg.label}
                      </div>
                      {t.reference && (
                        <div className="text-xs text-gray-400 mt-1.5 font-mono">{t.reference}</div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(t.created_at).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' })}
                      </div>
                      <div className="text-xs font-bold text-navy mt-1">
                        Total payé : {(t.total_to_pay || 0).toLocaleString('fr-FR')} {t.origin_currency}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/transfer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gold-DEFAULT text-navy font-bold hover:bg-gold-light transition-colors shadow-lg">
            Nouveau transfert <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
