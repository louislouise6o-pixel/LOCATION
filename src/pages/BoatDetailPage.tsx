import { useState } from 'react';
import {
  ArrowLeft, Users, Anchor, Gauge, Calendar, Clock, MapPin,
  ShieldCheck, Fuel, Wallet, Star, CheckCircle2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useStore } from '../store';
import { useNav } from '../nav';
import { Banner, EmptyState } from '../components/ui';
import type { Duration } from '../types';
import {
  formatEuro, formatEuroPrecise, TYPE_LABELS, OWNER_LABELS,
  DURATION_LABELS, DURATION_HOURS, todayISO, addDays,
} from '../lib';

export function BoatDetailPage({ boatId }: { boatId: string }) {
  const { boats } = useStore();
  const { go } = useNav();
  const boat = boats.find((b) => b.id === boatId);

  const [activeImg, setActiveImg] = useState(0);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState<Duration>(boat?.durations[0] ?? 'half-day');
  const [guests, setGuests] = useState(2);

  if (!boat) {
    return (
      <EmptyState
        title="Bateau introuvable"
        message="Cette annonce n'existe pas ou a été retirée."
        action={<button onClick={() => go('catalog')} className="btn-primary">Retour au catalogue</button>}
      />
    );
  }

  const basePrice = boat.pricePerDuration[duration];
  const serviceFee = Math.round(basePrice * 0.15 * 100) / 100;
  const total = basePrice + serviceFee;

  const dateError = (() => {
    if (!date) return '';
    const today = todayISO();
    if (date < today) return 'La date sélectionnée est dans le passé.';
    return '';
  })();

  const guestError = guests > boat.capacity ? `Ce bateau accueille au maximum ${boat.capacity} personnes.` : '';

  const canBook = !dateError && !guestError && date && guests >= 1;

  const startBooking = () => {
    if (!canBook) return;
    const params = new URLSearchParams({
      boatId: boat.id,
      date,
      startTime,
      duration,
      guests: String(guests),
    }).toString();
    go('booking', params);
  };

  return (
    <div className="bg-mist-100 min-h-screen">
      <div className="container-app py-6 lg:py-10">
        <button onClick={() => go('catalog')} className="btn-ghost text-sm mb-5 -ml-2">
          <ArrowLeft size={16} /> Retour au catalogue
        </button>

        {/* Gallery */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-3 rounded-2xl overflow-hidden shadow-card">
          <div className="relative aspect-[16/10] lg:aspect-auto bg-navy-800 group">
            <img src={boat.images[activeImg]} alt={boat.name} className="w-full h-full object-cover" />
            <button
              onClick={() => setActiveImg((i) => (i - 1 + boat.images.length) % boat.images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/85 hover:bg-white flex items-center justify-center shadow-lg transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setActiveImg((i) => (i + 1) % boat.images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/85 hover:bg-white flex items-center justify-center shadow-lg transition"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-3 right-3 chip bg-navy-800/85 text-white text-xs">
              {activeImg + 1} / {boat.images.length}
            </span>
          </div>
          <div className="hidden lg:grid grid-rows-2 gap-3">
            {boat.images.slice(1, 3).map((src, i) => (
              <button key={i} onClick={() => setActiveImg(i + 1)} className="relative aspect-[16/10] lg:aspect-auto overflow-hidden group">
                <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />
              </button>
            ))}
          </div>
        </div>
        {/* Thumbnails mobile */}
        <div className="lg:hidden flex gap-2 mt-3 overflow-x-auto pb-1">
          {boat.images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`h-16 w-24 rounded-lg overflow-hidden shrink-0 border-2 ${activeImg === i ? 'border-ocean-400' : 'border-transparent'}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8 mt-8">
          {/* Left: details */}
          <div className="space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="chip bg-navy-100 text-navy-800 text-xs font-semibold">
                  <Anchor size={12} /> {TYPE_LABELS[boat.type]}
                </span>
                {boat.licenseRequired ? (
                  <span className="chip bg-amber-100 text-amber-800 text-xs font-semibold">Permis requis</span>
                ) : (
                  <span className="chip bg-ocean-100 text-ocean-700 text-xs font-semibold">
                    <ShieldCheck size={12} /> Sans permis
                  </span>
                )}
                <span className="chip bg-mist-200 text-navy-700 text-xs">{OWNER_LABELS[boat.ownerType]}</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-navy-800">{boat.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-navy-600">
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {boat.location}</span>
                <span className="flex items-center gap-1.5">
                  <Star size={14} className="fill-amber-400 text-amber-400" /> {boat.rating.toFixed(1)} ({boat.ratingCount} avis — démo)
                </span>
              </div>
              <p className="text-xs text-mist-400 mt-1.5">Lieu de départ : {boat.departurePort}</p>
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Spec icon={<Users size={18} />} label="Capacité" value={`${boat.capacity} pers.`} />
              <Spec icon={<Anchor size={18} />} label="Longueur" value={`${boat.length} m`} />
              <Spec icon={<Gauge size={18} />} label="Puissance" value={boat.power} />
              <Spec icon={<Calendar size={18} />} label="Année" value={String(boat.year)} />
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display font-bold text-xl text-navy-800 mb-2">Description</h2>
              <p className="text-navy-700 leading-relaxed">{boat.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-display font-bold text-xl text-navy-800 mb-3">Équipements</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {boat.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm text-navy-700">
                    <CheckCircle2 size={16} className="text-ocean-500 shrink-0" /> {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="font-display font-bold text-xl text-navy-800 mb-3">Tarifs selon la durée</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {boat.durations.map((d) => (
                  <div
                    key={d}
                    className={`rounded-2xl p-4 border-2 ${duration === d ? 'border-ocean-400 bg-ocean-50' : 'border-navy-50 bg-white'}`}
                  >
                    <p className="text-xs font-semibold text-navy-600">{DURATION_LABELS[d]}</p>
                    <p className="font-display font-extrabold text-2xl text-navy-800 mt-1">{formatEuro(boat.pricePerDuration[d])}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditions */}
            <div className="grid md:grid-cols-2 gap-4">
              <InfoBlock icon={<Fuel size={18} />} title="Carburant" text={boat.fuelPolicy} />
              <InfoBlock icon={<Wallet size={18} />} title="Caution (exemple)" text={`Caution indicative de ${formatEuro(boat.deposit)} à régler avec le loueur. Montant à titre d'exemple, non encaissé dans la démo.`} />
            </div>

            {/* Owner */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-lg text-navy-800">{boat.ownerName}</h3>
              <p className="text-sm text-navy-600 mt-1">{OWNER_LABELS[boat.ownerType]} — informations fictives de démonstration.</p>
            </div>

            <Banner>
              <strong>Conditions d'annulation (hypothèses à valider).</strong> Annulation gratuite jusqu'à 7 jours avant la sortie. Au-delà, des pénalités pourraient s'appliquer. Ces conditions restent à formaliser contractuellement.
            </Banner>
          </div>

          {/* Right: booking panel */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="card p-5 shadow-cardHover">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-xs text-mist-400">À partir de</span>
                  <p className="font-display font-extrabold text-2xl text-navy-800">
                    {formatEuro(boat.pricePerDuration[boat.durations[0]])}
                  </p>
                </div>
                <span className="text-xs text-mist-400">par sortie</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="label text-xs">Date de départ</label>
                  <input
                    type="date"
                    min={todayISO()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input py-2.5 text-sm"
                  />
                  {dateError && <p className="text-xs text-rose-500 mt-1">{dateError}</p>}
                </div>

                <div>
                  <label className="label text-xs">Heure de départ</label>
                  <input
                    type="time"
                    min="06:00"
                    max="20:00"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="input py-2.5 text-sm"
                  />
                  <p className="text-xs text-mist-400 mt-1">Entre 06h00 et 20h00</p>
                </div>

                <div>
                  <label className="label text-xs">Durée</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value as Duration)}
                    className="input py-2.5 text-sm"
                  >
                    {boat.durations.map((d) => (
                      <option key={d} value={d}>
                        {DURATION_LABELS[d]} ({DURATION_HOURS[d]}h) — {formatEuro(boat.pricePerDuration[d])}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label text-xs">Nombre de personnes (max {boat.capacity})</label>
                  <input
                    type="number"
                    min={1}
                    max={boat.capacity}
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                    className="input py-2.5 text-sm"
                  />
                  {guestError && <p className="text-xs text-rose-500 mt-1">{guestError}</p>}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-navy-50 space-y-2 text-sm">
                <div className="flex justify-between text-navy-700">
                  <span>Prix de location ({DURATION_LABELS[duration]})</span>
                  <span className="font-semibold">{formatEuroPrecise(basePrice)}</span>
                </div>
                <div className="flex justify-between text-navy-700">
                  <span>Frais de service (15% démo)</span>
                  <span className="font-semibold">{formatEuroPrecise(serviceFee)}</span>
                </div>
                <div className="flex justify-between font-display font-bold text-navy-800 text-base pt-2 border-t border-navy-50">
                  <span>Total</span>
                  <span>{formatEuroPrecise(total)}</span>
                </div>
              </div>

              <button onClick={startBooking} disabled={!canBook} className="btn-primary w-full mt-4 text-base py-3.5">
                <Calendar size={18} /> Simuler ma réservation
              </button>
              <p className="text-center text-xs text-mist-400 mt-2">
                Simulation uniquement — aucun paiement ne sera débité.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card p-3.5">
      <div className="h-9 w-9 rounded-lg bg-ocean-50 text-ocean-500 flex items-center justify-center">{icon}</div>
      <p className="text-xs text-mist-400 mt-2">{label}</p>
      <p className="font-semibold text-navy-800">{value}</p>
    </div>
  );
}

function InfoBlock({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-ocean-500">{icon}</div>
        <h3 className="font-display font-bold text-navy-800">{title}</h3>
      </div>
      <p className="text-sm text-navy-600">{text}</p>
    </div>
  );
}
