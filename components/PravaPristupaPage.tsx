import React, { useState, useMemo, useEffect } from 'react';
import PravaPristupaBreadcrumbs from './PravaPristupaBreadcrumbs';
import Toolbar from './Toolbar';
import { EditIcon, RefreshIcon, ExcelIcon } from '../constants';
import type { Operator, Korisnik, PravaPristupa } from '../types';
import OdabirKorisnikaModal from './OdabirKorisnikaModal';

interface PravaPristupaPageProps {
  operators: Operator[];
  korisnici: Korisnik[];
  pravaPristupa: PravaPristupa;
  onSave: (operatorId: string, korisnikIds: string[]) => void;
  showToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

const PravaPristupaPage: React.FC<PravaPristupaPageProps> = ({ operators, korisnici, pravaPristupa, onSave, showToast }) => {
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(operators.length > 0 ? operators[0] : null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operatorFilters, setOperatorFilters] = useState({ ime: '', prezime: '', korisnickoIme: '' });

  const vezaniKorisnici = useMemo(() => {
    if (!selectedOperator) return [];
    const vezaniIds = pravaPristupa[selectedOperator.id] || [];
    return korisnici.filter(k => vezaniIds.includes(k.id));
  }, [selectedOperator, pravaPristupa, korisnici]);

  const handleSaveFromModal = (selectedKorisnici: Korisnik[]) => {
    if (selectedOperator) {
      const selectedIds = selectedKorisnici.map(k => k.id);
      onSave(selectedOperator.id, selectedIds);
      showToast('Prava pristupa su uspješno spremljena.', 'success');
    }
    setIsModalOpen(false);
  };

  const toolbarActions = [
    { label: 'Promjena', icon: <EditIcon />, onClick: () => { if (selectedOperator) setIsModalOpen(true); } },
    { label: 'Osvježi', icon: <RefreshIcon /> },
    { label: 'Preuzmi u Excel-u', icon: <ExcelIcon /> },
  ];

  const filteredOperators = useMemo(() => {
    return operators.filter(op =>
      op.ime.toLowerCase().includes(operatorFilters.ime.toLowerCase()) &&
      op.prezime.toLowerCase().includes(operatorFilters.prezime.toLowerCase()) &&
      op.korisnickoIme.toLowerCase().includes(operatorFilters.korisnickoIme.toLowerCase())
    );
  }, [operators, operatorFilters]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOperatorFilters(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (selectedOperator && !operators.some(op => op.id === selectedOperator.id)) {
        setSelectedOperator(operators.length > 0 ? operators[0] : null);
    } else if (!selectedOperator && operators.length > 0) {
        setSelectedOperator(operators[0]);
    }
  }, [operators, selectedOperator]);

  return (
    <>
      <PravaPristupaBreadcrumbs />
      <div className="flex flex-col flex-1 mt-2 space-y-3 overflow-hidden">
        
        {/* Top Panel: Operators */}
        <div className="flex-[1_1_40%] flex flex-col min-h-0 bg-white border border-gray-200 shadow-sm">
          <h3 className="p-2 border-b font-semibold text-gray-700 bg-gray-50 flex-shrink-0">Operateri</h3>
          <div className="overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-600 text-white z-10">
                <tr>
                  <th className="p-2 font-semibold">Ime</th>
                  <th className="p-2 font-semibold">Prezime</th>
                  <th className="p-2 font-semibold">Korisničko ime</th>
                </tr>
                 <tr className="bg-gray-100">
                    <td className="p-1"><input type="text" name="ime" value={operatorFilters.ime} onChange={handleFilterChange} className="w-full text-xs p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white" aria-label="Filter by Ime"/></td>
                    <td className="p-1"><input type="text" name="prezime" value={operatorFilters.prezime} onChange={handleFilterChange} className="w-full text-xs p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white" aria-label="Filter by Prezime"/></td>
                    <td className="p-1"><input type="text" name="korisnickoIme" value={operatorFilters.korisnickoIme} onChange={handleFilterChange} className="w-full text-xs p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white" aria-label="Filter by Korisničko ime"/></td>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOperators.map(op => (
                  <tr key={op.id} onClick={() => setSelectedOperator(op)} className={`cursor-pointer hover:bg-blue-100 ${selectedOperator?.id === op.id ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}>
                    <td className="p-2">{op.ime}</td>
                    <td className="p-2">{op.prezime}</td>
                    <td className="p-2">{op.korisnickoIme}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Bottom Panel: Vezani Korisnici */}
        <div className="flex-[1_1_60%] flex flex-col min-h-0 bg-white border border-gray-200 shadow-sm">
          <Toolbar actions={toolbarActions} />
          <h3 className="p-2 border-b font-semibold text-gray-700 bg-gray-50 flex-shrink-0">Vezani korisnici</h3>
           <div className="overflow-y-auto">
             <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-600 text-white z-10">
                <tr>
                  <th className="p-2 font-semibold w-24">Šifra</th>
                  <th className="p-2 font-semibold">Naziv</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vezaniKorisnici.map(k => (
                  <tr key={k.id}>
                    <td className="p-2">{k.sifra}</td>
                    <td className="p-2">{k.naziv}</td>
                  </tr>
                ))}
                 {vezaniKorisnici.length === 0 && (
                    <tr>
                        <td colSpan={2} className="text-center p-4 text-gray-500">
                            {selectedOperator ? 'Nema vezanih korisnika.' : 'Odaberite operatera za prikaz vezanih korisnika.'}
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {isModalOpen && selectedOperator && (
        <OdabirKorisnikaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleSaveFromModal}
          sviKorisnici={korisnici}
          initiallySelectedKorisnici={vezaniKorisnici}
        />
      )}
    </>
  );
};

export default PravaPristupaPage;
