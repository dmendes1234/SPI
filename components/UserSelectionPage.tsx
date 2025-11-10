
import React, { useState, useEffect } from 'react';
import type { Korisnik } from '../types';

interface UserSelectionPageProps {
  users: Korisnik[];
  onSelectUser: (user: Korisnik) => void;
  onLogout: () => void;
  operatorName: string;
}

const UserSelectionPage: React.FC<UserSelectionPageProps> = ({ users, onSelectUser, onLogout, operatorName }) => {
  const [selectedUserLocal, setSelectedUserLocal] = useState<Korisnik | null>(null);

  useEffect(() => {
    // Reset local selection when the component mounts or users prop changes
    setSelectedUserLocal(null);
  }, [users]);

  const handleConfirmSelection = () => {
    if (selectedUserLocal) {
      onSelectUser(selectedUserLocal);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Odaberite Korisnika</h2>
        <p className="text-gray-600 mb-6">Dobrodošli, {operatorName}. Molimo odaberite korisnika za nastavak.</p>
        <div className="w-full max-h-60 overflow-y-auto space-y-2 mb-6 pr-2" role="listbox" aria-label="Popis dostupnih korisnika">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => setSelectedUserLocal(user)}
              onDoubleClick={() => onSelectUser(user)}
              className={`group w-full text-left p-3 border rounded-md focus:outline-none transition-colors
                          ${selectedUserLocal?.id === user.id 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-white border-gray-300 hover:bg-blue-100 hover:border-blue-300 focus:bg-blue-600 focus:text-white focus:border-blue-600'}`}
              role="option"
              aria-selected={selectedUserLocal?.id === user.id}
            >
              <span className={`font-semibold group-focus:text-white ${selectedUserLocal?.id === user.id ? 'text-white' : 'text-gray-800'}`}>{user.naziv}</span>
              <span className={`text-sm ml-2 group-focus:text-white ${selectedUserLocal?.id === user.id ? 'text-white' : 'text-gray-500'}`}>({user.sifra})</span>
            </button>
          ))}
        </div>
        <button
          onClick={handleConfirmSelection}
          disabled={!selectedUserLocal}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          aria-label="Potvrdi odabir korisnika"
        >
          Potvrdi odabir
        </button>
        <button
          onClick={onLogout}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          aria-label="Odjava"
        >
          Odjava
        </button>
      </div>
    </div>
  );
};

export default UserSelectionPage;