
import React, { useState, useMemo, useEffect } from 'react';
import { HomeIcon, NewIcon, EditIcon, DeleteIcon, RefreshIcon, ExcelIcon, ViewIcon, CheckIcon, XCircleIcon, InfoIcon, XIcon } from '../constants';
import Toolbar from './Toolbar';
import GenericCrudModal from './GenericCrudModal';
import StavkaKontiranjaModal from './StavkaKontiranjaModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import type { Dogadjaj, VrstaDokumenta, Pozicija, StavkaKontiranja, Korisnik } from '../types';

// Helper for ID generation
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper for Date formatting
const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}.${parts[1]}.${parts[0]}.`;
};

interface KatalogPosebnihDogadjanjaPageProps {
    selectedKorisnik: Korisnik;
    // Data passed from App.tsx state
    dogadjaji: Dogadjaj[];
    vrsteDokumenata: VrstaDokumenta[];
    pozicije: Pozicija[];
    stavke: StavkaKontiranja[]; // Flattened or filtered list
    // Handlers
    onSaveDogadjaj: (d: Omit<Dogadjaj, 'id'>) => Dogadjaj | void;
    onUpdateDogadjaj: (d: Dogadjaj) => void;
    onDeleteDogadjaj: (id: string) => void;
    
    onSaveVrstaDokumenta: (vd: Omit<VrstaDokumenta, 'id'>) => void;
    onUpdateVrstaDokumenta: (vd: VrstaDokumenta) => void;
    onDeleteVrstaDokumenta: (id: string) => void;

    onSavePozicija: (p: Omit<Pozicija, 'id'>) => void;
    onUpdatePozicija: (p: Pozicija) => void;
    onDeletePozicija: (id: string) => void;

    onSaveStavka: (s: Omit<StavkaKontiranja, 'id' | 'rbr'>) => void;
    onUpdateStavka: (s: StavkaKontiranja) => void;
    onDeleteStavka: (id: string) => void;
    
    isObjedinjenaGlavnaKnjigaEnabled: boolean; // Added prop
}

const KatalogPosebnihDogadjanjaPage: React.FC<KatalogPosebnihDogadjanjaPageProps> = ({
    selectedKorisnik,
    dogadjaji, vrsteDokumenata, pozicije, stavke,
    onSaveDogadjaj, onUpdateDogadjaj, onDeleteDogadjaj,
    onSaveVrstaDokumenta, onUpdateVrstaDokumenta, onDeleteVrstaDokumenta,
    onSavePozicija, onUpdatePozicija, onDeletePozicija,
    onSaveStavka, onUpdateStavka, onDeleteStavka,
    isObjedinjenaGlavnaKnjigaEnabled
}) => {
    // Selection State
    const [selectedDogadjaj, setSelectedDogadjaj] = useState<Dogadjaj | null>(null);
    const [selectedVrstaDokumenta, setSelectedVrstaDokumenta] = useState<VrstaDokumenta | null>(null); // Kept for modal state
    const [selectedStavka, setSelectedStavka] = useState<StavkaKontiranja | null>(null);

    // Modal State
    const [isDogadjajModalOpen, setIsDogadjajModalOpen] = useState(false);
    const [isVrstaDokumentaModalOpen, setIsVrstaDokumentaModalOpen] = useState(false);
    const [isStavkaModalOpen, setIsStavkaModalOpen] = useState(false);
    const [isStavkaEditMode, setIsStavkaEditMode] = useState(false);
    const [isStavkaViewMode, setIsStavkaViewMode] = useState(false);

    // Delete Confirmation State
    const [deleteModalState, setDeleteModalState] = useState<{
        isOpen: boolean;
        type: string;
        name: string;
        onConfirm: () => void;
    } | null>(null);

    // Sync selected items with fresh data from props to prevent stale data in modals
    useEffect(() => {
        if (selectedDogadjaj) {
            const updated = dogadjaji.find(d => d.id === selectedDogadjaj.id);
            if (updated && updated !== selectedDogadjaj) {
                setSelectedDogadjaj(updated);
            } else if (!updated) {
                setSelectedDogadjaj(null);
            }
        }
    }, [dogadjaji, selectedDogadjaj]);

    useEffect(() => {
        if (selectedStavka) {
            const updated = stavke.find(s => s.id === selectedStavka.id);
            if (updated && updated !== selectedStavka) {
                setSelectedStavka(updated);
            } else if (!updated) {
                setSelectedStavka(null);
            }
        }
    }, [stavke, selectedStavka]);

    // Filtered Stavke - Now filtered only by Dogadjaj
    const filteredStavke = useMemo(() => {
        if (!selectedDogadjaj) return [];
        return stavke.filter(s => s.dogadjajId === selectedDogadjaj.id);
    }, [stavke, selectedDogadjaj]);

    // Handlers for Events (Top Grid)
    const handleNewDogadjaj = () => {
         setIsDogadjajModalOpen(true);
    };

    // Handlers for Items (Bottom Grid)
    const handleNewStavka = () => {
        if (!selectedDogadjaj) {
            alert('Molimo odaberite događaj.');
            return;
        }
        setSelectedStavka(null);
        setIsStavkaEditMode(false);
        setIsStavkaViewMode(false);
        setIsStavkaModalOpen(true);
    };

    const handleEditStavka = () => {
        if (selectedStavka) {
            setIsStavkaEditMode(true);
            setIsStavkaViewMode(false);
            setIsStavkaModalOpen(true);
        }
    };

    const handleViewStavka = () => {
        if (selectedStavka) {
            setIsStavkaEditMode(false);
            setIsStavkaViewMode(true);
            setIsStavkaModalOpen(true);
        }
    };

    const handleDeleteStavka = () => {
        if (selectedStavka) {
            setDeleteModalState({
                isOpen: true,
                type: 'stavku',
                name: `Rbr. ${selectedStavka.rbr}`,
                onConfirm: () => {
                    onDeleteStavka(selectedStavka.id);
                    setSelectedStavka(null);
                    setDeleteModalState(null);
                }
            });
        }
    };
    
    const [isDogadjajFormOpen, setIsDogadjajFormOpen] = useState(false);
    const [dogadjajFormMode, setDogadjajFormMode] = useState<'new' | 'edit' | 'view'>('new');

    const openNewDogadjajForm = () => {
        setDogadjajFormMode('new');
        setIsDogadjajFormOpen(true);
    };

    const openEditDogadjajForm = () => {
        if (selectedDogadjaj) {
            setDogadjajFormMode('edit');
            setIsDogadjajFormOpen(true);
        }
    };

    const openViewDogadjajForm = () => {
        if (selectedDogadjaj) {
            setDogadjajFormMode('view');
            setIsDogadjajFormOpen(true);
        }
    };
    
    const handleDeleteDogadjaj = () => {
        if(selectedDogadjaj) {
            setDeleteModalState({
                isOpen: true,
                type: 'događaj',
                name: selectedDogadjaj.naziv,
                onConfirm: () => {
                    onDeleteDogadjaj(selectedDogadjaj.id);
                    setSelectedDogadjaj(null);
                    setDeleteModalState(null);
                }
            });
        }
    }
    
    // Handler for managing Vrste Dokumenata separately (hidden from UI flow but modal kept)
    const handleManageVrsteDokumenata = () => {
        setIsVrstaDokumentaModalOpen(true);
    };

    return (
        <>
            <div className="bg-white p-3 shadow-sm border border-gray-200 flex justify-between items-center">
                <div className="flex items-center space-x-2 text-gray-500">
                    <HomeIcon className="h-5 w-5" />
                    <span>&rsaquo;</span>
                    <span>Računovodstvo proračuna</span>
                    <span>&rsaquo;</span>
                    <span>Katalozi</span>
                    <span>&rsaquo;</span>
                    <span className="text-gray-800 font-semibold">Katalog posebnih događaja</span>
                </div>
            </div>

            <div className="flex flex-col flex-1 mt-2 space-y-3 overflow-hidden">
                
                {/* Top Section: Događaji Grid */}
                <div className="flex flex-col flex-[1] min-h-0 bg-white border border-gray-200 shadow-sm">
                    <div className="p-2 border-b font-semibold text-gray-700 bg-gray-50">Događaji</div>
                    <Toolbar actions={[
                        { label: 'Novi', icon: <NewIcon />, onClick: openNewDogadjajForm },
                        { label: 'Promjena', icon: <EditIcon />, onClick: openEditDogadjajForm, disabled: !selectedDogadjaj },
                        { label: 'Brisanje', icon: <DeleteIcon />, onClick: handleDeleteDogadjaj, disabled: !selectedDogadjaj },
                        { label: 'Uvid', icon: <ViewIcon />, onClick: openViewDogadjajForm, disabled: !selectedDogadjaj },
                        { label: 'Osvježi', icon: <RefreshIcon /> },
                    ]} />
                    <div className="flex-1 overflow-y-auto">
                         <table className="w-full text-left text-xs">
                            <thead className="sticky top-0 bg-slate-600 text-white z-10">
                                <tr>
                                    <th className="p-2 font-semibold w-24">Šifra</th>
                                    <th className="p-2 font-semibold">Naziv</th>
                                    <th className="p-2 font-semibold w-24 text-center">Aktivnost</th>
                                    <th className="p-2 font-semibold w-32">Aktivnost od</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {dogadjaji.map(d => (
                                    <tr 
                                        key={d.id} 
                                        onClick={() => setSelectedDogadjaj(d)}
                                        className={`cursor-pointer hover:bg-blue-100 ${selectedDogadjaj?.id === d.id ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                                    >
                                        <td className="p-2">{d.sifra}</td>
                                        <td className="p-2">{d.naziv}</td>
                                        <td className="p-2 text-center">
                                            {d.aktivnost && <CheckIcon className="h-4 w-4 mx-auto" />}
                                        </td>
                                        <td className="p-2">{d.aktivnost ? formatDate(d.aktivnostOd) : ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottom Section: Stavke Grid */}
                <div className="flex flex-col flex-[1] min-h-0 bg-white border border-gray-200 shadow-sm">
                    <div className="p-2 border-b font-semibold text-gray-700 bg-gray-50">Stavke kontiranja događaja</div>
                    <Toolbar actions={[
                         { label: 'Novi', icon: <NewIcon />, onClick: handleNewStavka, disabled: !selectedDogadjaj },
                         { label: 'Promjena', icon: <EditIcon />, onClick: handleEditStavka, disabled: !selectedStavka },
                         { label: 'Brisanje', icon: <DeleteIcon />, onClick: handleDeleteStavka, disabled: !selectedStavka },
                         { label: 'Uvid', icon: <ViewIcon />, onClick: handleViewStavka, disabled: !selectedStavka },
                         { label: 'Osvježi', icon: <RefreshIcon /> },
                    ]} />
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="sticky top-0 bg-slate-600 text-white z-10">
                                <tr>
                                    <th className="p-2 font-semibold w-12">Rbr.</th>
                                    <th className="p-2 font-semibold w-24">Vrsta dok.</th>
                                    {isObjedinjenaGlavnaKnjigaEnabled && (
                                        <th className="p-2 font-semibold w-24">Glavna knjiga</th>
                                    )}
                                    <th className="p-2 font-semibold w-20">Pozicija</th>
                                    <th className="p-2 font-semibold w-24">Račun</th>
                                    <th className="p-2 font-semibold w-10 text-center">D/P</th>
                                    <th className="p-2 font-semibold w-24 text-right">Postotak iznosa</th>
                                    <th className="p-2 font-semibold w-16 text-center">Storno</th>
                                    <th className="p-2 font-semibold">Prijepis podataka s pozicije</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredStavke.map(s => {
                                    const poz = pozicije.find(p => p.id === s.pozicijaId);
                                    const vrstaDok = vrsteDokumenata.find(v => v.id === s.vrstaDokumentaId);
                                    return (
                                        <tr 
                                            key={s.id}
                                            onClick={() => setSelectedStavka(s)}
                                            className={`cursor-pointer hover:bg-blue-100 ${selectedStavka?.id === s.id ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                                        >
                                            <td className="p-2">{s.rbr}</td>
                                            <td className="p-2">{vrstaDok?.sifra || ''}</td>
                                            {isObjedinjenaGlavnaKnjigaEnabled && (
                                                <td className="p-2">{s.glavnaKnjiga || 'NP'}</td>
                                            )}
                                            <td className="p-2">{poz?.sifra || ''}</td>
                                            <td className="p-2">{s.racun}</td>
                                            <td className="p-2 text-center">{s.strana}</td>
                                            <td className="p-2 text-right">{s.postotak.toFixed(2).replace('.', ',')} %</td>
                                            <td className="p-2 text-center">{s.storno ? <CheckIcon className="h-4 w-4 mx-auto text-slate-600" /> : ''}</td>
                                            <td className="p-2">{s.prijepis.join(', ')}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Modals */}

            {/* Form Modal for Događaji */}
            {isDogadjajFormOpen && (
                <SimpleDogadjajForm 
                    isOpen={isDogadjajFormOpen}
                    onClose={() => setIsDogadjajFormOpen(false)}
                    mode={dogadjajFormMode}
                    initialData={dogadjajFormMode !== 'new' ? selectedDogadjaj : null}
                    existingEvents={dogadjaji}
                    onSave={(data) => {
                        if (dogadjajFormMode === 'new') {
                            const newEvent = onSaveDogadjaj(data);
                            if (newEvent) {
                                setSelectedDogadjaj(newEvent);
                            }
                        }
                        else if (selectedDogadjaj && dogadjajFormMode === 'edit') onUpdateDogadjaj({ ...selectedDogadjaj, ...data });
                        setIsDogadjajFormOpen(false);
                    }}
                />
            )}

            {/* Vrsta Dokumenta Manager - Only accessible via hidden button now, but kept for data integrity ops */}
            <GenericCrudModal 
                isOpen={isVrstaDokumentaModalOpen}
                onClose={() => setIsVrstaDokumentaModalOpen(false)}
                title="Vrsta dokumenta"
                items={vrsteDokumenata}
                onSave={onSaveVrstaDokumenta}
                onUpdate={onUpdateVrstaDokumenta}
                onDelete={onDeleteVrstaDokumenta}
                isSelectionMode={false}
            />

            {/* Stavka Modal */}
            {isStavkaModalOpen && selectedDogadjaj && (
                <StavkaKontiranjaModal 
                    isOpen={isStavkaModalOpen}
                    onClose={() => setIsStavkaModalOpen(false)}
                    itemToEdit={isStavkaEditMode || isStavkaViewMode ? selectedStavka : null}
                    dogadjajId={selectedDogadjaj.id}
                    // vrstaDokumentaId is now handled inside the modal via selection
                    
                    onSave={onSaveStavka}
                    onUpdate={onUpdateStavka}
                    
                    vrsteDokumenata={vrsteDokumenata}
                    onAddVrstaDokumenta={onSaveVrstaDokumenta}
                    onUpdateVrstaDokumenta={onUpdateVrstaDokumenta}
                    onDeleteVrstaDokumenta={onDeleteVrstaDokumenta}

                    pozicije={pozicije}
                    onAddPozicija={onSavePozicija}
                    onUpdatePozicija={onUpdatePozicija}
                    onDeletePozicija={onDeletePozicija}
                    isViewMode={isStavkaViewMode}
                    isObjedinjenaGlavnaKnjigaEnabled={isObjedinjenaGlavnaKnjigaEnabled}
                />
            )}

            {deleteModalState && (
                <DeleteConfirmationModal
                    isOpen={deleteModalState.isOpen}
                    onClose={() => setDeleteModalState(null)}
                    onConfirm={deleteModalState.onConfirm}
                    itemName={deleteModalState.name}
                    itemType={deleteModalState.type}
                />
            )}

        </>
    );
};


// Inline Simple Form for Dogadjaj to save creating another file
const SimpleDogadjajForm: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    mode: 'new' | 'edit' | 'view';
    initialData: Dogadjaj | null;
    existingEvents: Dogadjaj[];
    onSave: (data: { sifra: string; naziv: string, aktivnost: boolean, aktivnostOd: string | null }) => void;
}> = ({ isOpen, onClose, mode, initialData, existingEvents, onSave }) => {
    const [sifra, setSifra] = useState(initialData?.sifra || '');
    const [naziv, setNaziv] = useState(initialData?.naziv || '');
    
    // Initialize aktivnost and aktivnostOd based on mode and initialData
    const [aktivnost, setAktivnost] = useState(initialData ? initialData.aktivnost : true);
    
    const [aktivnostOdInput, setAktivnostOdInput] = useState(() => {
        if (initialData) {
             return initialData.aktivnost ? (initialData.aktivnostOd || '') : '';
        }
        // Initial format YYYY-MM-DD
        return new Date().toISOString().split('T')[0];
    });

    const [error, setError] = useState('');
    const [showWarningModal, setShowWarningModal] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'view') return;
        if (!sifra.trim() || !naziv.trim()) {
            setError('Sva polja su obavezna');
            return;
        }
        if(sifra.length > 10) { setError('Šifra max 10 znakova'); return; }
        if(/\s/.test(sifra)) { setError('Šifra ne smije imati razmake'); return; }
        if(naziv.length > 100) { setError('Naziv max 100 znakova'); return; }
        
        let parsedDate: string | null = null;

        if (aktivnost) {
            if (!aktivnostOdInput) {
                setError('Datum aktivnosti je obavezan ako je događaj aktivan.');
                return;
            }
             parsedDate = aktivnostOdInput;
        }

        // Duplicate Check
        const isDuplicate = existingEvents.some(e => 
            e.sifra === sifra && (mode === 'new' || e.id !== initialData?.id)
        );

        if (isDuplicate) {
            setShowWarningModal(true);
            return;
        }

        onSave({ sifra, naziv, aktivnost, aktivnostOd: aktivnost ? parsedDate : null });
    };

    const handleAktivnostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (mode === 'view') return;
        const checked = e.target.checked;
        setAktivnost(checked);
        if (checked) {
            setAktivnostOdInput(new Date().toISOString().split('T')[0]);
        } else {
            setAktivnostOdInput('');
        }
    };

    if (!isOpen) return null;

    let title = 'Novi događaj';
    if (mode === 'edit') title = 'Promjena događaja';
    if (mode === 'view') title = 'Uvid događaja';

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                    <div className="bg-slate-700 text-white p-3 rounded-t-lg flex justify-between">
                        <span className="font-semibold">{title}</span>
                        <button onClick={onClose}>X</button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Šifra</label>
                            <input 
                                value={sifra} 
                                onChange={e => setSifra(e.target.value)} 
                                className={`mt-1 w-full border p-2 rounded ${mode === 'view' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-50 text-gray-900'}`} 
                                readOnly={mode === 'view'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Naziv</label>
                            <input 
                                value={naziv} 
                                onChange={e => setNaziv(e.target.value)} 
                                className={`mt-1 w-full border p-2 rounded ${mode === 'view' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-50 text-gray-900'}`}
                                readOnly={mode === 'view'}
                            />
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <input 
                                    type="checkbox"
                                    id="aktivnostCheck"
                                    checked={aktivnost}
                                    onChange={handleAktivnostChange}
                                    className="h-4 w-4 text-blue-600"
                                    disabled={mode === 'view'}
                                />
                                <label htmlFor="aktivnostCheck" className="ml-2 text-sm font-medium text-gray-700">Aktivnost</label>
                            </div>
                            
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Aktivnost od</label>
                                <input 
                                    type="date"
                                    value={aktivnostOdInput}
                                    onChange={(e) => setAktivnostOdInput(e.target.value)}
                                    className={`w-full border p-2 rounded text-sm ${mode === 'view' || !aktivnost ? 'bg-gray-100 text-gray-500' : 'bg-yellow-50 text-gray-900'}`}
                                    disabled={mode === 'view' || !aktivnost}
                                />
                            </div>
                        </div>


                        <div className="flex justify-end space-x-2 pt-2">
                            {mode !== 'view' && (
                                <button type="submit" className="flex items-center px-3 py-1 bg-slate-700 text-white rounded text-xs hover:bg-slate-800">
                                    <CheckIcon className="h-4 w-4 mr-1"/> U redu
                                </button>
                            )}
                            <button type="button" onClick={onClose} className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300">
                                <XCircleIcon className="h-4 w-4 mr-1"/> {mode === 'view' ? 'Zatvori' : 'Odustani'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showWarningModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex justify-center items-center p-4">
                     <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
                        <div className="flex justify-between items-center border-b p-4">
                             <h3 className="text-lg font-semibold text-gray-800">Upozorenje</h3>
                             <button onClick={() => setShowWarningModal(false)} className="text-gray-400 hover:text-gray-600">
                                 <XIcon className="h-6 w-6" />
                             </button>
                        </div>
                         <div className="p-6 text-center">
                             <div className="flex justify-center mb-4">
                                 <InfoIcon className="h-16 w-16 text-yellow-600" />
                             </div>
                             <p className="text-gray-700 font-semibold">Događaj sa zadanom šifrom već postoji na prijavljenom korisniku.</p>
                         </div>
                         <div className="flex justify-center p-4 border-t bg-gray-50">
                             <button
                                 type="button"
                                 onClick={() => setShowWarningModal(false)}
                                 className="flex items-center px-4 py-2 bg-slate-700 text-white rounded text-sm hover:bg-slate-800"
                             >
                                 <CheckIcon className="h-4 w-4 mr-1"/> U redu
                             </button>
                         </div>
                     </div>
                </div>
            )}
        </>
    );
};

export default KatalogPosebnihDogadjanjaPage;
