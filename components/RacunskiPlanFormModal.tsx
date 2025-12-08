
import React, { useState, useEffect } from 'react';
import { XIcon } from '../constants';
import type { RacunskiPlanItem } from '../types';

interface RacunskiPlanFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: RacunskiPlanItem, originalKonto?: string) => void;
    itemToEdit?: RacunskiPlanItem | null;
    existingKontos: string[];
}

const RacunskiPlanFormModal: React.FC<RacunskiPlanFormModalProps> = ({ 
    isOpen, 
    onClose, 
    onSave, 
    itemToEdit,
    existingKontos 
}) => {
    const [konto, setKonto] = useState('');
    const [opis, setOpis] = useState('');
    const [error, setError] = useState('');

    const isEditMode = !!itemToEdit;

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setKonto(itemToEdit.konto);
                setOpis(itemToEdit.opis);
            } else {
                setKonto('');
                setOpis('');
            }
            setError('');
        }
    }, [isOpen, itemToEdit]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!konto.trim() || !opis.trim()) {
            setError('Sva polja su obavezna.');
            return;
        }

        // Check for duplicate Konto
        // If creating new: check if exists
        // If editing: check if changed AND exists
        if (!isEditMode && existingKontos.includes(konto)) {
            setError('Konto s ovim brojem već postoji.');
            return;
        }

        if (isEditMode && itemToEdit && konto !== itemToEdit.konto && existingKontos.includes(konto)) {
            setError('Konto s ovim brojem već postoji.');
            return;
        }

        onSave({ konto, opis }, itemToEdit?.konto);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex-shrink-0 flex justify-between items-center border-b p-4 bg-slate-700 text-white rounded-t-lg">
                    <h3 className="text-lg font-semibold">{isEditMode ? 'Promjena konta' : 'Novi konto'}</h3>
                    <button onClick={onClose} className="text-gray-300 hover:text-white" aria-label="Close modal">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                
                <form id="racunski-plan-form" onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Konto</label>
                        <input 
                            type="text" 
                            value={konto} 
                            onChange={(e) => setKonto(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Opis</label>
                        <input 
                            type="text" 
                            value={opis} 
                            onChange={(e) => setOpis(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" 
                            required 
                        />
                    </div>
                </form>

                <div className="flex-shrink-0 flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium mr-2 hover:bg-gray-300">Odustani</button>
                    <button type="submit" form="racunski-plan-form" className="bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800">Spremi</button>
                </div>
            </div>
        </div>
    );
};

export default RacunskiPlanFormModal;
