import { useState } from 'react';
import {
  Search, MapPin, Calendar, Users, Clock, ArrowRight,
  ShieldCheck, Anchor, Waves, Sailboat, LifeBuoy,
  Sparkles, BadgeEuro, HandshakeIcon, ShieldAlert,
} from 'lucide-react';
import { useNav } from '../nav';
import { useStore } from '../store';
import { BoatCard } from '../components/BoatCard';
import { Banner } from '../components/ui';
import type { Duration } from '../types';
import { formatEuro } from '../lib';

const heroImg = 'https://images.pexels.com/photos/13574596/pexels-photo-13574596.jpeg?auto=compress&cs=tinysrgb&w=1600';
const ctaImg = 'https://images.pexels.com/photos/25300833/pexels-photo-25300833.jpeg?auto=compress&cs=tinysrgb&w=1200';

export function HomePage() {
  const { go } = useNav();
  const { boats } = useStore();
  const [destination, setDestination] = useState('Cap d\'Agde');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState<Duration | ''>('');
  const [guests, setGuests] = useState(2);

  const search = () => {
    go('catalog');
  };

  const featured = boats.filter((b) => b.published).slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Bateau en Méditerranée" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-800/75 to-navy-700/40" />
        </div>

        <div className="relative container-app py-20">
          <div className="max-w-3xl animate-fadeUp">
            <span className="inline-flex items-center gap-2 chip bg-white/10 backdrop-blur text-white text-sm border border-white/20 mb-5">
              <Anchor size={14} className="text-ocean-300" /> Lancement au Cap d'Agde
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white leading-[1.05]">
              La mer vous attend.<br />
              <span className="text-ocean-300">Trouvez votre bateau.</span>
            </h1>
            <p className="mt-5 text-lg text-white/90 max-w-xl">
              Découvrez les bateaux à louer au Cap d'Agde et préparez votre prochaine sortie en mer.
            </p>

            {/* Search bar */}
            <div className="mt-8 bg-white rounded-2xl shadow-2xl p-4 md:p-5 grid grid-cols-1 md:grid-cols-4 gap-3 max-w-4xl">
              <div>
                <label className="label text-xs">Destination</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
                  <input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="input pl-9 text-sm py-2.5"
                    placeholder="Cap d'Agde"
                  />
                </div>
              </div>
              <div>
                <label className="label text-xs">Date de départ</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
                  <input
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input pl-9 text-sm py-2.5"
                  />
                </div>
              </div>
              <div>
                <label className="label text-xs">Durée</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value as Duration | '')}
                    className="input pl-9 text-sm py-2.5 appearance-none pr-8"
                  >
                    <option value="">Toute durée</option>
                    <option value="few-hours">Quelques heures</option>
                    <option value="half-day">Demi-journée</option>
                    <option value="full-day">Journée</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label text-xs">Personnes</label>
                <div className="relative">
                  <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                    className="input pl-9 text-sm py-2.5"
                  />
                </div>
              </div>
              <div className="md:col-span-4">
                <button onClick={search} className="btn-primary w-full text-base py-3.5">
                  <Search size={18} /> Rechercher
                </button>
              </div>
            </div>

            <div className="mt-4">
              <Banner tone="navy">
                <span className="font-semibold">Démonstration de concept.</span> Les bateaux présentés sont fictifs. Aucune réservation réelle ne sera effectuée.
              </Banner>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 80" className="w-full h-[60px] fill-white" preserveAspectRatio="none">
            <path d="M0,40 C240,80 480,0 720,30 C960,60 1200,10 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* FEATURED BOATS */}
      <section className="section bg-white">
        <div className="container-app">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ocean-500">Sélection</span>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-navy-800 mt-2">Les bateaux à découvrir</h2>
              <p className="mt-2 text-navy-600 max-w-xl">Une sélection de bateaux fictifs au départ du Cap d'Agde, présentés à titre d'exemple.</p>
            </div>
            <button onClick={() => go('catalog')} className="btn-outline self-start md:self-end">
              Voir tout le catalogue <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((b) => (
              <BoatCard key={b.id} boat={b} />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section bg-mist-100">
        <div className="container-app">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-ocean-500">Par type de bateau</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-navy-800 mt-2">
              Trouvez le bateau adapté à votre sortie
            </h2>
            <p className="mt-2 text-navy-600 max-w-2xl mx-auto">
              Du bateau sans permis au yacht premium, chaque type de sortie a sa solution.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <CategoryCard
              icon={<ShieldCheck size={22} />}
              title="Bateaux sans permis"
              desc="Naviguez sans contrainte réglementaire, briefing de sécurité inclus."
              tag="Accessible à tous"
            />
            <CategoryCard
              icon={<Waves size={22} />}
              title="Bateaux à moteur"
              desc="Maniables et confortables, idéals pour les sorties en famille."
              tag="Le plus demandé"
            />
            <CategoryCard
              icon={<Anchor size={22} />}
              title="Semi-rigides"
              desc="Sensations fortes et sportives le long du littoral agathois."
              tag="Sportif"
            />
            <CategoryCard
              icon={<Sailboat size={22} />}
              title="Voiliers"
              desc="Navigation silencieuse au gré du vent, skipper optionnel."
              tag="Éco-responsable"
            />
            <CategoryCard
              icon={<Sparkles size={22} />}
              title="Bateaux premium"
              desc="Prestations haut de gamme pour une journée d'exception."
              tag="Prestige"
            />
            <button
              onClick={() => go('catalog')}
              className="card card-hover flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-navy-700 to-navy-800 text-white"
            >
              <ArrowRight size={28} className="text-ocean-300" />
              <h3 className="mt-3 font-display font-bold text-lg">Voir tout le catalogue</h3>
              <p className="text-sm text-white/80 mt-1">Plus de 8 bateaux fictifs</p>
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section bg-white">
        <div className="container-app">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-ocean-500">Simple en 3 étapes</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-navy-800 mt-2">Comment ça marche ?</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 relative">
            <StepCard
              n={1}
              icon={<Search size={24} />}
              title="Trouvez votre bateau"
              desc="Filtrez par type, capacité, prix et permis. Comparez les bateaux disponibles au Cap d'Agde."
            />
            <StepCard
              n={2}
              icon={<Calendar size={24} />}
              title="Réservez votre créneau"
              desc="Choisissez votre date, votre durée et le nombre de personnes. La simulation calcule le total."
            />
            <StepCard
              n={3}
              icon={<Anchor size={24} />}
              title="Embarquez en mer"
              desc="Présentez-vous au port de départ. Le loueur vous briefe et vous confie le bateau."
            />
          </div>
          <div className="text-center mt-10">
            <button onClick={() => go('how-it-works')} className="btn-outline">
              En savoir plus sur le déroulement <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* OWNER CTA */}
      <section className="section bg-navy-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={ctaImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative container-app">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 chip bg-ocean-400/20 text-ocean-200 text-sm border border-ocean-400/30 mb-5">
                <HandshakeIcon size={14} /> Loueurs & propriétaires
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Proposez votre bateau à la location
              </h2>
              <p className="mt-4 text-white/80 text-lg max-w-xl">
                Loueurs professionnels ou propriétaires privés, Port Nautic Service vous aide à valoriser votre bateau. Simulez vos revenus et découvrez l'espace de gestion.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={() => go('renter-onboarding')} className="btn-primary text-base">
                  Devenir loueur <ArrowRight size={18} />
                </button>
                <button onClick={() => go('commission')} className="btn-outline border-white/30 text-white hover:bg-white/10">
                  <BadgeEuro size={18} /> Simuler mes revenus
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MiniBenefit icon={<LifeBuoy size={20} />} title="Gestion simple" desc="Tableau de bord pour vos annonces et demandes" />
              <MiniBenefit icon={<ShieldAlert size={20} />} title="Vérification" desc="Identité et documents contrôlés avant publication" />
              <MiniBenefit icon={<Sparkles size={20} />} title="Visibilité" desc="Mise en avant auprès des clients du Cap d'Agde" />
              <MiniBenefit icon={<BadgeEuro size={20} />} title="Revenus" desc="Simulateur de revenus potentiels" />
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section bg-mist-100">
        <div className="container-app">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-ocean-500">Pourquoi nous choisir</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-navy-800 mt-2">
              Les avantages du service
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <BenefitCard icon={<ShieldCheck size={24} />} title="Sécurité" desc="Vérification des loueurs et briefings de sécurité avant chaque sortie." />
            <BenefitCard icon={<LifeBuoy size={24} />} title="Accompagnement" desc="Demandes, échanges et suivi de location dans un espace dédié." />
            <BenefitCard icon={<Anchor size={24} />} title="Au départ du Cap d'Agde" desc="Un lancement local, une connaissance fine du terrain." />
            <BenefitCard icon={<BadgeEuro size={24} />} title="Tarifs clairs" desc="Prix de location et frais de service affichés en toute transparence." />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section bg-white">
        <div className="container-app">
          <div className="rounded-3xl bg-gradient-to-br from-navy-700 via-navy-800 to-ocean-700 p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-ocean-400/20 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-ocean-300/20 blur-2xl" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">
                Prêt à embarquer au Cap d'Agde ?
              </h2>
              <p className="mt-3 text-white/85 max-w-xl mx-auto">
                Découvrez notre catalogue de démonstration et simulez votre première réservation en mer.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button onClick={() => go('catalog')} className="btn-primary text-base px-6 py-3.5">
                  <Search size={18} /> Trouver un bateau
                </button>
                <button onClick={() => go('project')} className="btn-outline border-white/30 text-white hover:bg-white/10 px-6 py-3.5">
                  Le projet
                </button>
              </div>
              <p className="mt-5 text-xs text-white/60">
                Version de démonstration — aucune réservation réelle ne sera effectuée.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ icon, title, desc, tag }: { icon: React.ReactNode; title: string; desc: string; tag: string }) {
  const { go } = useNav();
  return (
    <button onClick={() => go('catalog')} className="card card-hover text-left p-6 flex flex-col">
      <div className="flex items-start justify-between">
        <div className="h-12 w-12 rounded-xl bg-ocean-50 text-ocean-500 flex items-center justify-center">
          {icon}
        </div>
        <span className="chip bg-navy-50 text-navy-700 text-xs">{tag}</span>
      </div>
      <h3 className="mt-4 font-display font-bold text-lg text-navy-800">{title}</h3>
      <p className="mt-1.5 text-sm text-navy-600">{desc}</p>
    </button>
  );
}

function StepCard({ n, icon, title, desc }: { n: number; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card p-7 relative">
      <div className="absolute -top-4 -left-4 h-12 w-12 rounded-2xl bg-navy-800 text-white flex items-center justify-center font-display font-extrabold text-lg shadow-card">
        {n}
      </div>
      <div className="mt-4 h-12 w-12 rounded-xl bg-ocean-50 text-ocean-500 flex items-center justify-center">{icon}</div>
      <h3 className="mt-4 font-display font-bold text-lg text-navy-800">{title}</h3>
      <p className="mt-1.5 text-sm text-navy-600">{desc}</p>
    </div>
  );
}

function MiniBenefit({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-4">
      <div className="h-9 w-9 rounded-lg bg-ocean-400/20 text-ocean-200 flex items-center justify-center">{icon}</div>
      <h4 className="mt-3 font-semibold text-white text-sm">{title}</h4>
      <p className="text-xs text-white/70 mt-1">{desc}</p>
    </div>
  );
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card p-6">
      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-navy-700 to-navy-800 text-ocean-300 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-4 font-display font-bold text-lg text-navy-800">{title}</h3>
      <p className="mt-1.5 text-sm text-navy-600">{desc}</p>
    </div>
  );
}
