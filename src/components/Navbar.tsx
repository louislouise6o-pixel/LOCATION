import { useState } from 'react';
import { Menu, X, Search, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';
import { useNav } from '../nav';
import type { PageId } from '../types';

interface NavItem {
  label: string;
  page: PageId;
}

const items: NavItem[] = [
  { label: 'Explorer les bateaux', page: 'catalog' },
  { label: 'Comment ça marche', page: 'how-it-works' },
  { label: 'Devenir loueur', page: 'renter-onboarding' },
];

export function Navbar() {
  const { go, page, presentation, setPresentation } = useNav();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (p: PageId) => page === p;

  const navTo = (p: PageId, param?: string) => {
    go(p, param);
    setMobileOpen(false);
    setMoreOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-nav border-b border-navy-50">
      <div className="container-app">
        <div className="flex h-16 lg:h-18 items-center justify-between gap-4">
          <button onClick={() => navTo('home')} className="shrink-0 hover:opacity-90 transition">
            <Logo />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {items.map((it) => (
              <button
                key={it.page}
                onClick={() => navTo(it.page)}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive(it.page) ? 'text-ocean-600 bg-ocean-50' : 'text-navy-600 hover:text-navy-800 hover:bg-mist-100'
                }`}
              >
                {it.label}
              </button>
            ))}
            <div className="relative">
              <button
                onClick={() => setMoreOpen((v) => !v)}
                onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                className="px-3.5 py-2 rounded-lg text-sm font-semibold text-navy-600 hover:text-navy-800 hover:bg-mist-100 transition flex items-center gap-1"
              >
                Plus <ChevronDown size={14} className={`transition ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-64 card animate-scaleIn py-2">
                  <MoreLink page="commission" label="Simulateur économique" desc="Estimation des revenus" onClick={navTo} />
                  <MoreLink page="owner-dashboard" label="Espace loueur" desc="Tableau de bord loueur" onClick={navTo} />
                  <MoreLink page="rental-flow" label="Déroulement d'une location" desc="Simulation du parcours" onClick={navTo} />
                  <MoreLink page="admin" label="Administration" desc="Gestion de la plateforme" onClick={navTo} />
                  <MoreLink page="project" label="Le projet" desc="Concept et lancement" onClick={navTo} />
                </div>
              )}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPresentation(!presentation)}
              className={`hidden md:inline-flex btn text-sm px-3 py-2 transition ${
                presentation ? 'bg-ocean-400 text-white hover:bg-ocean-500' : 'text-navy-700 hover:bg-mist-100'
              }`}
              title="Mode présentation"
            >
              <LayoutDashboard size={16} />
              {presentation ? 'Quitter présentation' : 'Mode présentation'}
            </button>
            <button onClick={() => navTo('login')} className="hidden md:inline-flex btn-ghost text-sm">
              Se connecter
            </button>
            <button onClick={() => navTo('catalog')} className="hidden md:inline-flex btn-primary text-sm">
              <Search size={16} /> Trouver un bateau
            </button>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden btn-ghost p-2"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-navy-50 bg-white animate-fadeIn">
          <div className="container-app py-4 space-y-1">
            {items.map((it) => (
              <button
                key={it.page}
                onClick={() => navTo(it.page)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive(it.page) ? 'text-ocean-600 bg-ocean-50' : 'text-navy-700 hover:bg-mist-100'
                }`}
              >
                {it.label}
              </button>
            ))}
            <div className="border-t border-navy-50 my-2" />
            <MobileLink label="Simulateur économique" page="commission" onClick={navTo} />
            <MobileLink label="Espace loueur" page="owner-dashboard" onClick={navTo} />
            <MobileLink label="Déroulement d'une location" page="rental-flow" onClick={navTo} />
            <MobileLink label="Administration" page="admin" onClick={navTo} />
            <MobileLink label="Le projet" page="project" onClick={navTo} />
            <div className="border-t border-navy-50 my-2" />
            <button
              onClick={() => setPresentation(!presentation)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition ${
                presentation ? 'bg-ocean-400 text-white' : 'text-navy-700 hover:bg-mist-100'
              }`}
            >
              {presentation ? 'Quitter le mode présentation' : 'Mode présentation'}
            </button>
            <button onClick={() => navTo('login')} className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-navy-700 hover:bg-mist-100">
              Se connecter
            </button>
            <button onClick={() => navTo('catalog')} className="w-full btn-primary text-sm mt-2">
              <Search size={16} /> Trouver un bateau
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function MoreLink({
  page,
  label,
  desc,
  onClick,
}: {
  page: PageId;
  label: string;
  desc: string;
  onClick: (p: PageId) => void;
}) {
  return (
    <button onClick={() => onClick(page)} className="w-full text-left px-4 py-2.5 hover:bg-mist-100 transition">
      <div className="text-sm font-semibold text-navy-800">{label}</div>
      <div className="text-xs text-mist-400">{desc}</div>
    </button>
  );
}

function MobileLink({ label, page, onClick }: { label: string; page: PageId; onClick: (p: PageId) => void }) {
  return (
    <button onClick={() => onClick(page)} className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-navy-700 hover:bg-mist-100 transition">
      {label}
    </button>
  );
}
