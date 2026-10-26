import { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Anchor } from 'lucide-react';
import { useNav } from '../nav';
import { Logo } from '../components/Logo';
import { Banner } from '../components/ui';

export function LoginPage() {
  const { go } = useNav();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Veuillez renseigner tous les champs.');
      return;
    }
    // Simulation : pas de véritable authentification
    setError('');
    go('owner-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-800 via-navy-700 to-ocean-600 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <button onClick={() => go('home')} className="inline-flex">
            <Logo light size="lg" />
          </button>
        </div>

        <div className="card p-8 animate-scaleIn">
          <div className="text-center mb-6">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-ocean-50 flex items-center justify-center mb-3">
              <Anchor size={28} className="text-ocean-500" />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-navy-800">Connexion (démo)</h1>
            <p className="text-sm text-navy-600 mt-1">Espace loueur de démonstration — aucune authentification réelle.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label text-sm">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-9"
                  placeholder="demo@portnautic.fr"
                />
              </div>
            </div>
            <div>
              <label className="label text-sm">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-9"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-sm text-rose-500">{error}</p>}

            <button type="submit" className="btn-primary w-full text-base py-3.5">
              Se connecter <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-5">
            <Banner>Connexion fictive. Aucun compte n'est réellement créé ni vérifié. Vous accéderez à l'espace loueur de démonstration.</Banner>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-mist-400">
            <ShieldCheck size={14} className="text-ocean-500" />
            Démonstration Port Nautic Service
          </div>
        </div>

        <button onClick={() => go('home')} className="w-full text-center text-sm text-white/70 hover:text-white mt-5 transition">
          ← Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
