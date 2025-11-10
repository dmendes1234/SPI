import React, { useState, useMemo, useEffect } from 'react';
import KorisniciBreadcrumbs from './KorisniciBreadcrumbs';
import Toolbar from './Toolbar';
import { NewIcon, EditIcon, DeleteIcon, RefreshIcon, ExcelIcon } from '../constants';
import type { Korisnik } from '../types';
import KorisnikModal from './KorisnikModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface KatalogKorisnikaPageProps {
  korisnici: Korisnik[];
  onAddKorisnik: (korisnik: Omit<Korisnik, 'id'>) => void;
  onUpdateKorisnik: (korisnik: Korisnik) => void;
  onDeleteKorisnik: (korisnikId: string) => void;
}

const KatalogKorisnikaPage: React.FC<KatalogKorisnikaPageProps> = ({ korisnici, onAddKorisnik, onUpdateKorisnik, onDeleteKorisnik }) => {
  const [selectedKorisnik, setSelectedKorisnik] = useState<Korisnik | null>(korisnici.length > 0 ? korisnici[0] : null);
  const [filters, setFilters] = useState({ sifra: '', naziv: '' });
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (selectedKorisnik) {
        const freshSelectedKorisnik = korisnici.find(k => k.id === selectedKorisnik.id);
        setSelectedKorisnik(freshSelectedKorisnik || (korisnici.length > 0 ? korisnici[0] : null));
    } else if (korisnici.length > 0 && !selectedKorisnik) {
        setSelectedKorisnik(korisnici[0]);
    }
  }, [korisnici]);

  const filteredKorisnici = useMemo(() => {
    return korisnici.filter(k =>
      k.sifra.toLowerCase().includes(filters.sifra.toLowerCase()) &&
      k.naziv.toLowerCase().includes(filters.naziv.toLowerCase())
    );
  }, [korisnici, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDelete = () => {
    if (selectedKorisnik) {
      onDeleteKorisnik(selectedKorisnik.id);
      setIsDeleteModalOpen(false);
    }
  };
  
  const toolbarActions = [
    { label: 'Novi', icon: <NewIcon />, onClick: () => setIsNewModalOpen(true) },
    { label: 'Promjena', icon: <EditIcon />, onClick: () => { if (selectedKorisnik) setIsEditModalOpen(true) } },
    { label: 'Brisanje', icon: <DeleteIcon />, onClick: () => { if (selectedKorisnik) setIsDeleteModalOpen(true) } },
    { label: 'Osvježi', icon: <RefreshIcon /> },
    { label: 'Preuzmi u Excel-u', icon: <ExcelIcon /> },
  ];

  return (
    <>
      <KorisniciBreadcrumbs />
      <div className="flex flex-col flex-1 mt-2">
        <Toolbar actions={toolbarActions} />
        <div className="flex-1 overflow-y-auto bg-white border border-gray-200 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-600 text-white z-10">
              <tr>
                <th className="p-2 font-semibold w-24">Šifra</th>
                <th className="p-2 font-semibold">Naziv</th>
              </tr>
              <tr className="bg-gray-100">
                <td className="p-1"><input type="text" name="sifra" value={filters.sifra} onChange={handleFilterChange} className="w-full text-xs p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white" aria-label="Filter by Šifra"/></td>
                <td className="p-1"><input type="text" name="naziv" value={filters.naziv} onChange={handleFilterChange} className="w-full text-xs p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white" aria-label="Filter by Naziv"/></td>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredKorisnici.map(k => (
                <tr
                  key={k.id}
                  onClick={() => setSelectedKorisnik(k)}
                  className={`cursor-pointer hover:bg-blue-100 ${selectedKorisnik?.id === k.id ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  <td className="p-2">{k.sifra}</td>
                  <td className="p-2">{k.naziv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {isNewModalOpen && (
        <KorisnikModal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          onSave={onAddKorisnik}
        />
      )}
      
      {isEditModalOpen && selectedKorisnik && (
        <KorisnikModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={onUpdateKorisnik}
          korisnikToEdit={selectedKorisnik}
        />
      )}
      
      {isDeleteModalOpen && selectedKorisnik && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          itemName={selectedKorisnik.naziv}
          itemType="korisnika"
        />
      )}
    </>
  );
};

export default KatalogKorisnikaPage;