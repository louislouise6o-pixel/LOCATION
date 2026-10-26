import { useState } from 'react';
import { Anchor, Calendar, CheckCircle2, AlertTriangle, KeyRound, Star, MessageSquare, ArrowRight, ShieldAlert } from 'lucide-react';
import { useStore } from '../store';
import { useNav } from '../nav';
import { PageHeader, Banner } from '../components/ui';
import { formatDateFR, DURATION_LABELS, STATUS_LABELS } from '../lib';

export function RentalFlowPage() {
  const { reservations, updateReservation } = useStore();
  const { go } = useNav();

  const acceptedOrAfter = reservations.filter((r) => r.status === 'accepted' || r.status === 'completed');
  const [selectedId, setSelectedId] = useState<string>(acceptedOrAfter[0]?.id || '');
  const [endCodeInput, setEndCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [showProblem, setShowProblem] = useState(false);

  const selected = reservations.find((r) => r.id === selectedId);

  const submitEndCode = () => {
    if (!selected) return;
    if (endCodeInput !== selected.endCode) {
      setCodeError('Code incorrect. Le code de démonstration est visible sur la réservation.');
      return;
    }
    setCodeError('');
    updateReservation(selected.id, { status: 'completed' });
  };

  const submitReview = () => {
    if (!selected) return;
    updateReservation(selected.id, { reviewSubmitted: true });
    setShowReview(false);
    setReviewText('');
  };

  const submitProblem = () => {
    if (!selected) return;
    updateReservation(selected.id, { problemReported: true });
    setShowProblem(false);
  };

  return (
    <div className="bg-mist-100 min-h-screen">
      <div className="container-app py-10">
        <PageHeader
          eyebrow="Simulation"
          title="Déroulement d'une location"
          subtitle="Illustre le parcours prévu d'une location, de la confirmation à la fin. Toutes les données sont fictives."
        />

        <div className="mb-8">
          <Banner>
            <strong>Important :</strong> le code de fin de location ne constitue pas une preuve suffisante de l'absence de dommages et ne remplace pas les procédures contractuelles.
          </Banner>
        </div>

        {acceptedOrAfter.length === 0 ? (
          <div className="card p-8 text-center">
            <AlertTriangle size={32} className="mx-auto text-amber-500" />
            <h3 className="font-display font-bold text-lg text-navy-800 mt-3">Aucune réservation acceptée</h3>
            <p className="text-navy-600 mt-1 text-sm">Acceptez une réservation dans l'espace loueur pour simuler le déroulement.</p>
            <button onClick={() => go('owner-requests')} className="btn-primary mt-4">Aller aux demandes <ArrowRight size={16} /></button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[320px_1fr] gap-6">
            {/* Reservation selector */}
            <aside>
              <h2 className="label">Réservations à simuler</h2>
              <div className="space-y-2">
                {acceptedOrAfter.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelectedId(r.id);
                      setEndCodeInput('');
                      setCodeError('');
                      setShowReview(false);
                      setShowProblem(false);
                    }}
                    className={`w-full text-left card p-3 transition ${selectedId === r.id ? 'ring-2 ring-ocean-400' : 'hover:shadow-cardHover'}`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={r.boatImage} alt="" className="h-12 w-16 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-navy-800 truncate">{r.boatName}</p>
                        <p className="text-xs text-navy-600">{formatDateFR(r.date)}</p>
                        <span className={`chip text-[10px] mt-1 ${r.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                          {STATUS_LABELS[r.status]}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* Flow steps */}
            <div className="space-y-5">
              {selected && (
                <>
                  {/* Step 1: confirmed */}
                  <FlowStep
                    n={1}
                    icon={<CheckCircle2 size={20} />}
                    title="Réservation confirmée par le loueur"
                    done={true}
                  >
                    <p className="text-sm text-navy-600">
                      La réservation <strong>{selected.id}</strong> pour <strong>{selected.boatName}</strong> a été confirmée.
                      Le client {selected.clientFirstName} {selected.clientName} est attendu le {formatDateFR(selected.date)} à {selected.startTime} pour une {DURATION_LABELS[selected.duration]} avec {selected.guests} personnes.
                    </p>
                  </FlowStep>

                  {/* Step 2: in progress */}
                  <FlowStep
                    n={2}
                    icon={<Anchor size={20} />}
                    title="Location en cours"
                    done={selected.status === 'completed'}
                  >
                    <p className="text-sm text-navy-600">
                      Le client embarque, le loueur effectue le briefing de sécurité. La sortie se déroule selon les conditions convenues.
                    </p>
                  </FlowStep>

                  {/* Step 3: end code */}
                  <FlowStep
                    n={3}
                    icon={<KeyRound size={20} />}
                    title="Fin de location — saisie du code"
                    done={selected.status === 'completed'}
                  >
                    {selected.status === 'completed' ? (
                      <p className="text-sm text-emerald-700 font-medium">Location marquée comme terminée.</p>
                    ) : (
                      <div>
                        <p className="text-sm text-navy-600 mb-3">
                          Saisissez le code de fin de location pour signaler la fin. Code de démonstration : <strong className="font-display text-navy-800">{selected.endCode}</strong>
                        </p>
                        <div className="flex gap-2 max-w-xs">
                          <input
                            value={endCodeInput}
                            onChange={(e) => setEndCodeInput(e.target.value)}
                            className="input py-2.5 text-sm"
                            placeholder="Code à 4 chiffres"
                            maxLength={4}
                          />
                          <button onClick={submitEndCode} className="btn-primary shrink-0 text-sm">
                            Valider
                          </button>
                        </div>
                        {codeError && <p className="text-xs text-rose-500 mt-1.5">{codeError}</p>}
                      </div>
                    )}
                  </FlowStep>

                  {/* Step 4: review or problem */}
                  <FlowStep
                    n={4}
                    icon={<Star size={20} />}
                    title="Avis ou signalement"
                    done={selected.reviewSubmitted || selected.problemReported}
                  >
                    {selected.status !== 'completed' ? (
                      <p className="text-sm text-mist-400">Terminez d'abord la location (étape 3).</p>
                    ) : selected.reviewSubmitted ? (
                      <p className="text-sm text-emerald-700 font-medium">Avis de démonstration envoyé.</p>
                    ) : selected.problemReported ? (
                      <p className="text-sm text-amber-700 font-medium">Problème signalé. Le loueur doit le traiter.</p>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-navy-600">Le client confirme le déroulement et laisse un avis, ou signale un problème.</p>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => { setShowReview(true); setShowProblem(false); }} className="btn-outline text-sm">
                            <Star size={15} /> Laisser un avis
                          </button>
                          <button onClick={() => { setShowProblem(true); setShowReview(false); }} className="btn-outline text-sm text-amber-700 border-amber-200 hover:bg-amber-50">
                            <AlertTriangle size={15} /> Signaler un problème
                          </button>
                        </div>

                        {showReview && (
                          <div className="rounded-xl bg-mist-50 p-4 animate-fadeIn">
                            <label className="label text-sm">Avis de démonstration</label>
                            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={3} className="input resize-none text-sm" placeholder="Très belle sortie..." />
                            <button onClick={submitReview} className="btn-primary text-sm mt-2">
                              <MessageSquare size={15} /> Envoyer l'avis
                            </button>
                          </div>
                        )}

                        {showProblem && (
                          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 animate-fadeIn">
                            <p className="text-sm text-amber-800 mb-2">Signaler un problème au loueur (démonstration).</p>
                            <button onClick={submitProblem} className="btn text-sm bg-amber-500 text-white hover:bg-amber-600 px-4 py-2 rounded-xl">
                              Confirmer le signalement
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </FlowStep>

                  {/* Step 5: final status */}
                  <FlowStep
                    n={5}
                    icon={<ShieldAlert size={20} />}
                    title="Statut final"
                    done={selected.reviewSubmitted || selected.problemReported}
                  >
                    <p className="text-sm text-navy-600">
                      Statut actuel : <strong className={selected.problemReported ? 'text-amber-700' : 'text-emerald-700'}>
                        {selected.problemReported ? 'Problème à traiter' : selected.reviewSubmitted ? 'Terminée avec avis' : 'Terminée'}
                      </strong>
                    </p>
                  </FlowStep>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FlowStep({ n, icon, title, done, children }: { n: number; icon: React.ReactNode; title: string; done: boolean; children: React.ReactNode }) {
  return (
    <div className={`card p-5 ${done ? 'border-l-4 border-l-emerald-400' : 'border-l-4 border-l-navy-100'}`}>
      <div className="flex items-start gap-3">
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${done ? 'bg-emerald-100 text-emerald-600' : 'bg-navy-50 text-navy-600'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-navy-800 flex items-center gap-2">
            <span className="text-xs font-bold text-mist-400">Étape {n}</span>
            {title}
          </h3>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
