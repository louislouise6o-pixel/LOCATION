import {
  Home, Search, Anchor, Calendar, BadgeEuro, LayoutDashboard,
  X, Compass, ShieldCheck, Sailboat, LifeBuoy,
} from 'lucide-react';
import { useNav } from '../nav';
import { useStore } from '../store';
import { Logo } from './Logo';

export function PresentationMode() {
  const { go, setPresentation } = useNav();
  const { boats } = useStore();

  const firstBoat = boats[0];

  const actions = [
    { icon: <Home size={18} />, label: 'Accueil', page: 'home' as const, desc: 'Page d\'accueil' },
    { icon: <Search size={18} />, label: 'Catalogue', page: 'catalog' as const, desc: 'Tous les bateaux' },
    { icon: <Anchor size={18} />, label: 'Fiche bateau', page: 'boat' as const, param: firstBoat?.id, desc: 'Détail d\'une annonce' },
    { icon: <Calendar size={18} />, label: 'Simulation réservation', page: 'boat' as const, param: firstBoat?.id, desc: 'Parcours de réservation' },
    { icon: <BadgeEuro size={18} />, label: 'Simulateur économique', page: 'commission' as const, desc: 'Calcul de commission' },
    { icon: <LayoutDashboard size={18} />, label: 'Tableau de bord loueur', page: 'owner-dashboard' as const, desc: 'Espace de gestion' },
    { icon: <Compass size={18} />, label: 'Comment ça marche', page: 'how-it-works' as const, desc: 'Le parcours' },
    { icon: <Sailboat size={18} />, label: 'Déroulement location', page: 'rental-flow' as const, desc: 'Simulation du déroulement' },
    { icon: <ShieldCheck size={18} />, label: 'Administration', page: 'admin' as const, desc: 'Espace dirigeant' },
    { icon: <LifeBuoy size={18} />, label: 'Le projet', page: 'project' as const, desc: 'Concept et lancement' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="card shadow-cardHover p-4 w-72 animate-scaleIn">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-ocean-400 flex items-center justify-center">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-navy-800">Mode présentation</p>
              <p className="text-[10px] text-mist-400">Accès rapide à la démo</p>
            </div>
          </div>
          <button onClick={() => setPresentation(false)} className="btn-ghost p-1.5">
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={() => go(a.page, a.param)}
              className="flex flex-col items-start gap-1 rounded-xl p-2.5 bg-mist-50 hover:bg-ocean-50 transition text-left group"
            >
              <div className="h-8 w-8 rounded-lg bg-white text-navy-700 group-hover:text-ocean-600 flex items-center justify-center transition">
                {a.icon}
              </div>
              <span className="text-xs font-semibold text-navy-800 leading-tight">{a.label}</span>
              <span className="text-[10px] text-mist-400 leading-tight">{a.desc}</span>
            </button>
          ))}
        </div>

        <button onClick={() => go('home')} className="btn-navy w-full mt-3 text-sm py-2.5">
          <Home size={15} /> Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
