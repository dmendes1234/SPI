
import React, { useState, useEffect } from 'react';
import { XIcon, CheckIcon, XCircleIcon } from '../constants';
import type { StavkaKontiranja, Pozicija, RacunskiPlanItem, VrstaDokumenta } from '../types';
import LookUpField from './LookUpField';
import GenericCrudModal from './GenericCrudModal';
import RacunskiPlanModal from './RacunskiPlanModal';
import { racunskiPlanData } from '../data/racunskiPlanData';

interface StavkaKontiranjaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Omit<StavkaKontiranja, 'id' | 'rbr'>) => void;
    onUpdate: (item: StavkaKontiranja) => void;
    itemToEdit: StavkaKontiranja | null;
    dogadjajId: string;
    vrsteDokumenata: VrstaDokumenta[]; 
    onAddVrstaDokumenta: (vd: Omit<VrstaDokumenta, 'id'>) => void;
    onUpdateVrstaDokumenta: (vd: VrstaDokumenta) => void;
    onDeleteVrstaDokumenta: (id: string) => void;
    pozicije: Pozicija[];
    onAddPozicija: (p: Omit<Pozicija, 'id'>) => void;
    onUpdatePozicija: (p: Pozicija) => void;
    onDeletePozicija: (id: string) => void;
    isViewMode?: boolean;
    isObjedinjenaGlavnaKnjigaEnabled: boolean;
}

