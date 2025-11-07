
import React, { useState, useEffect } from 'react';
import { XIcon } from '../constants';
import type { Operator } from '../types';

interface OperatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (operator: any) => void;
    operatorToEdit?: Operator | null;
}

const OperatorModal: React.FC<OperatorModalProps> = ({ isOpen, onClose, onSave, operatorToEdit }) => {
    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');
    const [korisnickoIme, setKorisnickoIme] = useState('');
    const [lozinka, setLozinka] = useState('');
    const [ponoviLozinku, setPonoviLozinku] = useState('');
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [trenutnaLozinka, setTrenutnaLozinka] = useState('');
    const [novaLozinka, setNovaLozinka] = useState('');
    const [ponoviNovuLozinku, setPonoviNovuLozinku] = useState('');
    const [error, setError] = useState('');

    const isEditMode = !!operatorToEdit;

    useEffect(() => {
        if (isEditMode && operatorToEdit) {
            setIme(operatorToEdit.ime);
            setPrezime(operatorToEdit.prezime);
            setKorisnickoIme(operatorToEdit.korisnickoIme);
            setLozinka('');
        } else {
            setIme('');
            setPrezime('');
            setKorisnickoIme('');
            setLozinka('');
            setPonoviLozinku('');
        }
        setShowPasswordChange(false);
        setTrenutnaLozinka('');
        setNovaLozinka('');
        setPonoviNovuLozinku('');
        setError('');
    }, [isOpen, operatorToEdit, isEditMode]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!ime || !prezime || !korisnickoIme) {
            setError('Sva polja su obavezna.');
            return;
        }

        if (isEditMode) {
            const payload: any = {
                ...operatorToEdit,
                ime,
                prezime,
                korisnickoIme,
            };
            
            if (showPasswordChange) {
                 if (!trenutnaLozinka) {
                    setError('Unesite trenutnu lozinku za promjenu.');
                    return;
                }
                if (!novaLozinka || novaLozinka !== ponoviNovuLozinku) {
                    setError('Nove lozinke se ne podudaraju ili su prazne.');
                    return;
                }
                if (novaLozinka.length < 6) {
                    setError('Nova lozinka mora imati barem 6 znakova.');
                    return;
                }
                payload.trenutnaLozinka = trenutnaLozinka;
                payload.lozinka = novaLozinka;
            } else {
                // Ensure lozinka is not sent if not being changed
                delete payload.lozinka;
            }
            
            onSave(payload);
        } else {
            if (!lozinka || lozinka.length < 6) {
                setError('Lozinka je obavezna i mora imati barem 6 znakova.');
                return;
            }
            if (lozinka !== ponoviLozinku) {
                setError('Lozinke se ne podudaraju.');
                return;
            }
            onSave({ ime, prezime, korisnickoIme, lozinka });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <div className="flex-shrink-0 flex justify-between items-center border-b p-6">
                    <h3 className="text-lg font-semibold">{isEditMode ? 'Promjena operatera' : 'Novi operater'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal"><XIcon className="h-6 w-6" /></button>
                </div>
                
                <form id="operator-form" onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ime</label>
                        <input type="text" value={ime} onChange={(e) => setIme(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Prezime</label>
                        <input type="text" value={prezime} onChange={(e) => setPrezime(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Korisničko ime</label>
                        <input type="text" value={korisnickoIme} onChange={(e) => setKorisnickoIme(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" required />
                    </div>
                    
                    {!isEditMode && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Lozinka</label>
                                <input type="password" value={lozinka} onChange={(e) => setLozinka(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ponovi lozinku</label>
                                <input type="password" value={ponoviLozinku} onChange={(e) => setPonoviLozinku(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" required />
                            </div>
                        </>
                    )}

                    {isEditMode && (
                        <>
                            {!showPasswordChange ? (
                                <button type="button" onClick={() => setShowPasswordChange(true)} className="text-sm text-blue-600 hover:underline">Promijeni lozinku</button>
                            ) : (
                                <div className="p-4 border border-gray-200 rounded-md space-y-3">
                                    <h4 className="text-md font-semibold text-gray-800">Promjena lozinke</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Trenutna lozinka</label>
                                        <input type="password" value={trenutnaLozinka} onChange={(e) => setTrenutnaLozinka(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nova lozinka</label>
                                        <input type="password" value={novaLozinka} onChange={(e) => setNovaLozinka(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ponovi novu lozinku</label>
                                        <input type="password" value={ponoviNovuLozinku} onChange={(e) => setPonoviNovuLozinku(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" />
                                    </div>
                                    <button type="button" onClick={() => setShowPasswordChange(false)} className="text-sm text-gray-600 hover:underline">Odustani od promjene lozinke</button>
                                </div>
                            )}
                        </>
                    )}
                </form>

                <div className="flex-shrink-0 flex justify-end p-6 border-t">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium mr-2 hover:bg-gray-300">Odustani</button>
                    <button type="submit" form="operator-form" className="bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800">Spremi</button>
                </div>
            </div>
        </div>
    );
};

export default OperatorModal;
