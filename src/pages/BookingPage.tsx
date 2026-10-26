import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Calendar, Clock, Users,
  Anchor, ShieldCheck, Sparkles, Home as HomeIcon,
} from 'lucide-react';
import { useStore } from '../store';
import { useNav } from '../nav';
import { Banner } from '../components/ui';
import type { Duration, Reservation } from '../types';
import {
  formatEuro, formatEuroPrecise, TYPE_LABELS, DURATION_LABELS,
  todayISO, formatDateFR, uid, genResNumber, genEndCode,
} from '../lib';

interface BookingParams {
  boatId: string;
  date: string;
  startTime: string;
  duration: Duration;
  guests: number;
}

export function BookingPage({ params }: { params: string }) {
  const { boats, addReservation } = useStore();
  const { go } = useNav();

  const parsed: BookingParams = (() => {
    const sp = new URLSearchParams(params);
    return {
      boatId: sp.get('boatId') || '',
      date: sp.get('date') || '',
      startTime: sp.get('startTime') || '09:00',
      duration: (sp.get('duration') as Duration) || 'half-day',
      guests: Number(sp.get('guests') || 2),
    };
  })();

  const boat = boats.find((b) => b.id === parsed.boatId);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [date, setDate] = useState(parsed.date || todayISO());
  const [startTime, setStartTime] = useState(parsed.startTime);
  const [duration, setDuration] = useState<Duration>(parsed.duration);
  const [guests, setGuests] = useState(parsed.guests);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmation, setConfirmation] = useState<Reservation | null>(null);

  if (!boat) {
    return (
      <div className="container-app py-16 text-center">
        <p className="text-navy-700">Aucun bateau sélectionné pour cette réservation.</p>
        <button onClick={() => go('catalog')} className="btn-primary mt-4">Retour au catalogue</button>
      </div>
    );
  }

  const basePrice = boat.pricePerDuration[duration];
  const serviceFee = Math.round(basePrice * 0.15 * 100) / 100;
  const total = basePrice + serviceFee;

  const validateSlot = () => {
    const errs: Record<string, string> = {};
    if (!date) errs.date = 'Sélectionnez une date.';
    else if (date < todayISO()) errs.date = 'La date ne peut pas être dans le passé.';
    if (!startTime) errs.startTime = 'Sélectionnez une heure de départ.';
    else {
      const [h] = startTime.split(':').map(Number);
      if (h < 6 || h > 20) errs.startTime = 'Heure entre 06h00 et 20h00.';
    }
    if (guests < 1) errs.guests = 'Au moins une personne.';
    if (guests > boat.capacity) errs.guests = `Maximum ${boat.capacity} personnes.`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateInfos = () => {
    const errs: Record<string, string> = {};
    if (!lastName.trim()) errs.lastName = 'Nom requis.';
    if (!firstName.trim()) errs.firstName = 'Prénom requis.';
    if (!email.trim()) errs.email = 'E-mail requis.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'E-mail invalide.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const confirm = () => {
    const res: Reservation = {
      id: genResNumber(),
      boatId: boat.id,
      boatName: boat.name,
      boatImage: boat.images[0],
      clientName: lastName,
      clientFirstName: firstName,
      clientEmail: email,
      date,
      startTime,
      duration,
      guests,
      rentalPrice: basePrice,
      serviceFee,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      endCode: genEndCode(),
      reviewSubmitted: false,
      problemReported: false,
    };
    addReservation(res);
    setConfirmation(res);
    setStep(4);
  };

  const steps = [
    { n: 1, label: 'Créneau' },
    { n: 2, label: 'Récapitulatif' },
    { n: 3, label: 'Vos informations' },
    { n: 4, label: 'Confirmation' },
  ];

  return (
    <div className="bg-mist-100 min-h-screen">
      <div className="container-app py-8 lg:py-12">
        <button onClick={() => go('boat', boat.id)} className="btn-ghost text-sm mb-5 -ml-2">
          <ArrowLeft size={16} /> Retour au bateau
        </button>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 max-w-2xl">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center font-display font-bold text-sm transition ${
                    step >= s.n
                      ? 'bg-ocean-400 text-white shadow-lg'
                      : 'bg-white text-mist-400 border-2 border-navy-50'
                  }`}
                >
                  {step > s.n ? <CheckCircle2 size={18} /> : s.n}
                </div>
                <span className={`text-xs font-semibold ${step >= s.n ? 'text-navy-800' : 'text-mist-400'}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 -mt-6 ${step > s.n ? 'bg-ocean-400' : 'bg-navy-50'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Main content */}
          <div>
            {step === 1 && (
              <div className="card p-6 animate-fadeIn">
                <h2 className="font-display font-bold text-2xl text-navy-800 mb-1">Choisissez votre créneau</h2>
                <p className="text-navy-600 text-sm mb-5">Sélectionnez la date, l'heure et la durée de votre sortie.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label text-sm">Date</label>
                    <input type="date" min={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} className="input" />
                    {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="label text-sm">Heure de départ</label>
                    <input type="time" min="06:00" max="20:00" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="input" />
                    {errors.startTime && <p className="text-xs text-rose-500 mt-1">{errors.startTime}</p>}
                  </div>
                  <div>
                    <label className="label text-sm">Durée</label>
                    <select value={duration} onChange={(e) => setDuration(e.target.value as Duration)} className="input">
                      {boat.durations.map((d) => (
                        <option key={d} value={d}>{DURATION_LABELS[d]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label text-sm">Personnes (max {boat.capacity})</label>
                    <input type="number" min={1} max={boat.capacity} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="input" />
                    {errors.guests && <p className="text-xs text-rose-500 mt-1">{errors.guests}</p>}
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => validateSlot() && setStep(2)}
                    className="btn-primary"
                  >
                    Continuer <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card p-6 animate-fadeIn">
                <h2 className="font-display font-bold text-2xl text-navy-800 mb-5">Récapitulatif</h2>
                <div className="flex gap-4 pb-5 border-b border-navy-50">
                  <img src={boat.images[0]} alt={boat.name} className="h-20 w-28 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-display font-bold text-lg text-navy-800">{boat.name}</h3>
                    <p className="text-sm text-navy-600">{TYPE_LABELS[boat.type]} · {boat.location}</p>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-navy-600">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {formatDateFR(date)}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {startTime}</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {guests} pers.</span>
                    </div>
                  </div>
                </div>
                <div className="py-5 space-y-2 border-b border-navy-50">
                  <Row label={`Location (${DURATION_LABELS[duration]})`} value={formatEuroPrecise(basePrice)} />
                  <Row label="Frais de service (15% démo)" value={formatEuroPrecise(serviceFee)} />
                  <Row label="Total" value={formatEuroPrecise(total)} strong />
                </div>
                <div className="mt-5">
                  <Banner>Les conditions d'annulation restent des hypothèses à valider avant toute mise en production.</Banner>
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(1)} className="btn-ghost"><ArrowLeft size={16} /> Retour</button>
                  <button onClick={() => setStep(3)} className="btn-primary">Continuer <ArrowRight size={16} /></button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card p-6 animate-fadeIn">
                <h2 className="font-display font-bold text-2xl text-navy-800 mb-1">Vos informations</h2>
                <p className="text-navy-600 text-sm mb-5">Données de démonstration — aucune pièce d'identité ni donnée bancaire ne sera demandée.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label text-sm">Prénom</label>
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input" placeholder="Marie" />
                    {errors.firstName && <p className="text-xs text-rose-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="label text-sm">Nom</label>
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="input" placeholder="Dupont" />
                    {errors.lastName && <p className="text-xs text-rose-500 mt-1">{errors.lastName}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label text-sm">E-mail (démo)</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="demo@example.com" />
                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="mt-5">
                  <Banner>
                    <strong>Ceci est une simulation.</strong> Aucune réservation réelle ne sera effectuée. Aucun e-mail ne sera envoyé.
                  </Banner>
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(2)} className="btn-ghost"><ArrowLeft size={16} /> Retour</button>
                  <button onClick={() => validateInfos() && confirm()} className="btn-primary">
                    <CheckCircle2 size={18} /> Confirmer la simulation
                  </button>
                </div>
              </div>
            )}

            {step === 4 && confirmation && (
              <div className="card p-8 text-center animate-scaleIn">
                <div className="mx-auto h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
                  <CheckCircle2 size={40} className="text-emerald-600" />
                </div>
                <h2 className="font-display font-extrabold text-3xl text-navy-800">Simulation confirmée</h2>
                <p className="mt-2 text-navy-600">Votre réservation de démonstration a bien été enregistrée localement.</p>

                <div className="mt-6 rounded-2xl bg-mist-100 p-5 text-left max-w-md mx-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-navy-100">
                    <span className="text-sm text-mist-400">N° de réservation</span>
                    <span className="font-display font-bold text-navy-800">{confirmation.id}</span>
                  </div>
                  <div className="py-3 space-y-1.5 text-sm">
                    <Row label="Bateau" value={confirmation.boatName} />
                    <Row label="Date" value={formatDateFR(confirmation.date)} />
                    <Row label="Heure" value={confirmation.startTime} />
                    <Row label="Durée" value={DURATION_LABELS[confirmation.duration]} />
                    <Row label="Personnes" value={`${confirmation.guests}`} />
                  </div>
                  <div className="pt-3 border-t border-navy-100 space-y-1.5 text-sm">
                    <Row label="Location" value={formatEuroPrecise(confirmation.rentalPrice)} />
                    <Row label="Frais de service" value={formatEuroPrecise(confirmation.serviceFee)} />
                    <Row label="Total" value={formatEuroPrecise(confirmation.total)} strong />
                  </div>
                  <div className="mt-3 pt-3 border-t border-navy-100 flex items-center justify-center gap-2">
                    <span className="chip bg-amber-100 text-amber-800 text-xs font-semibold">
                      <Sparkles size={12} /> Réservation de démonstration
                    </span>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <button onClick={() => go('catalog')} className="btn-primary">
                    <HomeIcon size={16} /> Revenir au catalogue
                  </button>
                  <button onClick={() => go('owner-requests')} className="btn-outline">Voir les demandes</button>
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          {step < 4 && (
            <aside className="lg:sticky lg:top-24 h-fit">
              <div className="card p-5">
                <img src={boat.images[0]} alt={boat.name} className="w-full aspect-[16/10] rounded-xl object-cover" />
                <h3 className="mt-3 font-display font-bold text-navy-800">{boat.name}</h3>
                <p className="text-sm text-navy-600">{TYPE_LABELS[boat.type]} · {boat.location}</p>
                <div className="mt-4 pt-4 border-t border-navy-50 space-y-2 text-sm">
                  <Row label="Location" value={formatEuroPrecise(basePrice)} />
                  <Row label="Frais de service" value={formatEuroPrecise(serviceFee)} />
                  <Row label="Total" value={formatEuroPrecise(total)} strong />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-mist-400">
                  <ShieldCheck size={14} className="text-ocean-500" />
                  Simulation — aucun paiement réel.
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? 'font-display font-bold text-navy-800 text-base' : 'text-navy-700'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