const StavkaKontiranjaModal: React.FC<StavkaKontiranjaModalProps> = ({
    isOpen, onClose, onSave, onUpdate, itemToEdit, dogadjajId,
    vrsteDokumenata, onAddVrstaDokumenta, onUpdateVrstaDokumenta, onDeleteVrstaDokumenta,
    pozicije, onAddPozicija, onUpdatePozicija, onDeletePozicija, isViewMode = false,
    isObjedinjenaGlavnaKnjigaEnabled
}) => {
    const [selectedVrstaDokumenta, setSelectedVrstaDokumenta] = useState<VrstaDokumenta | null>(null);
    const [glavnaKnjiga, setGlavnaKnjiga] = useState<'NP' | 'PK'>('NP');
    const [selectedPozicija, setSelectedPozicija] = useState<Pozicija | null>(null);
    const [selectedRacun, setSelectedRacun] = useState<RacunskiPlanItem | null>(null);
    const [strana, setStrana] = useState<'D' | 'P'>('D');
    // Use string for postotak to allow "100,00" formatting in input
    const [postotakInput, setPostotakInput] = useState<string>('100,00');
    const [storno, setStorno] = useState(false);
    const [prijepis, setPrijepis] = useState<string[]>([]);
    const [validationError, setValidationError] = useState<string>('');
    
    const [isVrstaDokumentaModalOpen, setIsVrstaDokumentaModalOpen] = useState(false);
    const [isPozicijaModalOpen, setIsPozicijaModalOpen] = useState(false);
    const [isRacunModalOpen, setIsRacunModalOpen] = useState(false);

    const prijepisOptions = ['Organizacijska', 'Odjel', 'Program', 'Izvor', 'Korisnik', 'Lokacija', 'Funkcijska'];

    useEffect(() => {
        if (isOpen) {
            setValidationError('');
            if (itemToEdit) {
                setSelectedVrstaDokumenta(vrsteDokumenata.find(v => v.id === itemToEdit.vrstaDokumentaId) || null);
                setGlavnaKnjiga(itemToEdit.glavnaKnjiga || 'NP');
                setSelectedPozicija(pozicije.find(p => p.id === itemToEdit.pozicijaId) || null);
                const foundRacun = racunskiPlanData.find(r => r.konto === itemToEdit.racun);
                setSelectedRacun(foundRacun ? foundRacun : { konto: itemToEdit.racun, opis: itemToEdit.racunNaziv });
                setStrana(itemToEdit.strana);
                // Convert number to string with comma
                setPostotakInput(itemToEdit.postotak.toFixed(2).replace('.', ','));
                setStorno(itemToEdit.storno || false);
                setPrijepis(itemToEdit.prijepis);
            } else {
                setSelectedVrstaDokumenta(null);
                setGlavnaKnjiga('NP');
                setSelectedPozicija(null);
                setSelectedRacun(null);
                setStrana('D');
                setPostotakInput('100,00');
                setStorno(false);
                setPrijepis([]);
            }
        }
    }, [isOpen, itemToEdit, pozicije, vrsteDokumenata]);

    const handleSave = () => {
        if (isViewMode) return;
        setValidationError('');
        
        if (!selectedVrstaDokumenta) {
            alert('Vrsta dokumenta je obavezna!');
            return;
        }

        if (!selectedRacun) {
            alert('Račun je obavezan!');
            return;
        }

        // Parse percentage string back to number. Replace comma with dot.
        const parsedPostotak = parseFloat(postotakInput.replace(',', '.'));
        if (isNaN(parsedPostotak)) {
            setValidationError('Neispravan format.');
            return;
        }

        if (parsedPostotak < 1 || parsedPostotak > 100) {
             setValidationError('Vrijednost mora biti između 1,00 i 100,00');
             return;
        }

        const itemData = {
            dogadjajId,
            vrstaDokumentaId: selectedVrstaDokumenta.id,
            glavnaKnjiga,
            pozicijaId: selectedPozicija ? selectedPozicija.id : null,
            racun: selectedRacun.konto,
            racunNaziv: selectedRacun.opis,
            strana,
            postotak: parsedPostotak,
            storno,
            prijepis
        };

        if (itemToEdit) {
            onUpdate({ ...itemToEdit, ...itemData });
        } else {
            onSave(itemData);
        }
        onClose();
    };

    const handlePostotakChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValidationError('');
        // Allow digits and one comma
        if (/^[0-9]*\,?[0-9]*$/.test(val)) {
            setPostotakInput(val);
        }
    };

    const handleCheckboxChange = (option: string) => {
        if (isViewMode || !selectedPozicija) return;
        setPrijepis(prev => {
            if (prev.includes(option)) return prev.filter(o => o !== option);
            return [...prev, option];
        });
    };

    if (!isOpen) return null;

    let title = 'Nova stavka kontiranja događaja';
    if (isViewMode) title = 'Uvid stavke kontiranja događaja';
    else if (itemToEdit) title = 'Promjena stavke kontiranja događaja';

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                    <div className="bg-slate-700 text-white p-2 flex justify-between items-center rounded-t-lg">
                        <h3 className="text-sm font-semibold">{title}</h3>
                        <button onClick={onClose} className="text-white hover:text-gray-300"><XIcon className="h-5 w-5" /></button>
                    </div>
                    
                    <div className="p-6 space-y-4 overflow-y-auto">
                        {/* Vrsta Dokumenta */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vrsta dokumenta</label>
                            <LookUpField 
                                valueLeft={selectedVrstaDokumenta?.sifra || ''} 
                                valueRight={selectedVrstaDokumenta?.naziv || ''} 
                                onButtonClick={() => setIsVrstaDokumentaModalOpen(true)}
                                required={!isViewMode}
                                disabled={isViewMode}
                                className="w-full"
                                onClear={() => setSelectedVrstaDokumenta(null)}
                            />
                        </div>

                        {/* Glavna Knjiga */}
                        {isObjedinjenaGlavnaKnjigaEnabled && (
                            <div>
                                <span className="block text-sm font-medium text-gray-700 mb-1">Glavna knjiga</span>
                                <div className="flex flex-col space-y-2">
                                    <label className={`inline-flex items-center ${isViewMode ? 'cursor-not-allowed opacity-70' : ''}`}>
                                        <input 
                                            type="radio" 
                                            className="form-radio" 
                                            name="glavnaKnjiga" 
                                            value="NP" 
                                            checked={glavnaKnjiga === 'NP'} 
                                            onChange={() => setGlavnaKnjiga('NP')} 
                                            disabled={isViewMode} 
                                        />
                                        <span className="ml-2 text-sm">Glavna knjiga proračuna (NP)</span>
                                    </label>
                                    <label className={`inline-flex items-center ${isViewMode ? 'cursor-not-allowed opacity-70' : ''}`}>
                                        <input 
                                            type="radio" 
                                            className="form-radio" 
                                            name="glavnaKnjiga" 
                                            value="PK" 
                                            checked={glavnaKnjiga === 'PK'} 
                                            onChange={() => setGlavnaKnjiga('PK')} 
                                            disabled={isViewMode} 
                                        />
                                        <span className="ml-2 text-sm">Glavna knjiga proračunskih korisnika (PK)</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Pozicija */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pozicija</label>
                            <LookUpField 
                                valueLeft={selectedPozicija?.sifra || ''} 
                                valueRight={selectedPozicija?.naziv || ''} 
                                onButtonClick={() => setIsPozicijaModalOpen(true)}
                                disabled={isViewMode}
                                className="w-full"
                                onClear={() => setSelectedPozicija(null)}
                            />
                        </div>

                        {/* Račun */}
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Račun</label>
                             <LookUpField 
                                valueLeft={selectedRacun?.konto || ''} 
                                valueRight={selectedRacun?.opis || ''} 
                                onButtonClick={() => setIsRacunModalOpen(true)}
                                required={!isViewMode}
                                disabled={isViewMode}
                                className="w-full"
                                onClear={() => setSelectedRacun(null)}
                            />
                        </div>

                        {/* D/P */}
                        <div>
                            <span className="block text-sm font-medium text-gray-700 mb-1">D/P</span>
                            <div className="flex space-x-4">
                                <label className={`inline-flex items-center ${isViewMode ? 'cursor-not-allowed opacity-70' : ''}`}>
                                    <input type="radio" className="form-radio" name="strana" value="D" checked={strana === 'D'} onChange={() => setStrana('D')} disabled={isViewMode} />
                                    <span className="ml-2 text-sm">Duguje</span>
                                </label>
                                <label className={`inline-flex items-center ${isViewMode ? 'cursor-not-allowed opacity-70' : ''}`}>
                                    <input type="radio" className="form-radio" name="strana" value="P" checked={strana === 'P'} onChange={() => setStrana('P')} disabled={isViewMode} />
                                    <span className="ml-2 text-sm">Potražuje</span>
                                </label>
                            </div>
                        </div>

                         {/* Postotak */}
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Postotak iznosa</label>
                            <div className="flex items-center">
                                <input 
                                    type="text" 
                                    value={postotakInput}
                                    onChange={handlePostotakChange}
                                    className={`border border-gray-300 rounded-sm px-2 py-1 text-sm w-24 focus:outline-none ${!isViewMode ? 'bg-yellow-50' : 'bg-gray-100'}`}
                                    readOnly={isViewMode}
                                />
                                <span className="ml-2 text-base font-medium text-gray-700">%</span>
                                {validationError && <span className="ml-3 text-xs text-red-500 font-medium">{validationError}</span>}
                            </div>
                        </div>

                        {/* Storno */}
                         <div>
                            <label className={`inline-flex items-center ${isViewMode ? 'cursor-not-allowed opacity-70' : ''}`}>
                                <input 
                                    type="checkbox" 
                                    className="form-checkbox h-4 w-4 text-blue-600" 
                                    checked={storno}
                                    onChange={(e) => setStorno(e.target.checked)}
                                    disabled={isViewMode}
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700">Storno</span>
                            </label>
                        </div>

                        {/* Prijepis */}
                        <div>
                            <label className={`block text-sm font-medium ${!selectedPozicija ? 'text-gray-400' : 'text-gray-700'} mb-2`}>Prijepis podataka s pozicije</label>
                            <div className={`grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded border border-gray-200 ${!selectedPozicija ? 'opacity-50' : ''}`}>
                                {prijepisOptions.map(opt => (
                                    <label key={opt} className={`inline-flex items-center ${isViewMode || !selectedPozicija ? 'cursor-not-allowed opacity-70' : ''}`}>
                                        <input 
                                            type="checkbox" 
                                            className="form-checkbox h-4 w-4 text-blue-600" 
                                            checked={prijepis.includes(opt)}
                                            onChange={() => handleCheckboxChange(opt)}
                                            disabled={isViewMode || !selectedPozicija}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                    </div>
                    
                    <div className="p-4 border-t bg-gray-50 flex justify-end space-x-2">
                         {!isViewMode && (
                             <button onClick={handleSave} className="flex items-center px-3 py-1 bg-slate-700 text-white rounded text-xs hover:bg-slate-800">
                                <CheckIcon className="h-4 w-4 mr-1"/> U redu
                            </button>
                         )}
                         <button onClick={onClose} className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300">
                            <XCircleIcon className="h-4 w-4 mr-1"/> {isViewMode ? 'Zatvori' : 'Odustani'}
                        </button>
                    </div>
                </div>
            </div>

             {/* Sub-Modals */}
             {isVrstaDokumentaModalOpen && (
                <GenericCrudModal 
                    isOpen={isVrstaDokumentaModalOpen}
                    onClose={() => setIsVrstaDokumentaModalOpen(false)}
                    title="Odabir - Vrsta dokumenta"
                    items={vrsteDokumenata}
                    onSave={onAddVrstaDokumenta}
                    onUpdate={onUpdateVrstaDokumenta}
                    onDelete={onDeleteVrstaDokumenta}
                    isSelectionMode={true}
                    onSelect={(item) => { setSelectedVrstaDokumenta(item as VrstaDokumenta); }}
                />
            )}

            {isPozicijaModalOpen && (
                <GenericCrudModal 
                    isOpen={isPozicijaModalOpen}
                    onClose={() => setIsPozicijaModalOpen(false)}
                    title="Odabir - Pozicija"
                    items={pozicije}
                    onSave={onAddPozicija}
                    onUpdate={onUpdatePozicija}
                    onDelete={onDeletePozicija}
                    isSelectionMode={true}
                    onSelect={(item) => { setSelectedPozicija(item as Pozicija); }}
                />
            )}

            {isRacunModalOpen && (
                 <RacunskiPlanModal
                    isOpen={isRacunModalOpen}
                    onClose={() => setIsRacunModalOpen(false)}
                    onSelect={(items) => { 
                        if(items.length > 0) setSelectedRacun(items[0]); 
                        setIsRacunModalOpen(false);
                    }}
                    initiallySelectedAccounts={selectedRacun ? [selectedRacun] : []}
                    isSingleSelect={true}
                    filterMinLength={6}
                 />
            )}
        </>
    );
};

export default StavkaKontiranjaModal;
