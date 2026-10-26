import { Users, MapPin, Anchor, Star, Gauge, ShieldCheck, Waves } from 'lucide-react';
import type { Boat } from '../types';
import { useNav } from '../nav';
import { formatEuro, TYPE_LABELS, DURATION_LABELS } from '../lib';

export function BoatCard({ boat }: { boat: Boat }) {
  const { go } = useNav();
  const basePrice = boat.pricePerDuration['few-hours'] || boat.pricePerDuration['half-day'] || boat.pricePerDuration['full-day'];

  return (
    <article
      onClick={() => go('boat', boat.id)}
      className="card card-hover cursor-pointer flex flex-col group"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-mist-100">
        <img
          src={boat.images[0]}
          alt={boat.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="chip bg-white/90 text-navy-800 text-xs font-semibold backdrop-blur">
            <Anchor size={12} /> {TYPE_LABELS[boat.type]}
          </span>
          {boat.licenseRequired ? null : (
            <span className="chip bg-ocean-400 text-white text-xs font-semibold">
              <ShieldCheck size={12} /> Sans permis
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 chip bg-navy-800/85 text-white text-xs font-semibold backdrop-blur">
          <Star size={12} className="fill-amber-300 text-amber-300" />
          {boat.rating.toFixed(1)} <span className="opacity-70 font-normal">({boat.ratingCount})</span>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-900/70 to-transparent p-3">
          <span className="inline-flex items-center gap-1 text-xs text-white/90 font-medium">
            <MapPin size={11} /> {boat.location}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-display font-bold text-navy-800 text-lg leading-tight">{boat.name}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-mist-400">
            <span className="flex items-center gap-1">
              <Users size={13} /> {boat.capacity} pers.
            </span>
            <span className="flex items-center gap-1">
              <Gauge size={13} /> {boat.power}
            </span>
            <span className="flex items-center gap-1">
              <Waves size={13} /> {boat.length} m
            </span>
          </div>
        </div>

        <p className="text-sm text-navy-600 line-clamp-2">{boat.description}</p>

        <div className="flex items-center gap-1.5 flex-wrap mt-auto pt-2">
          {boat.durations.map((d) => (
            <span key={d} className="chip bg-mist-100 text-navy-700 text-xs">
              {DURATION_LABELS[d]}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-navy-50">
          <div>
            <span className="text-xs text-mist-400">À partir de</span>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-extrabold text-navy-800 text-xl">{formatEuro(basePrice)}</span>
            </div>
          </div>
          <span className="btn-primary text-sm px-4 py-2.5">Voir le bateau</span>
        </div>
      </div>
    </article>
  );
}
