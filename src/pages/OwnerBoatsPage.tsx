import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Anchor, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store';
import { useNav } from '../nav';
import { PageHeader, Banner, EmptyState } from '../components/ui';
import type { Boat, BoatType, Duration, OwnerType } from '../types';
import { TYPE_LABELS, DURATION_LABELS, OWNER_LABELS, formatEuro, uid } from '../lib';

const blankForm: Omit<Boat, 'id'> = {
  name: '',
  type: 'motor',
  ownerType: 'private',
  ownerName: 'Propriétaire privé (démonstration)',
  location: 'Cap d\'Agde',
  departurePort: 'Cap d\'Agde (fictif)',
  description: '',
  capacity: 6,
  length: 7,
  power: '200 ch',
  year: 2020,
  licenseRequired: true,
  pricePerDuration: { 'few-hours': 200, 'half-day': 320, 'full-day': 480 },
  deposit: 1500,
  fuelPolicy: 'Carburant non inclus, départ plein retour plein.',
  amenities: ['Bimini', 'Échelle de bain', 'Glacière', 'Gilets de sécurité'],
  images: ['https://images.pexels.com/photos/4458003/pexels-photo-4458003.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  rating: 4.5,
  ratingCount: 0,
  durations: ['few-hours', 'half-day', 'full-day'],
  published: true,
};

export function OwnerBoatsPage() {
  const { boats, addBoat, updateBoat, deleteBoat } = useStore();
  const { go } = useNav();
  const [editing, setEditing] = useState<Boat | null>(null);
  const [creating, setCreating] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setCreating(true);
  };
  const openEdit = (b: Boat) => {
    setEditing(b);
    setCreating(true);
  };
  const close = () => {
    setEditing(null);
    setCreating(false);
  };

  return (
    <div className="bg-mist-100 min-h-screen">
      <div className="container-app py-10">
        <PageHeader
          eyebrow="Espace loueur"
          title="Mes bateaux"
          subtitle="Gérez vos annonces de démonstration. Aucune annonce n'est publiée comme une offre réelle."
        />

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-navy-600">
            <span className="font-bold text-navy-800">{boats.length}</span> bateau{boats.length > 1 ? 'x' : ''} dans votre espace démo
          </p>
          <button onClick={openCreate} className="btn-primary">
            <Plus size={18} /> Ajouter une annonce
          </button>
        </div>

        {boats.length === 0 ? (
          <EmptyState
            title="Aucun bateau"
            message="Votre espace de démonstration est vide. Ajoutez une première annonce fictive."
            action={<button onClick={openCreate} className="btn-primary"><Plus size={16} /> Ajouter une annonce</button>}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {boats.map((b) => (
              <div key={b.id} className="card overflow-hidden flex flex-col">
                <div className="relative aspect-[16/10] bg-mist-100">
                  <img src={b.images[0]} alt={b.name} className="w-full h-full object-cover" />
                  <span className={`absolute top-3 left-3 chip text-xs ${b.published ? 'bg-emerald-100 text-emerald-700' : 'bg-mist-200 text-mist-400'}`}>
                    {b.published ? 'Publié' : 'Masqué'}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-display font-bold text-navy-800">{b.name}</h3>
                  <p className="text-xs text-navy-600 mt-1">{TYPE_LABELS[b.type]} · {OWNER_LABELS[b.ownerType]}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy-50">
                    <span className="font-display font-bold text-navy-800">{formatEuro(b.pricePerDuration['few-hours'] || b.pricePerDuration['half-day'])}</span>
                    <div className="flex gap-1">
                      <button onClick={() => go('boat', b.id)} className="btn-ghost p-2" title="Voir"><Eye size={16} /></button>
                      <button onClick={() => updateBoat(b.id, { published: !b.published })} className="btn-ghost p-2" title={b.published ? 'Masquer' : 'Publier'}>
                        {b.published ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button onClick={() => openEdit(b)} className="btn-ghost p-2" title="Modifier"><Pencil size={16} /></button>
                      <button onClick={() => { if (confirm(`Retirer l'annonce « ${b.name} » ?`)) deleteBoat(b.id); }} className="btn-ghost p-2 text-rose-500 hover:bg-rose-50" title="Retirer"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {creating && (
        <BoatForm
          initial={editing}
          onClose={close}
          onSave={(boat) => {
            if (editing) updateBoat(editing.id, boat);
            else addBoat({ ...boat, id: uid('b') });
            close();
          }}
        />
      )}
    </div>
  );
}

function BoatForm({
  initial,
  onClose,
  onSave,
}: {
  initial: Boat | null;
  onClose: () => void;
  onSave: (boat: Omit<Boat, 'id'>) => void;
}) {
  const [form, setForm] = useState<Omit<Boat, 'id'>>(initial ? { ...initial } : blankForm);
  const [amenityInput, setAmenityInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleDuration = (d: Duration) =>
    setForm((f) => ({
      ...f,
      durations: f.durations.includes(d) ? f.durations.filter((x) => x !== d) : [...f.durations, d],
    }));

  const submit = () => {
    if (!form.name.trim()) return alert('Le nom du bateau est requis.');
    if (form.durations.length === 0) return alert('Sélectionnez au moins une durée.');
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-start lg:items-center justify-center p-4 overflow-y-auto">
      <div className="card w-full max-w-2xl my-8 animate-scaleIn">
        <div className="flex items-center justify-between p-5 border-b border-navy-50 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="font-display font-bold text-xl text-navy-800 flex items-center gap-2">
            <Anchor size={20} className="text-ocean-500" /> {initial ? 'Modifier l\'annonce' : 'Nouvelle annonce de démonstration'}
          </h2>
          <button onClick={onClose} className="btn-ghost p-2"><X size={20} /></button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Nom du bateau</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} className="input" placeholder="L'Évasion Bleue" />
            </div>
            <div>
              <label className="label">Type</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value as BoatType)} className="input">
                {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Type de loueur</label>
              <select value={form.ownerType} onChange={(e) => set('ownerType', e.target.value as OwnerType)} className="input">
                {Object.entries(OWNER_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Localisation</label>
              <input value={form.location} onChange={(e) => set('location', e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Lieu de départ</label>
              <input value={form.departurePort} onChange={(e) => set('departurePort', e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Capacité (personnes)</label>
              <input type="number" min={1} value={form.capacity} onChange={(e) => set('capacity', Number(e.target.value))} className="input" />
            </div>
            <div>
              <label className="label">Longueur (m)</label>
              <input type="number" step={0.1} value={form.length} onChange={(e) => set('length', Number(e.target.value))} className="input" />
            </div>
            <div>
              <label className="label">Puissance</label>
              <input value={form.power} onChange={(e) => set('power', e.target.value)} className="input" placeholder="250 ch" />
            </div>
            <div>
              <label className="label">Année</label>
              <input type="number" value={form.year} onChange={(e) => set('year', Number(e.target.value))} className="input" />
            </div>
            <div>
              <label className="label">Caution (€)</label>
              <input type="number" value={form.deposit} onChange={(e) => set('deposit', Number(e.target.value))} className="input" />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className="input resize-none" placeholder="Décrivez le bateau..." />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Permis nécessaire ?</label>
              <select value={form.licenseRequired ? 'yes' : 'no'} onChange={(e) => set('licenseRequired', e.target.value === 'yes')} className="input">
                <option value="yes">Permis requis</option>
                <option value="no">Sans permis</option>
              </select>
            </div>
            <div>
              <label className="label">Politique carburant</label>
              <input value={form.fuelPolicy} onChange={(e) => set('fuelPolicy', e.target.value)} className="input" />
            </div>
          </div>

          {/* Durations */}
          <div>
            <label className="label">Durées disponibles</label>
            <div className="flex flex-wrap gap-2">
              {(['few-hours', 'half-day', 'full-day'] as Duration[]).map((d) => (
                <button
                  key={d}
                  onClick={() => toggleDuration(d)}
                  className={`chip text-sm px-3 py-1.5 transition ${form.durations.includes(d) ? 'bg-ocean-400 text-white' : 'bg-mist-100 text-navy-700'}`}
                >
                  {DURATION_LABELS[d]}
                </button>
              ))}
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-3 gap-3">
            {(['few-hours', 'half-day', 'full-day'] as Duration[]).map((d) => (
              <div key={d}>
                <label className="label text-xs">{DURATION_LABELS[d]}</label>
                <input
                  type="number"
                  value={form.pricePerDuration[d]}
                  onChange={(e) => set('pricePerDuration', { ...form.pricePerDuration, [d]: Number(e.target.value) })}
                  className="input py-2 text-sm"
                />
              </div>
            ))}
          </div>

          {/* Amenities */}
          <div>
            <label className="label">Équipements</label>
            <div className="flex gap-2">
              <input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && amenityInput.trim()) {
                    set('amenities', [...form.amenities, amenityInput.trim()]);
                    setAmenityInput('');
                  }
                }}
                className="input"
                placeholder="Ajouter un équipement..."
              />
              <button
                onClick={() => {
                  if (amenityInput.trim()) {
                    set('amenities', [...form.amenities, amenityInput.trim()]);
                    setAmenityInput('');
                  }
                }}
                className="btn-outline shrink-0"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.amenities.map((a, i) => (
                <span key={i} className="chip bg-mist-100 text-navy-700 text-sm">
                  {a}
                  <button onClick={() => set('amenities', form.amenities.filter((_, x) => x !== i))} className="ml-1 hover:text-rose-500">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="label">Photos (URLs)</label>
            <div className="flex gap-2">
              <input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && imageInput.trim()) {
                    set('images', [...form.images, imageInput.trim()]);
                    setImageInput('');
                  }
                }}
                className="input"
                placeholder="https://..."
              />
              <button
                onClick={() => {
                  if (imageInput.trim()) {
                    set('images', [...form.images, imageInput.trim()]);
                    setImageInput('');
                  }
                }}
                className="btn-outline shrink-0"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {form.images.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => set('images', form.images.filter((_, x) => x !== i))}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="h-4 w-4 accent-ocean-400" />
            <label htmlFor="published" className="text-sm text-navy-700">Annonce visible dans le catalogue</label>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-navy-50 sticky bottom-0 bg-white rounded-b-2xl">
          <button onClick={onClose} className="btn-ghost">Annuler</button>
          <button onClick={submit} className="btn-primary">
            {initial ? 'Enregistrer' : 'Créer l\'annonce'}
          </button>
        </div>
      </div>
    </div>
  );
}
