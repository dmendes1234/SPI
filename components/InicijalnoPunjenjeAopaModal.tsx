import React, { useState } from 'react';

interface InicijalnoPunjenjeAopaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedCatalogs: string[]) => void;
}

const InicijalnoPunjenjeAopaModal: React.FC<InicijalnoPunjenjeAopaModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [prRasChecked, setPrRasChecked] = useState(true);
    const [obvezeChecked, setObvezeChecked] = useState(true);

    const isConfirmDisabled = !prRasChecked && !obvezeChecked;

    if (!isOpen) return null;

    const handleConfirm = () => {
        const selectedCatalogs: string[] = [];
        if (prRasChecked) selectedCatalogs.push('PR-RAS');
        if (obvezeChecked) selectedCatalogs.push('OBVEZE');
        onConfirm(selectedCatalogs);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-4">
                    <h3 className="text-lg font-semibold text-gray-800">Inicijalno punjenje kataloga AOP-a</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center">
                        <input
                            id="pr-ras-checkbox"
                            type="checkbox"
                            checked={prRasChecked}
                            onChange={() => setPrRasChecked(!prRasChecked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="pr-ras-checkbox" className="ml-3 block text-sm font-medium text-gray-700">
                            PR-RAS
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="obveze-checkbox"
                            type="checkbox"
                            checked={obvezeChecked}
                            onChange={() => setObvezeChecked(!obvezeChecked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="obveze-checkbox" className="ml-3 block text-sm font-medium text-gray-700">
                            OBVEZE
                        </label>
                    </div>
                </div>
                <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium mr-2 hover:bg-gray-300">
                        Odustani
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isConfirmDisabled}
                        className="bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        U redu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InicijalnoPunjenjeAopaModal;