import {
  Users, Anchor, CalendarDays, ListChecks, BadgeEuro, AlertCircle,
  ShieldCheck, FileText, IdCard, Ship, LifeBuoy, CheckCircle2, XCircle, Clock,
} from 'lucide-react';
import { useStore } from '../store';
import { useNav } from '../nav';
import { PageHeader, Banner, StatCard } from '../components/ui';
import { formatEuro, formatDateShort, STATUS_LABELS } from '../lib';
import { useState } from 'react';

interface RenterRecord {
  id: string;
  name: string;
  type: 'professional' | 'private';
  boats: number;
  status: 'pending' | 'verified' | 'rejected';
  checks: Record<string, boolean>;
}

const initialRenters: RenterRecord[] = [
  {
    id: 'r1',
    name: 'Cap Nautic Loc (démonstration)',
    type: 'professional',
    boats: 2,
    status: 'verified',
    checks: { identity: true, contact: true, authorization: true, documents: true, insurance: true, safety: true },
  },
  {
    id: 'r2',
    name: 'Riviera Plaisance (démonstration)',
    type: 'professional',
    boats: 1,
    status: 'verified',
    checks: { identity: true, contact: true, authorization: true, documents: true, insurance: true, safety: true },
  },
  {
    id: 'r3',
    name: 'Voiles Méditerranée (démonstration)',
    type: 'professional',
    boats: 1,
    status: 'pending',
    checks: { identity: true, contact: true, authorization: true, documents: false, insurance: false, safety: false },
  },
  {
    id: 'r4',
    name: 'Prestige Cap (démonstration)',
    type: 'professional',
    boats: 1,
    status: 'pending',
    checks: { identity: true, contact: false, authorization: false, documents: false, insurance: false, safety: false },
  },
  {
    id: 'r5',
    name: 'Propriétaire privé (démonstration)',
    type: 'private',
    boats: 3,
    status: 'verified',
    checks: { identity: true, contact: true, authorization: true, documents: true, insurance: true, safety: true },
  },
];

const CHECK_ITEMS = [
  { key: 'identity', label: 'Identité', icon: <IdCard size={16} /> },
  { key: 'contact', label: 'Coordonnées professionnelles', icon: <FileText size={16} /> },
  { key: 'authorization', label: 'Autorisation de proposer le bateau', icon: <Ship size={16} /> },
  { key: 'documents', label: 'Documents du bateau', icon: <FileText size={16} /> },
  { key: 'insurance', label: 'Assurance appropriée', icon: <ShieldCheck size={16} /> },
  { key: 'safety', label: 'Sécurité et conformité', icon: <LifeBuoy size={16} /> },
];

