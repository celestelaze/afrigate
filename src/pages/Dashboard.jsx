import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { RefreshCw, ArrowRight, ArrowLeft, Clock, CheckCircle, XCircle, Loader, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthContext'

const STATUS = {
  pending:    { label: 'En attente',  color: '#f59e0b', bg: '#fffbeb', Icon: Clock },
  processing: { label: 'En cours',    color: '#3b82f6', bg: '#eff6ff', Icon: Loader },
  completed:  { label: 'Complété',    color: '#22c55e', bg: '#f0fdf4', Icon: CheckCircle },
  cancelled:  { label: 'Annulé',      color: '#ef4444', bg: '#fef2f2', Icon: XCircle },
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
      <div className="font-display font-extrabold text-2xl mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-gray-400 text-xs">{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchTransfers()
  }, [user])

  async function fetchTransfers() {
    setLoading(true)
    try {
      // Only fetch transfers from the current month
      const now       = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const { data, error } = await supabase
        .from('transfers')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', monthStart)
        .order('created_at', { ascending: false })

      if (!error) setTransfers(data || [])
    } catch {}
    setLoading(false)
  }

  const completed  = transfers.filter(t => t.status === 'completed')
  const totalPaid  = transfers.reduce((s, t) => s + (t.total_to_pay || 0), 0)
  const countries  = [...new Set(transfers.map(t => t.destination_country).filter(Boolean))]

  return (
    <div className="min-h-screen pt-8 pb-20" style={{ backgroundColor: '#f8f9ff' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-16">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-navy">Mon historique</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Transactions du mois en cours — Bonjour {profile?.first_name || ''}
            </p>
          </div>
          <button onClick={fetchTransfers}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-navy text-navy font-semibold text-sm hover:bg-navy hover:text-white transition-colors">
            <RefreshCw size={14} /> Actualiser
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard label="Transferts ce mois" value={transfers.length} color="#1B2A6B" />
          <StatCard label="Complétés"           value={completed.length} color="#22c55e" />
          <StatCard
            label="Total envoyé"
            value={totalPaid > 0 ? totalPaid.toLocaleString('fr-FR') : '—'}
            color="#F5A623"
          />
        </div>

        {/* Country chips */}
        {countries.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {countries.map(c => (
              <span key={c} className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 text-navy shadow-sm">
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Transfers list */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <Loader size={32} className="animate-spin mx-auto mb-3" />
            Chargement…
          </div>
        ) : transfers.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-12 text-center border border-gray-100">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-display font-bold text-navy text-xl mb-2">Aucun transfert ce mois</h3>
            <p className="text-gray-400 text-sm mb-6">Vos transferts du mois en cours apparaîtront ici.</p>
            <Link to="/transfer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-navy hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#F5A623' }}>
              Effectuer un transfert <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {transfers.map(t => {
              const cfg    = STATUS[t.status] || STATUS.pending
              const Icon   = cfg.Icon
              const isOut  = t.direction === 'MAD_TO_FCFA'
              const dateStr = new Date(t.created_at).toLocaleDateString('fr-FR', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })

              return (
                <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                  {/* Top bar with status */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50"
                    style={{ backgroundColor: cfg.bg }}>
                    <div className="flex items-center gap-2">
                      <Icon size={14} style={{ color: cfg.color }} />
                      <span className="text-xs font-bold" style={{ color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-gray-400">{t.reference || '—'}</span>
                  </div>

                  {/* Body */}
                  <div className="px-5 py-4">
                    {/* Direction */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-semibold text-navy text-sm">{t.origin_country}</span>
                      {isOut
                        ? <ArrowRight size={14} style={{ color: '#F5A623' }} />
                        : <ArrowLeft  size={14} style={{ color: '#F5A623' }} />}
                      <span className="font-semibold text-navy text-sm">{t.destination_country}</span>
                    </div>

                    {/* Key amounts */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-gray-50 rounded-xl px-3 py-2">
                        <div className="text-xs text-gray-400 mb-0.5">Montant envoyé</div>
                        <div className="font-bold text-navy text-sm">
                          {(t.amount || 0).toLocaleString('fr-FR')} {t.origin_currency}
                        </div>
                      </div>
                      <div className="rounded-xl px-3 py-2" style={{ backgroundColor: 'rgba(245,166,35,0.1)' }}>
                        <div className="text-xs text-gray-400 mb-0.5">Bénéficiaire reçoit</div>
                        <div className="font-bold text-sm" style={{ color: '#F5A623' }}>
                          {(t.amount_received || 0).toLocaleString('fr-FR')} {t.destination_currency}
                        </div>
                      </div>
                    </div>

                    {/* Details row */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                      <span>Total payé : <strong className="text-navy">{(t.total_to_pay || 0).toLocaleString('fr-FR')} {t.origin_currency}</strong></span>
                      <span>Via : <strong className="text-navy">{t.send_method} → {t.receive_method}</strong></span>
                      {t.beneficiary_first_name && (
                        <span>Bénéf. : <strong className="text-navy">{t.beneficiary_first_name} {t.beneficiary_last_name}</strong></span>
                      )}
                    </div>

                    {/* Date */}
                    <div className="mt-2 text-xs text-gray-300">{dateStr}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-8">
          <Link to="/transfer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-navy transition-colors shadow-lg"
            style={{ backgroundColor: '#F5A623' }}>
            <TrendingUp size={18} /> Nouveau transfert
          </Link>
        </div>
      </div>
    </div>
  )
}
