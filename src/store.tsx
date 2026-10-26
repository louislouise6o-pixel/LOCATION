import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Boat, Reservation } from './types';
import { initialBoats, initialReservations } from './data';

const BOATS_KEY = 'pns_boats_v1';
const RES_KEY = 'pns_res_v1';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore
  }
  return fallback;
}

interface Store {
  boats: Boat[];
  setBoats: (b: Boat[]) => void;
  addBoat: (b: Boat) => void;
  updateBoat: (id: string, patch: Partial<Boat>) => void;
  deleteBoat: (id: string) => void;
  reservations: Reservation[];
  addReservation: (r: Reservation) => void;
  updateReservation: (id: string, patch: Partial<Reservation>) => void;
  resetDemo: () => void;
}

const StoreCtx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [boats, setBoatsState] = useState<Boat[]>(() => load(BOATS_KEY, initialBoats));
  const [reservations, setResState] = useState<Reservation[]>(() => load(RES_KEY, initialReservations));

  useEffect(() => {
    localStorage.setItem(BOATS_KEY, JSON.stringify(boats));
  }, [boats]);
  useEffect(() => {
    localStorage.setItem(RES_KEY, JSON.stringify(reservations));
  }, [reservations]);

  const setBoats = (b: Boat[]) => setBoatsState(b);
  const addBoat = (b: Boat) => setBoatsState((prev) => [b, ...prev]);
  const updateBoat = (id: string, patch: Partial<Boat>) =>
    setBoatsState((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const deleteBoat = (id: string) => setBoatsState((prev) => prev.filter((b) => b.id !== id));

  const addReservation = (r: Reservation) => setResState((prev) => [r, ...prev]);
  const updateReservation = (id: string, patch: Partial<Reservation>) =>
    setResState((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const resetDemo = () => {
    setBoatsState(initialBoats);
    setResState(initialReservations);
  };

  return (
    <StoreCtx.Provider
      value={{ boats, setBoats, addBoat, updateBoat, deleteBoat, reservations, addReservation, updateReservation, resetDemo }}
    >
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