export function AdminPage() {
  const { boats, reservations, resetDemo } = useStore();
  const { go } = useNav();
  const [renters, setRenters] = useState<RenterRecord[]>(initialRenters);

  const pendingReq = reservations.filter((r) => r.status === 'pending').length;
  const boatsToVerify = boats.filter((b) => !b.published).length;
  const monthlyVolume = reservations.filter((r) => r.status === 'completed').length;
  const monthlyFees = reservations.filter((r) => r.status === 'completed').reduce((s, r) => s + r.serviceFee, 0);

  const toggleCheck = (renterId: string, checkKey: string) => {
    setRenters((prev) =>
      prev.map((r) =>
        r.id === renterId
          ? { ...r, checks: { ...r.checks, [checkKey]: !r.checks[checkKey] } }
          : r
      )
    );
  };

  const setRenterStatus = (renterId: string, status: RenterRecord['status']) => {
    setRenters((prev) => prev.map((r) => (r.id === renterId ? { ...r, status } : r)));
  };

  return (
    <div className="bg-mist-100 min-h-screen">
      <div className="container-app py-10">
        <PageHeader
          eyebrow="Administration"
          title="Tableau de bord dirigeant"
          subtitle="Vue d'ensemble de la plateforme de démonstration. Toutes les données et statuts sont fictifs."
        />

        <div className="mb-6">
          <Banner>
            <strong>Espace de démonstration.</strong> Aucune vérification juridique ou documentaire réelle n'est effectuée ici. Les statuts sont des exemples pour illustrer le suivi prévu.
          </Banner>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Loureurs fictifs" value={String(renters.length)} sub={`${renters.filter((r) => r.status === 'verified').length} vérifiés`} tone="navy" icon={<Users size={22} />} />
          <StatCard label="Bateaux fictifs" value={String(boats.length)} sub={`${boatsToVerify} à vérifier`} tone="ocean" icon={<Anchor size={22} />} />
          <StatCard label="Réservations" value={String(reservations.length)} sub={`${pendingReq} en attente`} tone="amber" icon={<CalendarDays size={22} />} />
          <StatCard label="Frais de service" value={formatEuro(Math.round(monthlyFees))} sub={`${monthlyVolume} locations terminées`} tone="emerald" icon={<BadgeEuro size={22} />} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Pending items */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-lg text-navy-800 mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-500" /> À traiter
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-amber-50 p-3">
                <span className="text-sm text-navy-700">Demandes en attente</span>
                <span className="font-display font-bold text-amber-700">{pendingReq}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-mist-50 p-3">
                <span className="text-sm text-navy-700">Annonces à vérifier</span>
                <span className="font-display font-bold text-navy-800">{boatsToVerify}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-rose-50 p-3">
                <span className="text-sm text-navy-700">Loureurs à vérifier</span>
                <span className="font-display font-bold text-rose-600">{renters.filter((r) => r.status === 'pending').length}</span>
              </div>
            </div>
          </div>

          {/* Reset demo */}
          <div className="card p-6 flex flex-col">
            <h2 className="font-display font-bold text-lg text-navy-800 mb-2 flex items-center gap-2">
              <ListChecks size={18} className="text-ocean-500" /> Données de démonstration
            </h2>
            <p className="text-sm text-navy-600 mb-4 flex-1">
              Réinitialisez les bateaux et réservations de démonstration à leur état initial. Les modifications locales seront perdues.
            </p>
            <button
              onClick={() => {
                if (confirm('Réinitialiser toutes les données de démonstration ?')) {
                  resetDemo();
                  setRenters(initialRenters);
                }
              }}
              className="btn-outline text-sm self-start"
            >
              Réinitialiser les données
            </button>
          </div>
        </div>

        {/* Renter verification */}
        <section className="card p-6">
          <h2 className="font-display font-bold text-xl text-navy-800 mb-2">Vérification des loueurs</h2>
          <p className="text-sm text-navy-600 mb-5">
            Éléments à contrôler avant toute publication réelle. Cochez/décochez pour simuler le suivi. Les statuts sont fictifs.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-50 text-left">
                  <th className="py-3 px-2 font-semibold text-navy-700">Loueur</th>
                  <th className="py-3 px-2 font-semibold text-navy-700">Type</th>
                  {CHECK_ITEMS.map((c) => (
                    <th key={c.key} className="py-3 px-2 font-semibold text-navy-700 whitespace-nowrap">
                      <div className="flex items-center gap-1">{c.icon} <span className="hidden lg:inline">{c.label}</span></div>
                    </th>
                  ))}
                  <th className="py-3 px-2 font-semibold text-navy-700">Statut</th>
                </tr>
              </thead>
              <tbody>
                {renters.map((r) => (
                  <tr key={r.id} className="border-b border-navy-50 hover:bg-mist-50">
                    <td className="py-3 px-2 font-medium text-navy-800">{r.name}</td>
                    <td className="py-3 px-2 text-navy-600">{r.type === 'professional' ? 'Pro' : 'Privé'}</td>
                    {CHECK_ITEMS.map((c) => (
                      <td key={c.key} className="py-3 px-2">
                        <button
                          onClick={() => toggleCheck(r.id, c.key)}
                          className={`h-7 w-7 rounded-lg flex items-center justify-center transition ${
                            r.checks[c.key] ? 'bg-emerald-100 text-emerald-600' : 'bg-mist-100 text-mist-400 hover:bg-mist-200'
                          }`}
                        >
                          {r.checks[c.key] ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        </button>
                      </td>
                    ))}
                    <td className="py-3 px-2">
                      <span
                        className={`chip text-xs font-semibold ${
                          r.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                          r.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {r.status === 'verified' ? 'Vérifié' : r.status === 'pending' ? 'En attente' : 'Rejeté'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {renters.filter((r) => r.status === 'pending').map((r) => (
              <div key={r.id} className="flex items-center gap-2 rounded-xl bg-mist-50 p-2 pr-3">
                <Clock size={14} className="text-amber-500" />
                <span className="text-sm text-navy-700">{r.name}</span>
                <button onClick={() => setRenterStatus(r.id, 'verified')} className="chip text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Valider</button>
                <button onClick={() => setRenterStatus(r.id, 'rejected')} className="chip text-xs bg-rose-100 text-rose-700 hover:bg-rose-200">Rejeter</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
