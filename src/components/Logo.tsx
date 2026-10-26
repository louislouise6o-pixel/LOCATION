import { Anchor } from 'lucide-react';

export function Logo({ light = false, size = 'md' }: { light?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  const text = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';
  const icon = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${dims} rounded-xl flex items-center justify-center shadow-sm ${light ? 'bg-white/15 backdrop-blur' : 'bg-gradient-to-br from-navy-700 to-navy-800'}`}
      >
        <Anchor size={icon} className={light ? 'text-white' : 'text-ocean-400'} strokeWidth={2.2} />
      </div>
      <div className={`font-display font-extrabold ${text} leading-none ${light ? 'text-white' : 'text-navy-800'}`}>
        Port Nautic
        <span className={`block ${size === 'sm' ? 'text-[10px]' : 'text-xs'} font-semibold tracking-wider ${light ? 'text-ocean-200' : 'text-ocean-400'}`}>
          SERVICE
        </span>
      </div>
    </div>
  );
}
