import { Anchor, ShieldCheck, BadgeEuro, ListChecks, ArrowRight, Sparkles } from 'lucide-react';
import { useNav } from '../nav';
import { PageHeader, Banner } from '../components/ui';

export function RenterOnboardingPage() {
  const { go } = useNav();
  return (
    <div className="bg-mist-100 min-h-screen">
      <div className="container-app py-10">
        <PageHeader
          eyebrow="Espace loueur"
          title="Devenir loueur sur Port Nautic Service"
          subtitle="Loureurs professionnels ou propriétaires privés : découvrez comment proposer votre bateau et simuler vos revenus."
        />

        <div className="mb-8">
          <Banner>
            Les éléments ci-dessous décrivent le parcours prévu. Aucune annonce ne sera publiée publiquement comme une offre réelle tant que la vérification n'est pas formalisée.
          </Banner>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card icon={<ListChecks size={22} />} title="1. Créez votre annonce"
            desc="Nom, type, description, photos, prix, durées, équipements, caution. Vous gardez le contrôle sur votre bateau." />
          <Card icon={<ShieldCheck size={22} />} title="2. Vérification (à formaliser)"
            desc="Identité, autorisation de proposer le bateau, documents et assurance. La plateforme contrôle avant publication." />
          <Card icon={<Anchor size={22} />} title="3. Recevez les demandes"
            desc="Acceptez ou refusez les demandes de réservation depuis votre tableau de bord loueur." />
          <Card icon={<BadgeEuro size={22} />} title="4. Simulez vos revenus"
            desc="Estimez vos revenus potentiels avec le simulateur économique. Chiffre d'affaires brut, pas un bénéfice net." />
        </div>

        {/* Verification checklist */}
        <section className="card p-8 mb-10">
          <h2 className="font-display font-bold text-2xl text-navy-800 mb-2">Vérification prévue des loueurs</h2>
          <p className="text-navy-600 text-sm mb-6">Ces éléments restent à contrôler avant toute publication réelle. Ils ne sont pas vérifiés dans cette démonstration.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Identité du loueur',
              'Coordonnées professionnelles le cas échéant',
              'Autorisation de proposer le bateau',
              'Documents du bateau (immatriculation, jauge)',
              'Assurance appropriée à l\'activité',
              'Documents de sécurité et de conformité',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-navy-700">
                <Sparkles size={16} className="text-ocean-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => go('owner-dashboard')} className="btn-primary text-base">
            Accéder à l'espace loueur <ArrowRight size={18} />
          </button>
          <button onClick={() => go('commission')} className="btn-outline">
            <BadgeEuro size={18} /> Simuler mes revenus
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card p-6">
      <div className="h-12 w-12 rounded-xl bg-ocean-50 text-ocean-500 flex items-center justify-center">{icon}</div>
      <h3 className="mt-4 font-display font-bold text-lg text-navy-800">{title}</h3>
      <p className="mt-1.5 text-sm text-navy-600">{desc}</p>
    </div>
  );
}
