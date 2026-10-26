import type { BoatType, Duration, OwnerType } from './types';

export function formatEuro(n: number): string {
  return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}

export function formatEuroPrecise(n: number): string {
  return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function genResNumber(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `R-DEMO-${n}`;
}

export function genEndCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function minDateISO(): string {
  return todayISO();
}

export function addDays(dateISO: string, days: number): string {
  const d = new Date(dateISO + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatDateFR(dateISO: string): string {
  const d = new Date(dateISO + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateShort(dateISO: string): string {
  const d = new Date(dateISO + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const TYPE_LABELS: Record<BoatType, string> = {
  'no-license': 'Sans permis',
  motor: 'Moteur',
  'semi-rigid': 'Semi-rigide',
  sail: 'Voilier',
  premium: 'Premium',
};

export const OWNER_LABELS: Record<OwnerType, string> = {
  professional: 'Loueur professionnel',
  private: 'Propriétaire privé',
};

export const DURATION_LABELS: Record<Duration, string> = {
  'few-hours': 'Quelques heures',
  'half-day': 'Demi-journée',
  'full-day': 'Journée',
};

export const DURATION_HOURS: Record<Duration, number> = {
  'few-hours': 4,
  'half-day': 6,
  'full-day': 8,
};

export const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  accepted: 'Acceptée',
  declined: 'Refusée',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

export const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  declined: 'bg-rose-100 text-rose-800',
  completed: 'bg-navy-100 text-navy-800',
  cancelled: 'bg-mist-200 text-mist-400',
};
