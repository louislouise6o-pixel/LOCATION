import { useState } from 'react';
import { Calculator, Info, TrendingUp, Wallet, Users, BadgeEuro } from 'lucide-react';
import { PageHeader, Banner } from '../components/ui';
import { formatEuro, formatEuroPrecise } from '../lib';

export function CommissionPage() {
  const [rentalPrice, setRentalPrice] = useState(300);
  const [bookingsPerMonth, setBookingsPerMonth] = useState(20);
  const [feeRate, setFeeRate] = useState(15);

  const monthlyRentals = rentalPrice * bookingsPerMonth;
  const monthlyFees = (monthlyRentals * feeRate) / 100;
  const totalPaidByClients = monthlyRentals + monthlyFees;
  const perBookingFee = (rentalPrice * feeRate) / 100;
  const perBookingTotal = rentalPrice + perBookingFee;

  return (
    <div className="bg-mist-100 min-h-screen">
      <div className="container-app py-10">
        <PageHeader
          eyebrow="Simulateur économique"
          title="Calculateur de commission"
          subtitle="Estimez le chiffre d'affaires brut potentiel de la plateforme. Les chiffres sont des hypothèses, pas un bénéfice net."
        />

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
          {/* Inputs */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-xl text-navy-800 mb-5 flex items-center gap-2">
              <Calculator size={20} className="text-ocean-500" /> Paramètres
            </h2>

            <div className="space-y-6">
              <div>
                <label className="label flex items-center justify-between">
                  <span>Prix de location moyen</span>
                  <span className="font-display font-extrabold text-ocean-600 text-lg">{formatEuro(rentalPrice)}</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={10}
                  value={rentalPrice}
                  onChange={(e) => setRentalPrice(Number(e.target.value))}
                  className="w-full accent-ocean-400"
                />
                <div className="flex justify-between text-xs text-mist-400 mt-1">
                  <span>50 €</span><span>2000 €</span>
                </div>
              </div>

              <div>
                <label className="label flex items-center justify-between">
                  <span>Réservations par mois</span>
                  <span className="font-display font-extrabold text-ocean-600 text-lg">{bookingsPerMonth}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={200}
                  step={1}
                  value={bookingsPerMonth}
                  onChange={(e) => setBookingsPerMonth(Number(e.target.value))}
                  className="w-full accent-ocean-400"
                />
                <div className="flex justify-between text-xs text-mist-400 mt-1">
                  <span>1</span><span>200</span>
                </div>
              </div>

              <div>
                <label className="label flex items-center justify-between">
                  <span>Taux de frais de service client</span>
                  <span className="font-display font-extrabold text-ocean-600 text-lg">{feeRate}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={feeRate}
                  onChange={(e) => setFeeRate(Number(e.target.value))}
                  className="w-full accent-ocean-400"
                />
                <div className="flex justify-between text-xs text-mist-400 mt-1">
                  <span>0%</span><span>30%</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Banner>Le taux de 15% est une hypothèse de départ. Les frais de service constituent un chiffre d'affaires brut potentiel, et non un bénéfice net.</Banner>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <ResultCard
                icon={<Users size={20} />}
                label="Volume mensuel"
                value={`${bookingsPerMonth} locations`}
                tone="navy"
              />
              <ResultCard
                icon={<Wallet size={20} />}
                label="Total des locations"
                value={formatEuro(monthlyRentals)}
                sub="Versé aux loueurs (hors frais)"
                tone="ocean"
              />
              <ResultCard
                icon={<TrendingUp size={20} />}
                label="Frais de service estimés"
                value={formatEuro(monthlyFees)}
                sub="Chiffre d'affaires brut potentiel"
                tone="amber"
              />
              <ResultCard
                icon={<BadgeEuro size={20} />}
                label="Total payé par les clients"
                value={formatEuro(totalPaidByClients)}
                sub="Locations + frais de service"
                tone="emerald"
              />
            </div>

            {/* Per booking breakdown */}
            <div className="card p-6">
              <h3 className="font-display font-bold text-lg text-navy-800 mb-4">Détail par réservation</h3>
              <div className="space-y-2.5 text-sm">
                <BreakdownRow label={`Prix de location`} value={formatEuroPrecise(rentalPrice)} />
                <BreakdownRow label={`Frais de service (${feeRate}%)`} value={formatEuroPrecise(perBookingFee)} />
                <BreakdownRow label="Total au client" value={formatEuroPrecise(perBookingTotal)} strong />
              </div>
              <div className="mt-4 pt-4 border-t border-navy-50 flex items-start gap-2 text-xs text-mist-400">
                <Info size={14} className="mt-0.5 shrink-0" />
                <p>
                  Exemple : pour une location à {formatEuro(rentalPrice)} avec {feeRate}% de frais, le client paie {formatEuroPrecise(perBookingTotal)} dont {formatEuroPrecise(perBookingFee)} de frais de service. Les frais de paiement, remboursements, charges et taxes ne sont pas déduits ici.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  icon, label, value, sub, tone,
}: {
  icon: React.ReactNode; label: string; value: string; sub?: string;
  tone: 'navy' | 'ocean' | 'amber' | 'emerald';
}) {
  const tones: Record<string, string> = {
    navy: 'from-navy-700 to-navy-800',
    ocean: 'from-ocean-400 to-ocean-500',
    amber: 'from-amber-400 to-amber-500',
    emerald: 'from-emerald-400 to-emerald-500',
  };
  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br ${tones[tone]} text-white shadow-card`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</p>
          <p className="font-display font-extrabold text-2xl mt-1.5">{value}</p>
          {sub && <p className="text-xs opacity-80 mt-1">{sub}</p>}
        </div>
        <div className="opacity-70">{icon}</div>
      </div>
    </div>
  );
}

function BreakdownRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? 'font-display font-bold text-navy-800 text-base pt-2 border-t border-navy-50' : 'text-navy-700'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
