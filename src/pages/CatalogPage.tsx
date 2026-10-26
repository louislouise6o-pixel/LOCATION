import { useMemo, useState } from 'react';
import { SlidersHorizontal, X, ArrowUpDown, Frown } from 'lucide-react';
import { useStore } from '../store';
import { BoatCard } from '../components/BoatCard';
import { Banner, EmptyState, PageHeader } from '../components/ui';
import type { BoatType, Duration, OwnerType } from '../types';
import { formatEuro, TYPE_LABELS, DURATION_LABELS, OWNER_LABELS } from '../lib';

const allTypes: BoatType[] = ['no-license', 'motor', 'semi-rigid', 'sail', 'premium'];

export function CatalogPage() {
  const { boats } = useStore();
  const [showFilters, setShowFilters] = useState(false);

  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(2000);
  const [guests, setGuests] = useState<number>(0);
  const [types, setTypes] = useState<BoatType[]>([]);
  const [license, setLicense] = useState<'any' | 'none' | 'required'>('any');
  const [ownerType, setOwnerType] = useState<OwnerType | ''>('');
  const [duration, setDuration] = useState<Duration | ''>('');
  const [sort, setSort] = useState<'asc' | 'desc' | 'rating'>('rating');

  const toggleType = (t: BoatType) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const filtered = useMemo(() => {
    let list = boats.filter((b) => b.published);
    if (types.length) list = list.filter((b) => types.includes(b.type));
    if (license === 'none') list = list.filter((b) => !b.licenseRequired);
    if (license === 'required') list = list.filter((b) => b.licenseRequired);
    if (ownerType) list = list.filter((b) => b.ownerType === ownerType);
    if (guests > 0) list = list.filter((b) => b.capacity >= guests);
    if (duration) list = list.filter((b) => b.durations.includes(duration as Duration));
    list = list.filter((b) => {
      const base = b.pricePerDuration['few-hours'] || b.pricePerDuration['half-day'] || b.pricePerDuration['full-day'];
      return base >= priceMin && base <= priceMax;
    });
    list = [...list].sort((a, b) => {
      const pa = a.pricePerDuration['few-hours'] || a.pricePerDuration['half-day'] || a.pricePerDuration['full-day'];
      const pb = b.pricePerDuration['few-hours'] || b.pricePerDuration['half-day'] || b.pricePerDuration['full-day'];
      if (sort === 'asc') return pa - pb;
      if (sort === 'desc') return pb - pa;
      return b.rating - a.rating;
    });
    return list;
  }, [boats, types, license, ownerType, guests, duration, priceMin, priceMax, sort]);

  const reset = () => {
    setPriceMin(0);
    setPriceMax(2000);
    setGuests(0);
    setTypes([]);
    setLicense('any');
    setOwnerType('');
    setDuration('');
    setSort('rating');
  };

  const activeFilters =
    (types.length ? 1 : 0) +
    (license !== 'any' ? 1 : 0) +
    (ownerType ? 1 : 0) +
    (guests > 0 ? 1 : 0) +
    (duration ? 1 : 0) +
    (priceMin > 0 || priceMax < 2000 ? 1 : 0);

  return (
    <div className="bg-mist-100 min-h-screen">
      <div className="container-app py-10">
        <PageHeader
          eyebrow="Catalogue"
          title="Bateaux à louer au Cap d'Agde"
          subtitle="Toutes les annonces présentées ici sont fictives, à titre de démonstration du concept."
        />
        <div className="mb-6">
          <Banner>Aucune de ces annonces n'est réelle. Les prix et caractéristiques sont des exemples pour la démonstration.</Banner>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/40 lg:bg-transparent lg:static' : 'hidden lg:block'} lg:w-72 shrink-0`}>
            <div className={`${showFilters ? 'absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white p-5 overflow-y-auto lg:static lg:w-full lg:p-5' : 'card p-5'} lg:sticky lg:top-24`}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-lg text-navy-800">Filtres</h2>
                <div className="flex items-center gap-2">
                  {activeFilters > 0 && (
                    <button onClick={reset} className="text-xs font-semibold text-ocean-500 hover:text-ocean-600">
                      Réinitialiser
                    </button>
                  )}
                  <button onClick={() => setShowFilters(false)} className="lg:hidden btn-ghost p-1.5">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                {/* Budget */}
                <div>
                  <h3 className="label">Budget (à partir de)</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={priceMin}
                      onChange={(e) => setPriceMin(Math.max(0, Number(e.target.value)))}
                      className="input py-2 text-sm"
                      placeholder="Min"
                    />
                    <span className="text-mist-400">—</span>
                    <input
                      type="number"
                      max={5000}
                      value={priceMax}
                      onChange={(e) => setPriceMax(Math.max(0, Number(e.target.value)))}
                      className="input py-2 text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <p className="text-xs text-mist-400 mt-1.5">Prix de base par durée minimale</p>
                </div>

                {/* Guests */}
                <div>
                  <h3 className="label">Nombre de personnes</h3>
                  <input
                    type="range"
                    min={0}
                    max={12}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full accent-ocean-400"
                  />
                  <div className="flex justify-between text-xs text-mist-400 mt-1">
                    <span>Tous</span>
                    <span className="font-semibold text-navy-700">{guests === 0 ? 'Tous' : `${guests}+`}</span>
                  </div>
                </div>

                {/* Type */}
                <div>
                  <h3 className="label">Type de bateau</h3>
                  <div className="flex flex-col gap-2">
                    {allTypes.map((t) => (
                      <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={types.includes(t)}
                          onChange={() => toggleType(t)}
                          className="h-4 w-4 rounded accent-ocean-400"
                        />
                        <span className="text-sm text-navy-700 group-hover:text-navy-900">{TYPE_LABELS[t]}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* License */}
                <div>
                  <h3 className="label">Permis</h3>
                  <div className="flex flex-col gap-2">
                    {([
                      { v: 'any', l: 'Tous' },
                      { v: 'none', l: 'Sans permis' },
                      { v: 'required', l: 'Permis requis' },
                    ] as const).map((o) => (
                      <label key={o.v} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="license"
                          checked={license === o.v}
                          onChange={() => setLicense(o.v)}
                          className="h-4 w-4 accent-ocean-400"
                        />
                        <span className="text-sm text-navy-700">{o.l}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Owner type */}
                <div>
                  <h3 className="label">Loueur</h3>
                  <select
                    value={ownerType}
                    onChange={(e) => setOwnerType(e.target.value as OwnerType | '')}
                    className="input py-2 text-sm"
                  >
                    <option value="">Tous</option>
                    <option value="professional">{OWNER_LABELS.professional}</option>
                    <option value="private">{OWNER_LABELS.private}</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <h3 className="label">Durée</h3>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value as Duration | '')}
                    className="input py-2 text-sm"
                  >
                    <option value="">Toute durée</option>
                    <option value="few-hours">{DURATION_LABELS['few-hours']}</option>
                    <option value="half-day">{DURATION_LABELS['half-day']}</option>
                    <option value="full-day">{DURATION_LABELS['full-day']}</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5 gap-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowFilters(true)} className="btn-outline text-sm lg:hidden">
                  <SlidersHorizontal size={16} /> Filtres
                  {activeFilters > 0 && (
                    <span className="ml-1 chip bg-ocean-400 text-white text-xs px-2 py-0.5">{activeFilters}</span>
                  )}
                </button>
                <p className="text-sm text-navy-600">
                  <span className="font-bold text-navy-800">{filtered.length}</span> bateau{filtered.length > 1 ? 'x' : ''} trouvé{filtered.length > 1 ? 's' : ''}
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <ArrowUpDown size={15} className="text-mist-400" />
                <select value={sort} onChange={(e) => setSort(e.target.value as 'asc' | 'desc' | 'rating')} className="input py-2 text-sm w-auto">
                  <option value="rating">Tri : mieux notés</option>
                  <option value="asc">Prix croissant</option>
                  <option value="desc">Prix décroissant</option>
                </select>
              </label>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                title="Aucun bateau ne correspond"
                message="Aucune annonce ne correspond à vos filtres. Essayez d'élargir votre recherche ou réinitialisez les filtres."
                action={
                  <button onClick={reset} className="btn-primary">
                    <X size={16} /> Réinitialiser les filtres
                  </button>
                }
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((b) => (
                  <BoatCard key={b.id} boat={b} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
