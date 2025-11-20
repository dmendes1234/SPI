
import React from 'react';
import { XIcon, InfoIcon, CheckIcon } from '../constants';

interface NotImplementedModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotImplementedModal: React.FC<NotImplementedModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-4">
                    <h3 className="text-lg font-semibold text-gray-800">Informacija</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <InfoIcon className="h-16 w-16 text-blue-500" />
                    </div>
                    <p className="text-gray-700 font-semibold">Nije implementirano</p>
                </div>
                <div className="flex justify-center p-4 border-t bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center px-4 py-2 bg-slate-700 text-white rounded text-sm hover:bg-slate-800"
                    >
                        <CheckIcon className="h-4 w-4 mr-1"/> U redu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotImplementedModal;