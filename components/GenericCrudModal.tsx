import React, { useState, useEffect } from 'react';
import { XIcon, CheckIcon, XCircleIcon, NewIcon, EditIcon, DeleteIcon, RefreshIcon } from '../constants';
import Toolbar from './Toolbar';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface GenericItem {
    id: string;
    sifra: string;
    naziv: string;
}

interface GenericCrudModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    items: GenericItem[];
    onSave: (item: Omit<GenericItem, 'id'>) => void;
    onUpdate: (item: GenericItem) => void;
    onDelete: (id: string) => void;
    onSelect?: (item: GenericItem) => void; // Optional selection mode
    isSelectionMode?: boolean;
}

const GenericCrudModal: React.FC<GenericCrudModalProps> = ({ 
    isOpen, onClose, title, items, onSave, onUpdate, onDelete, onSelect, isSelectionMode = false 
}) => {
    const [selectedItem, setSelectedItem] = useState<GenericItem | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formState, setFormState] = useState({ sifra: '', naziv: '' });
    const [error, setError] = useState('');
    const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedItem(items.length > 0 ? items[0] : null);
            setIsEditMode(false);
            setFormState({ sifra: '', naziv: '' });
            setError('');
            setDeleteConfirmationOpen(false);
        }
    }, [isOpen, items]);

    const handleNew = () => {
        setSelectedItem(null);
        setFormState({ sifra: '', naziv: '' });
        setIsEditMode(true);
    };

    const handleEdit = () => {
        if (selectedItem) {
            setFormState({ sifra: selectedItem.sifra, naziv: selectedItem.naziv });
            setIsEditMode(true);
        }
    };

    const handleDelete = () => {
        if (selectedItem) {
            setDeleteConfirmationOpen(true);
        }
    };

    const handleConfirmDelete = () => {
        if (selectedItem) {
            onDelete(selectedItem.id);
            setSelectedItem(null);
            setDeleteConfirmationOpen(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formState.sifra.trim() || !formState.naziv.trim()) {
            setError('Sva polja su obavezna.');
            return;
        }
        if (formState.sifra.length > 5) {
            setError('Šifra može imati najviše 5 znakova.');
            return;
        }
        if (/\s/.test(formState.sifra)) {
             setError('Šifra ne smije sadržavati razmake.');
             return;
        }
        if (formState.naziv.length > 100) {
            setError('Naziv može imati najviše 100 znakova.');
            return;
        }

        if (selectedItem && isEditMode) {
             // Update existing
             onUpdate({ ...selectedItem, ...formState });
        } else {
             // Create new
             onSave(formState);
        }
        setIsEditMode(false);
        setFormState({ sifra: '', naziv: '' });
    };

    const handleConfirmSelection = () => {
        if (selectedItem && onSelect) {
            onSelect(selectedItem);
            onClose();
        }
    };

    const toolbarActions = [
        { label: 'Novi', icon: <NewIcon />, onClick: handleNew, disabled: isEditMode },
        { label: 'Promjena', icon: <EditIcon />, onClick: handleEdit, disabled: isEditMode || !selectedItem },
        { label: 'Brisanje', icon: <DeleteIcon />, onClick: handleDelete, disabled: isEditMode || !selectedItem },
        { label: 'Osvježi', icon: <RefreshIcon />, onClick: () => {}, disabled: isEditMode },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                <div className="bg-slate-700 text-white p-2 flex justify-between items-center rounded-t-lg">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-300"><XIcon className="h-5 w-5" /></button>
                </div>

                {!isEditMode ? (
                    <>
                        <Toolbar actions={toolbarActions} />
                        <div className="flex-1 overflow-y-auto p-0">
                             <table className="w-full text-left text-xs">
                                <thead className="bg-gray-100 sticky top-0">
                                    <tr>
                                        <th className="p-2 font-semibold border-b w-24">Šifra</th>
                                        <th className="p-2 font-semibold border-b">Naziv</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {items.map(item => (
                                        <tr 
                                            key={item.id} 
                                            onClick={() => setSelectedItem(item)}
                                            className={`cursor-pointer hover:bg-blue-100 ${selectedItem?.id === item.id ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                                        >
                                            <td className="p-2">{item.sifra}</td>
                                            <td className="p-2">{item.naziv}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {isSelectionMode && (
                            <div className="p-3 border-t bg-gray-50 flex justify-end space-x-2">
                                <button onClick={handleConfirmSelection} disabled={!selectedItem} className="flex items-center px-3 py-1 bg-slate-700 text-white rounded text-xs hover:bg-slate-800 disabled:opacity-50">
                                    <CheckIcon className="h-4 w-4 mr-1"/> U redu
                                </button>
                                <button onClick={onClose} className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300">
                                    <XCircleIcon className="h-4 w-4 mr-1"/> Odustani
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="p-6">
                         <h4 className="font-semibold mb-4 text-gray-800">{selectedItem ? 'Promjena' : 'Novi unos'}</h4>
                         {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
                         <form onSubmit={handleFormSubmit} className="space-y-3">
                             <div>
                                 <label className="block text-xs font-medium text-gray-700">Šifra (max 5, bez razmaka)</label>
                                 <input 
                                    type="text" 
                                    value={formState.sifra} 
                                    onChange={e => setFormState({...formState, sifra: e.target.value})}
                                    className="mt-1 w-full border border-gray-300 rounded-sm px-2 py-1 text-sm"
                                    maxLength={5}
                                 />
                             </div>
                             <div>
                                 <label className="block text-xs font-medium text-gray-700">Naziv (max 100)</label>
                                 <input 
                                    type="text" 
                                    value={formState.naziv} 
                                    onChange={e => setFormState({...formState, naziv: e.target.value})}
                                    className="mt-1 w-full border border-gray-300 rounded-sm px-2 py-1 text-sm"
                                    maxLength={100}
                                 />
                             </div>
                             <div className="flex justify-end space-x-2 pt-4">
                                 <button type="submit" className="flex items-center px-3 py-1 bg-slate-700 text-white rounded text-xs hover:bg-slate-800">
                                    <CheckIcon className="h-4 w-4 mr-1"/> U redu
                                 </button>
                                 <button type="button" onClick={() => setIsEditMode(false)} className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300">
                                     <XCircleIcon className="h-4 w-4 mr-1"/> Odustani
                                 </button>
                             </div>
                         </form>
                    </div>
                )}
                
                {isDeleteConfirmationOpen && selectedItem && (
                    <DeleteConfirmationModal 
                        isOpen={isDeleteConfirmationOpen}
                        onClose={() => setDeleteConfirmationOpen(false)}
                        onConfirm={handleConfirmDelete}
                        itemName={selectedItem.naziv}
                        itemType={title.replace('Odabir - ', '')}
                    />
                )}
            </div>
        </div>
    );
};

export default GenericCrudModal;