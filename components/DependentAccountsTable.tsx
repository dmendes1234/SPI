import React, { useState, useEffect, useMemo } from 'react';
import type { AopItem, DependentAccount } from '../types';
import Toolbar from './Toolbar';
import { EditIcon, RefreshIcon, SaveIcon, ExcelIcon, UploadIcon } from '../constants';
import ContextMenu from './ContextMenu';
import Modal from './Modal';
import NewAccountModal from './NewAccountModal';
import CopyUsersModal from './CopyUsersModal';

interface DependentAccountsTableProps {
  selectedAop: AopItem | null;
  accountsData: DependentAccount[];
  onUpdateAccount: (account: DependentAccount) => void;
  onSetAccounts: (accountData: Omit<DependentAccount, 'id'>[]) => void;
  allDependentAccountsData: {[key: string]: DependentAccount[]}; // New prop
  onCopyAllDependentAccounts: (selectedUserCodes: string[], allDependentAccounts: {[key: string]: DependentAccount[]}) => void; // New prop
}

interface TableFilterInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ariaLabel: string;
}

const TableFilterInput: React.FC<TableFilterInputProps> = ({ value, onChange, ariaLabel }) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full text-xs p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white"
        aria-label={ariaLabel}
    />
);

const DependentAccountsTable: React.FC<DependentAccountsTableProps> = ({ selectedAop, accountsData, onUpdateAccount, onSetAccounts, allDependentAccountsData, onCopyAllDependentAccounts }) => {
  const [selectedAccount, setSelectedAccount] = useState<DependentAccount | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: DependentAccount } | null>(null);
  
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isCopyUsersModalOpen, setIsCopyUsersModalOpen] = useState(false);
  const [filters, setFilters] = useState({ konto: '', nazivKonta: '' });

  useEffect(() => {
    if (selectedAop) {
      setSelectedAccount(accountsData[0] || null);
    } else {
      setSelectedAccount(null);
    }
  }, [selectedAop, accountsData]);
  
  const handleCopyUsersModalConfirm = (selectedUserCodes: string[]) => {
    onCopyAllDependentAccounts(selectedUserCodes, allDependentAccountsData);
    setIsCopyUsersModalOpen(false);
  };

  const toolbarActions = [
    { label: 'Promjena', icon: <EditIcon />, onClick: () => setIsChangeModalOpen(true) },
    { label: 'Osvježi', icon: <RefreshIcon /> },
    { label: 'Spremi pretragu', icon: <SaveIcon /> },
    { label: 'Preuzmi u Excel-u', icon: <ExcelIcon /> },
    { label: 'Prijepis podataka na druge korisnike', icon: <UploadIcon />, onClick: () => setIsCopyUsersModalOpen(true) },
  ];

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredAccountsData = useMemo(() => {
    return accountsData.filter(account =>
        account.konto.toLowerCase().includes(filters.konto.toLowerCase()) &&
        account.nazivKonta.toLowerCase().includes(filters.nazivKonta.toLowerCase())
    );
  }, [accountsData, filters]);
  
  const handleContextMenu = (event: React.MouseEvent<HTMLTableRowElement>, item: DependentAccount) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, item });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };


  return (
    <div className="bg-white border border-gray-200 shadow-sm flex flex-col h-full">
      <div className="p-2 border-b font-semibold text-gray-700 bg-gray-50">
        Zavisna konta za AOP
      </div>
      <Toolbar actions={toolbarActions} />
      <div className="flex-1 overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[400px]">
            <thead className="sticky top-0 bg-slate-600 text-white z-10">
              <tr>
                <th className="p-2 font-semibold w-32">Konto</th>
                <th className="p-2 font-semibold">Naziv konta</th>
              </tr>
               <tr className="bg-gray-100">
                  <td className="p-1">
                    <TableFilterInput
                      value={filters.konto}
                      onChange={(e) => handleFilterChange('konto', e.target.value)}
                      ariaLabel="Filter by Konto"
                    />
                  </td>
                  <td className="p-1">
                    <TableFilterInput
                      value={filters.nazivKonta}
                      onChange={(e) => handleFilterChange('nazivKonta', e.target.value)}
                      ariaLabel="Filter by Naziv konta"
                    />
                  </td>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAccountsData.map((account) => (
                <tr
                  key={account.id}
                  onClick={() => setSelectedAccount(account)}
                  onContextMenu={(e) => handleContextMenu(e, account)}
                  className={`cursor-pointer hover:bg-blue-100 ${selectedAccount?.id === account.id ? 'bg-blue-200' : ''}`}
                >
                  <td className="p-2 font-mono">{account.konto}</td>
                  <td className="p-2">{account.nazivKonta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={handleCloseContextMenu}>
          {/* 'Promjena' option removed */}
          {/* Fix: Provide an empty div as children to satisfy the 'children' prop requirement */}
          <div></div>
        </ContextMenu>
      )}
      
      {isChangeModalOpen && selectedAop && (
        <NewAccountModal
            isOpen={isChangeModalOpen}
            onClose={() => setIsChangeModalOpen(false)}
            onSave={onSetAccounts}
            aopItem={selectedAop}
            title="Promjena - Konta"
            existingAccounts={accountsData}
        />
      )}
      {isCopyUsersModalOpen && (
        <CopyUsersModal
          isOpen={isCopyUsersModalOpen}
          onClose={() => setIsCopyUsersModalOpen(false)}
          onCopy={handleCopyUsersModalConfirm}
        />
      )}
    </div>
  );
};

export default DependentAccountsTable;