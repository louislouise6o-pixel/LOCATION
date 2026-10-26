import { Target, AlertTriangle, ListChecks, BadgeEuro, MapPin, ArrowRight, Lightbulb } from 'lucide-react';
import { useNav } from '../nav';
import { PageHeader, Banner } from '../components/ui';

export function ProjectPage() {
  const { go } = useNav();
  return (
    <div className="bg-mist-100 min-h-screen">
      <div className="container-app py-10 max-w-4xl">
        <PageHeader
          eyebrow="Le projet"
          title="Port Nautic Service : la plateforme de location de bateaux au Cap d'Agde"
          subtitle="Une démonstration de concept présentée au dirigeant, pour évaluer la pertinence du projet avant une éventuelle mise en production."
        />

        <div className="space-y-6">
          <Section icon={<Target size={22} />} title="Le concept">
            Une marketplace spécialisée dans la location de bateaux, reliant des clients à des loueurs professionnels et des propriétaires privés. Inspirée de la simplicité d'Airbnb, dédiée au nautique, et lancée au Cap d'Agde.
          </Section>

          <Section icon={<AlertTriangle size={22} />} title="Le problème auquel il répond">
            Trouver un bateau à louer reste souvent une démarche dispersée : appels, contacts directs, peu de visibilité sur les disponibilités et les prix. Port Nautic Service centralise l'offre et la rend lisible, filtrable et réservable.
          </Section>

          <Section icon={<ListChecks size={22} />} title="Le fonctionnement prévu">
            Le client recherche, compare et simule une réservation. Le loueur gère ses annonces et ses demandes depuis un tableau de bord. La plateforme perçoit des frais de service sur chaque location. Le déroulement suit un parcours encadré, du premier contact à la fin de la sortie.
          </Section>

          <Section icon={<BadgeEuro size={22} />} title="Le modèle économique envisagé">
            Des frais de service sont ajoutés au prix de location, payés par le client. Hypothèse de départ : 15%. Ce montant constitue un chiffre d'affaires brut potentiel — les frais de paiement, remboursements, charges et taxes ne sont pas déduits.
          </Section>

          <Section icon={<MapPin size={22} />} title="Le lancement local au Cap d'Agde">
            Le Cap d'Agde offre une base de départ idéale : port de plaisance, fréquentation estivale, diversité de bateaux. L'extension à d'autres ports et destinations est envisagée progressivement.
          </Section>

          <Section icon={<Lightbulb size={22} />} title="Les prochaines étapes">
            <ul className="list-disc list-inside space-y-1.5 mt-2">
              <li>Formaliser les conditions d'annulation et la convention loueur/client.</li>
              <li>Définir le processus de vérification des loueurs (identité, assurance, conformité).</li>
              <li>Mettre en place un paiement réel sécurisé (non inclus dans cette démo).</li>
              <li>Constituer un premier vivier de loueurs partenaires au Cap d'Agde.</li>
              <li>Valider le cadre juridique et fiscal applicable.</li>
            </ul>
          </Section>
        </div>

        <div className="mt-8">
          <Banner>
            Cette page décrit un projet. Port Nautic Service n'est présenté comme partenaire d'aucune entreprise réelle. Toutes les données affichées dans la plateforme sont fictives.
          </Banner>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => go('catalog')} className="btn-primary">Voir le catalogue <ArrowRight size={16} /></button>
          <button onClick={() => go('commission')} className="btn-outline"><BadgeEuro size={16} /> Simulateur économique</button>
          <button onClick={() => go('admin')} className="btn-outline">Espace administration</button>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-navy-700 to-navy-800 text-ocean-300 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="font-display font-bold text-xl text-navy-800">{title}</h2>
      </div>
      <div className="text-navy-700 leading-relaxed pl-14">{children}</div>
    </div>
  );
}
