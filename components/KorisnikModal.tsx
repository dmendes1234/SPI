import React, { useState, useEffect } from 'react';
import { XIcon } from '../constants';
import type { Korisnik } from '../types';

interface KorisnikModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (korisnik: any) => void;
    korisnikToEdit?: Korisnik | null;
}

const KorisnikModal: React.FC<KorisnikModalProps> = ({ isOpen, onClose, onSave, korisnikToEdit }) => {
    const [sifra, setSifra] = useState('');
    const [naziv, setNaziv] = useState('');
    const [error, setError] = useState('');

    const isEditMode = !!korisnikToEdit;

    useEffect(() => {
        if (isEditMode && korisnikToEdit) {
            setSifra(korisnikToEdit.sifra);
            setNaziv(korisnikToEdit.naziv);
        } else {
            setSifra('');
            setNaziv('');
        }
        setError('');
    }, [isOpen, korisnikToEdit, isEditMode]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!sifra || !naziv) {
            setError('Sva polja su obavezna.');
            return;
        }

        if (isEditMode) {
            onSave({
                ...korisnikToEdit!,
                sifra,
                naziv,
            });
        } else {
            onSave({ sifra, naziv });
        }
        
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <div className="flex-shrink-0 flex justify-between items-center border-b p-6">
                    <h3 className="text-lg font-semibold">{isEditMode ? 'Promjena korisnika' : 'Novi korisnik'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal"><XIcon className="h-6 w-6" /></button>
                </div>
                
                <form id="korisnik-form" onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Šifra</label>
                        <input type="text" value={sifra} onChange={(e) => setSifra(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Naziv</label>
                        <input type="text" value={naziv} onChange={(e) => setNaziv(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" required />
                    </div>
                </form>

                <div className="flex-shrink-0 flex justify-end p-6 border-t">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium mr-2 hover:bg-gray-300">Odustani</button>
                    <button type="submit" form="korisnik-form" className="bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800">Spremi</button>
                </div>
            </div>
        </div>
    );
};

export default KorisnikModal;