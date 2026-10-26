import { useState } from 'react';
import { Check, X, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { useNav } from '../nav';
import { PageHeader, Banner, EmptyState } from '../components/ui';
import type { ReservationStatus } from '../types';
import { formatDateShort, formatEuroPrecise, STATUS_LABELS, STATUS_STYLES, DURATION_LABELS } from '../lib';

const STATUSES: ReservationStatus[] = ['pending', 'accepted', 'declined', 'completed', 'cancelled'];

export function OwnerRequestsPage() {
  const { reservations, updateReservation } = useStore();
  const { go } = useNav();
  const [filter, setFilter] = useState<ReservationStatus | 'all'>('all');

  const filtered = filter === 'all' ? reservations : reservations.filter((r) => r.status === filter);

  return (
    <div className="bg-mist-100 min-h-screen">
      <div className="container-app py-10">
        <PageHeader
          eyebrow="Espace loueur"
          title="Demandes de réservation"
          subtitle="Gérez les statuts des demandes de démonstration. Aucune réservation n'est réelle."
        />

        <div className="mb-6">
          <Banner>Vous pouvez modifier les statuts pour tester le parcours. Aucune notification réelle n'est envoyée.</Banner>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <FilterTab label="Toutes" count={reservations.length} active={filter === 'all'} onClick={() => setFilter('all')} />
          {STATUSES.map((s) => (
            <FilterTab
              key={s}
              label={STATUS_LABELS[s]}
              count={reservations.filter((r) => r.status === s).length}
              active={filter === s}
              onClick={() => setFilter(s)}
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="Aucune demande"
            message="Aucune réservation ne correspond à ce filtre dans la démo."
            action={<button onClick={() => setFilter('all')} className="btn-primary">Voir toutes les demandes</button>}
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => (
              <div key={r.id} className="card p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <img src={r.boatImage} alt={r.boatName} className="h-24 w-32 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display font-bold text-navy-800">{r.boatName}</h3>
                        <p className="text-sm text-navy-600">{r.clientFirstName} {r.clientName} · {r.clientEmail}</p>
                      </div>
                      <span className={`chip text-xs font-semibold ${STATUS_STYLES[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-navy-600">
                      <span className="flex items-center gap-1.5"><Clock size={13} /> {formatDateShort(r.date)} à {r.startTime}</span>
                      <span>{DURATION_LABELS[r.duration]}</span>
                      <span>{r.guests} pers.</span>
                      <span className="font-semibold text-navy-800">{formatEuroPrecise(r.total)}</span>
                    </div>
                    <p className="text-xs text-mist-400 mt-1.5">Réservation {r.id}</p>
                  </div>
                </div>

                {/* Status actions */}
                <div className="mt-4 pt-4 border-t border-navy-50 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-navy-600 mr-1">Changer le statut :</span>
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateReservation(r.id, { status: s })}
                      className={`chip text-xs transition ${
                        r.status === s
                          ? 'bg-ocean-400 text-white'
                          : 'bg-mist-100 text-navy-700 hover:bg-mist-200'
                      }`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterTab({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`chip text-sm px-4 py-2 transition ${active ? 'bg-navy-800 text-white' : 'bg-white text-navy-700 hover:bg-mist-100 border border-navy-50'}`}
    >
      {label} <span className={`text-xs ml-1 ${active ? 'text-white/70' : 'text-mist-400'}`}>({count})</span>
    </button>
  );
}
