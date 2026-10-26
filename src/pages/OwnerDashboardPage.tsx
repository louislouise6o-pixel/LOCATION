import {
  Anchor, CalendarDays, ListChecks, BadgeEuro, Wallet, ArrowRight,
  Users, Clock, AlertCircle,
} from 'lucide-react';
import { useStore } from '../store';
import { useNav } from '../nav';
import { StatCard, Banner, PageHeader } from '../components/ui';
import { formatEuro, formatDateShort, STATUS_LABELS, STATUS_STYLES, DURATION_LABELS } from '../lib';

export function OwnerDashboardPage() {
  const { boats, reservations } = useStore();
  const { go } = useNav();

  const publishedBoats = boats.filter((b) => b.published);
  const pendingReq = reservations.filter((r) => r.status === 'pending');
  const upcoming = reservations.filter((r) => r.status === 'accepted');
  const monthlyVolume = reservations.filter((r) => r.status === 'completed').length;
  const monthlyFees = reservations
    .filter((r) => r.status === 'completed')
    .reduce((sum, r) => sum + r.serviceFee, 0);

  return (
    <div className="bg-mist-100 min-h-screen">
      <div className="container-app py-10">
        <PageHeader
          eyebrow="Espace loueur"
          title="Tableau de bord"
          subtitle="Vue d'ensemble de l'activité de démonstration — toutes les données sont fictives."
        />

        <div className="mb-6">
          <Banner>Vous naviguez dans un espace loueur de démonstration. Aucune donnée n'est réelle et aucune annonce n'est publiée publiquement.</Banner>
        </div>

        {/* Quick nav */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button onClick={() => go('owner-boats')} className="btn-outline">
            <Anchor size={16} /> Mes bateaux
          </button>
          <button onClick={() => go('owner-requests')} className="btn-outline">
            <ListChecks size={16} /> Demandes de réservation
          </button>
          <button onClick={() => go('renter-onboarding')} className="btn-outline">
            Devenir loueur
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Mes bateaux" value={String(publishedBoats.length)} sub="annonces publiées" tone="navy" icon={<Anchor size={22} />} />
          <StatCard label="Demandes en attente" value={String(pendingReq.length)} sub="à traiter" tone="amber" icon={<AlertCircle size={22} />} />
          <StatCard label="Réservations à venir" value={String(upcoming.length)} sub="acceptées" tone="ocean" icon={<CalendarDays size={22} />} />
          <StatCard label="Volume de locations" value={String(monthlyVolume)} sub="terminées" tone="emerald" icon={<ListChecks size={22} />} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending requests */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-navy-800">Demandes en attente</h2>
              <button onClick={() => go('owner-requests')} className="text-sm font-semibold text-ocean-500 hover:text-ocean-600 flex items-center gap-1">
                Tout voir <ArrowRight size={14} />
              </button>
            </div>
            {pendingReq.length === 0 ? (
              <p className="text-sm text-mist-400 py-6 text-center">Aucune demande en attente.</p>
            ) : (
              <div className="space-y-3">
                {pendingReq.slice(0, 4).map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl bg-mist-50 p-3">
                    <img src={r.boatImage} alt="" className="h-12 w-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-navy-800 text-sm truncate">{r.boatName}</p>
                      <p className="text-xs text-navy-600">{r.clientFirstName} {r.clientName} · {formatDateShort(r.date)}</p>
                    </div>
                    <span className={`chip text-xs ${STATUS_STYLES[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming + revenue */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-display font-bold text-lg text-navy-800 mb-4">Réservations à venir</h2>
              {upcoming.length === 0 ? (
                <p className="text-sm text-mist-400 py-6 text-center">Aucune réservation à venir.</p>
              ) : (
                <div className="space-y-3">
                  {upcoming.slice(0, 3).map((r) => (
                    <div key={r.id} className="flex items-center gap-3 rounded-xl bg-mist-50 p-3">
                      <img src={r.boatImage} alt="" className="h-12 w-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-navy-800 text-sm truncate">{r.boatName}</p>
                        <div className="flex items-center gap-3 text-xs text-navy-600">
                          <span className="flex items-center gap-1"><CalendarDays size={11} /> {formatDateShort(r.date)}</span>
                          <span className="flex items-center gap-1"><Clock size={11} /> {r.startTime}</span>
                          <span className="flex items-center gap-1"><Users size={11} /> {r.guests}</span>
                        </div>
                      </div>
                      <span className={`chip text-xs ${STATUS_STYLES[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Volume de locations" value={String(monthlyVolume)} sub="simulé" tone="navy" icon={<Wallet size={20} />} />
              <StatCard label="Frais de service" value={formatEuro(Math.round(monthlyFees))} sub="estimés" tone="ocean" icon={<BadgeEuro size={20} />} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
