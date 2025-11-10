import React, { useState, useMemo, useEffect } from 'react';
import { XIcon, RefreshIcon, SaveIcon, ExcelIcon, CheckCircleIcon, InfoIcon } from '../constants';
import Toolbar from './Toolbar';
import type { Korisnik } from '../types'; // Import Korisnik type

interface CopyUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCopy: (selectedUserIds: string[]) => void; // Changed to return Korisnik IDs
    users: Korisnik[]; // Accept users via props
}

const CopyUsersModal: React.FC<CopyUsersModalProps> = ({ isOpen, onClose, onCopy, users }) => {
    const [filters, setFilters] = useState({ sifra: '', naziv: '' });
    const [selectedUsers, setSelectedUsers] = useState<Korisnik[]>([]);

    useEffect(() => {
        if (!isOpen) {
            // Reset state when modal closes
            setFilters({ sifra: '', naziv: '' });
            setSelectedUsers([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const toolbarActions = [
        { label: 'Osvježi', icon: <RefreshIcon /> },
        { label: 'Spremi pretragu', icon: <SaveIcon /> },
        { label: 'Preuzmi u Excel-u', icon: <ExcelIcon /> },
    ];

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.sifra.toLowerCase().includes(filters.sifra.toLowerCase()) &&
            user.naziv.toLowerCase().includes(filters.naziv.toLowerCase())
        );
    }, [filters, users]); // Depend on `users` prop

    const handleToggleUser = (user: Korisnik) => {
        setSelectedUsers(prev => {
            const isSelected = prev.some(u => u.id === user.id);
            if (isSelected) {
                return prev.filter(u => u.id !== user.id);
            }
            return [...prev, user];
        });
    };

    const handleToggleSelectAll = () => {
        const allVisibleSelected = filteredUsers.every(user => selectedUsers.some(u => u.id === user.id));

        if (allVisibleSelected) {
            // Deselect all visible
            setSelectedUsers(prev => prev.filter(user => !filteredUsers.some(fUser => fUser.id === user.id)));
        } else {
            // Select all visible (that are not already selected)
            const newSelections = filteredUsers.filter(user => !selectedUsers.some(u => u.id === user.id));
            setSelectedUsers(prev => [...prev, ...newSelections]);
        }
    };

    const handleConfirmCopy = () => {
        onCopy(selectedUsers.map(user => user.id)); // Return IDs
    };

    const areAllFilteredSelected = filteredUsers.length > 0 && filteredUsers.every(user => selectedUsers.some(u => u.id === user.id));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-gray-100 rounded-sm shadow-xl w-full max-w-2xl h-auto max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="bg-slate-700 text-white p-2 flex justify-between items-center rounded-t-sm">
                    <h3 className="text-sm font-semibold">Prijepis na korisnika</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-300" aria-label="Close modal">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="border-b border-gray-300">
                    <Toolbar actions={toolbarActions} />
                </div>

                <div className="flex-1 p-2 flex flex-col min-h-0 bg-white border border-gray-300">
                    <div className="flex-1 overflow-y-auto overflow-x-auto h-full">
                        <table className="w-full text-left text-xs table-fixed min-w-[400px]">
                            <thead className="sticky top-0 bg-slate-600 text-white z-10">
                                <tr>
                                    <th className="p-2 font-semibold w-10">
                                        <input
                                            type="checkbox"
                                            onChange={handleToggleSelectAll}
                                            checked={areAllFilteredSelected}
                                            aria-label="Select all visible users"
                                        />
                                    </th>
                                    <th className="p-2 font-semibold w-28">Šifra</th>
                                    <th className="p-2 font-semibold">Naziv</th>
                                </tr>
                                <tr className="bg-gray-100">
                                    <td></td>
                                    <td className="p-1">
                                        <input
                                            type="text"
                                            name="sifra"
                                            value={filters.sifra}
                                            onChange={handleFilterChange}
                                            className="w-full text-xs p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white"
                                            aria-label="Filter by Šifra"
                                        />
                                    </td>
                                    <td className="p-1">
                                        <input
                                            type="text"
                                            name="naziv"
                                            value={filters.naziv}
                                            onChange={handleFilterChange}
                                            className="w-full text-xs p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white"
                                            aria-label="Filter by Naziv"
                                        />
                                    </td>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map(user => (
                                    <tr
                                        key={user.id}
                                        onClick={() => handleToggleUser(user)}
                                        className={`cursor-pointer hover:bg-blue-100 ${selectedUsers.some(u => u.id === user.id) ? 'bg-blue-200' : ''}`}
                                    >
                                        <td className="p-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.some(u => u.id === user.id)}
                                                onChange={() => handleToggleUser(user)}
                                                onClick={(e) => e.stopPropagation()}
                                                aria-label={`Select user ${user.naziv}`}
                                            />
                                        </td>
                                        <td className="p-2 font-mono whitespace-nowrap overflow-hidden text-ellipsis">{user.sifra}</td>
                                        <td className="p-2 whitespace-nowrap overflow-hidden text-ellipsis">{user.naziv}</td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="p-4 text-center text-gray-500">Nema pronađenih korisnika.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="p-3 bg-gray-100 border-t flex justify-end items-center space-x-2">
                    <button onClick={handleConfirmCopy} className="flex items-center space-x-1 px-3 py-1.5 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        <CheckCircleIcon className="h-4 w-4" />
                        <span>U redu ({selectedUsers.length})</span>
                    </button>
                    <button onClick={onClose} className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                        <InfoIcon className="h-4 w-4" />
                        <span>Izlaz</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CopyUsersModal;