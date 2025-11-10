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
  disabled?: boolean;
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

export interface Korisnik {
  id: string;
  sifra: string;
  naziv: string;
}

export interface Operator {
  id: string;
  ime: string;
  prezime: string;
  korisnickoIme: string;
  lozinka: string;
}

export type PravaPristupa = {
  [operatorId: string]: string[]; // An object where keys are operator IDs and values are arrays of user IDs
};