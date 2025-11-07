
import React from 'react';
import { XIcon } from '../constants';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-lg font-semibold">Potvrda brisanja</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal"><XIcon className="h-6 w-6" /></button>
                </div>
                <div className="mt-4">
                    <p>Jeste li sigurni da želite obrisati operatera: <strong>{itemName}</strong>?</p>
                </div>
                <div className="flex justify-end pt-6">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium mr-2 hover:bg-gray-300">Odustani</button>
                    <button type="button" onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">Obriši</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
