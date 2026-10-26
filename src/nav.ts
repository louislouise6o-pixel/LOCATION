import { createContext, useContext } from 'react';
import type { PageId } from './types';

interface Nav {
  page: PageId;
  param?: string;
  go: (page: PageId, param?: string) => void;
  presentation: boolean;
  setPresentation: (v: boolean) => void;
}

export const NavCtx = createContext<Nav | null>(null);

export function useNav() {
  const ctx = useContext(NavCtx);
  if (!ctx) throw new Error('useNav must be used within NavCtx');
  return ctx;
}
