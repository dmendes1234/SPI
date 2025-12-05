
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

// New Types for Katalog posebnih događaja
export interface Dogadjaj {
  id: string;
  sifra: string;
  naziv: string;
  aktivnost: boolean;
  aktivnostOd: string | null;
}

export interface VrstaDokumenta {
  id: string;
  sifra: string;
  naziv: string;
}

export interface Pozicija {
  id: string;
  sifra: string;
  naziv: string;
}

export interface StavkaKontiranja {
  id: string;
  rbr: number;
  dogadjajId: string;
  vrstaDokumentaId: string;
  pozicijaId: string | null; // ID of the referenced Pozicija
  racun: string;
  racunNaziv: string;
  strana: 'D' | 'P';
  postotak: number;
  storno: boolean;
  prijepis: string[]; // List of checked values e.g. ['Organizacijska', 'Odjel']
  glavnaKnjiga: 'NP' | 'PK'; // 'NP' = Glavna knjiga proračuna, 'PK' = Glavna knjiga proračunskih korisnika
}