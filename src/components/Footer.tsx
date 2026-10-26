import { Anchor, LifeBuoy, Shield, Mail, FileText, Lock } from 'lucide-react';
import { Logo } from './Logo';
import { useNav } from '../nav';
import type { PageId } from '../types';

export function Footer() {
  const { go } = useNav();

  const link = (label: string, page: PageId) => (
    <button onClick={() => go(page)} className="text-sm text-mist-400 hover:text-ocean-200 transition text-left">
      {label}
    </button>
  );

  return (
    <footer className="bg-navy-800 text-white">
      <div className="container-app py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo light />
            <p className="mt-4 text-sm text-mist-300 leading-relaxed">
              Plateforme de location de bateaux au Cap d'Agde. Démonstration de concept — aucune réservation réelle.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-ocean-200 mb-4">Présentation</h4>
            <ul className="space-y-2.5">
              <li>{link('Le projet', 'project')}</li>
              <li>{link('Comment ça marche', 'how-it-works')}</li>
              <li>{link('Simulateur économique', 'commission')}</li>
              <li>{link('Devenir loueur', 'renter-onboarding')}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-ocean-200 mb-4">Aide & contact</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-mist-300">
                <LifeBuoy size={15} /> Contact de démonstration (à finaliser)
              </li>
              <li className="flex items-center gap-2 text-sm text-mist-300">
                <Mail size={15} /> E-mail à définir
              </li>
              <li className="flex items-center gap-2 text-sm text-mist-300">
                <Shield size={15} /> Aide & FAQ (à constituer)
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-ocean-200 mb-4">Conditions</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-mist-300">
                <FileText size={15} /> Conditions générales (fictives, à finaliser)
              </li>
              <li className="flex items-center gap-2 text-sm text-mist-300">
                <Lock size={15} /> Confidentialité (fictive, à finaliser)
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-navy-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-mist-400">
            © {new Date().getFullYear()} Port Nautic Service — Démonstration de concept. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 rounded-full bg-amber-500/15 border border-amber-400/30 px-3.5 py-1.5">
            <Anchor size={13} className="text-amber-300" />
            <span className="text-xs font-semibold text-amber-200">
              Version de démonstration — réservations et paiements non réels
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
