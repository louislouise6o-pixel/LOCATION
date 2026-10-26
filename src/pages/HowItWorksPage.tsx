import {
  Search, Calendar, Anchor, ShieldCheck, LifeBuoy,
  Wallet, ArrowRight, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { useNav } from '../nav';
import { PageHeader, Banner } from '../components/ui';

export function HowItWorksPage() {
  const { go } = useNav();
  return (
    <div className="bg-mist-100 min-h-screen">
      <div className="container-app py-10">
        <PageHeader
          eyebrow="Parcours"
          title="Comment ça marche ?"
          subtitle="Du premier clic à la fin de la sortie, découvrez le déroulement prévu d'une location sur Port Nautic Service."
        />

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          <Step n={1} icon={<Search size={24} />} title="Trouvez votre bateau"
            desc="Filtrez par type, prix, capacité et permis. Chaque fiche détaille les équipements, la caution et les conditions." />
          <Step n={2} icon={<Calendar size={24} />} title="Réservez votre créneau"
            desc="Choisissez date, heure et durée. Le total détaillé (location + frais de service) est calculé immédiatement." />
          <Step n={3} icon={<Anchor size={24} />} title="Embarquez en mer"
            desc="Présentez-vous au port. Le loueur vous briefe, vous confie le bateau, et votre sortie peut commencer." />
        </div>

        {/* Detailed flow */}
        <section className="card p-8 mb-8">
          <h2 className="font-display font-bold text-2xl text-navy-800 mb-6">Le déroulement d'une location</h2>
          <ol className="space-y-5">
            <FlowItem n={1} title="Le client effectue une demande ou une réservation">
              Le client sélectionne un bateau, choisit ses dates et valide la simulation. Une demande est créée et visible par le loueur.
            </FlowItem>
            <FlowItem n={2} title="Le loueur confirme la disponibilité (si nécessaire)">
              Le loueur peut accepter, refuser ou demander un ajustement depuis son espace de gestion.
            </FlowItem>
            <FlowItem n={3} title="La location est effectuée">
              Le client se présente au port, le loueur effectue le briefing de sécurité et confie le bateau.
            </FlowItem>
            <FlowItem n={4} title="Un code fictif marque la fin de la location">
              Un code à 4 chiffres est généré pour la démo. Il permet de signaler la fin — <strong>sans constituer une preuve suffisante de l'absence de dommages</strong>.
            </FlowItem>
            <FlowItem n={5} title="Le client confirme et laisse un avis de démonstration">
              Le client peut confirmer le bon déroulement, laisser un avis fictif, ou signaler un problème.
            </FlowItem>
            <FlowItem n={6} title="La plateforme affiche le statut final">
              La réservation passe en statut « Terminée » ou signale un problème à traiter par le loueur.
            </FlowItem>
          </ol>
        </section>

        <div className="mb-10">
          <Banner>
            <strong>Important :</strong> le code de fin de location ne remplace pas les procédures contractuelles. Aucun système de versement ou de retenue de fonds n'est mis en place dans cette démonstration.
          </Banner>
        </div>

        {/* Trust */}
        <section className="grid sm:grid-cols-3 gap-5 mb-10">
          <MiniCard icon={<ShieldCheck size={22} />} title="Sécurité"
            desc="Briefings de sécurité et vérification des loueurs avant publication." />
          <MiniCard icon={<LifeBuoy size={22} />} title="Accompagnement"
            desc="Espace de gestion dédié aux échanges entre client et loueur." />
          <MiniCard icon={<Wallet size={22} />} title="Transparence"
            desc="Prix de location et frais de service affichés clairement à chaque étape." />
        </section>

        <div className="text-center">
          <button onClick={() => go('rental-flow')} className="btn-primary text-base">
            Voir la simulation du déroulement <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Step({ n, icon, title, desc }: { n: number; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card p-6 relative">
      <div className="absolute -top-4 -left-4 h-12 w-12 rounded-2xl bg-navy-800 text-white flex items-center justify-center font-display font-extrabold text-lg shadow-card">
        {n}
      </div>
      <div className="mt-4 h-12 w-12 rounded-xl bg-ocean-50 text-ocean-500 flex items-center justify-center">{icon}</div>
      <h3 className="mt-4 font-display font-bold text-lg text-navy-800">{title}</h3>
      <p className="mt-1.5 text-sm text-navy-600">{desc}</p>
    </div>
  );
}

function FlowItem({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <div className="h-9 w-9 rounded-full bg-ocean-100 text-ocean-600 flex items-center justify-center font-display font-bold text-sm shrink-0">
        {n}
      </div>
      <div>
        <h3 className="font-display font-bold text-navy-800">{title}</h3>
        <p className="text-sm text-navy-600 mt-1">{children}</p>
      </div>
    </li>
  );
}

function MiniCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card p-5">
      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-navy-700 to-navy-800 text-ocean-300 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-3 font-display font-bold text-navy-800">{title}</h3>
      <p className="text-sm text-navy-600 mt-1">{desc}</p>
    </div>
  );
}
