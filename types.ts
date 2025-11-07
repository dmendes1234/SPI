// Fix: Import React to provide types for React.ReactNode
import type React from 'react';

export interface AopItem {
  id: number;
  rbr: number;
  aop: string;
  opis: string;
}

export interface DependentAccount {
  id: string;
  konto: string;
  nazivKonta: string;
}

export interface ToolbarAction {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export interface RacunskiPlanItem {
  konto: string;
  opis: string;
}

export interface NavItem {
    label: string;
    page?: string;
    children?: NavItem[];
}

export interface Operator {
  id: string;
  ime: string;
  prezime: string;
  korisnickoIme: string;
  lozinka: string;
}
