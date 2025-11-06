
import React, { useState, useEffect } from 'react';
import type { AopItem, DependentAccount, RacunskiPlanItem } from '../types';
import { XIcon, CheckIcon, XCircleIcon } from '../constants';
import RacunskiPlanModal from './RacunskiPlanModal';
import { racunskiPlanData } from '../data/racunskiPlanData';

interface NewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accounts: Omit<DependentAccount, 'id'>[]) => void;
  aopItem: AopItem;
  title: string;
  existingAccounts: DependentAccount[];
}

const NewAccountModal: React.FC<NewAccountModalProps> = ({ isOpen, onClose, onSave, aopItem, title, existingAccounts }) => {
  const [selectedAccounts, setSelectedAccounts] = useState<RacunskiPlanItem[]>([]);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Map existing dependent accounts to full RacunskiPlanItem objects
      const initialSelected = racunskiPlanData.filter(planItem =>
        existingAccounts.some(existingAcc => existingAcc.konto === planItem.konto)
      );
      setSelectedAccounts(initialSelected);
    } else {
      // Reset when closed to not affect next opening
      setSelectedAccounts([]);
    }
  }, [isOpen, existingAccounts]);

  if (!isOpen) return null;
  
  const handleSave = () => {
    const accountsToSave = selectedAccounts.map(acc => ({
      konto: acc.konto,
      nazivKonta: acc.opis
    }));
    onSave(accountsToSave);
    onClose();
  };

  const handleAccountSelect = (accounts: RacunskiPlanItem[]) => {
    setSelectedAccounts(accounts);
    setIsPlanModalOpen(false);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" 
        onClick={onClose} 
        role="dialog" 
        aria-modal="true"
      >
        <div 
          className="bg-gray-100 rounded-sm shadow-xl w-full max-w-xl" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-slate-700 text-white p-2 flex justify-between items-center rounded-t-sm">
            <h3 className="text-sm font-semibold">{title}</h3>
            <button onClick={onClose} className="text-white hover:text-gray-300" aria-label="Close modal">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleSave}
                className="flex items-center space-x-1 text-sm text-gray-700 hover:text-blue-600"
              >
                <CheckIcon className="h-4 w-4" />
                <span>U redu</span>
              </button>
              <button 
                onClick={onClose}
                className="flex items-center space-x-1 text-sm text-gray-700 hover:text-red-600"
              >
                <XCircleIcon className="h-4 w-4" />
                <span>Odustani</span>
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap items-center gap-y-1 gap-x-2">
                <label className="w-full sm:w-36 sm:text-right shrink-0" htmlFor="aop-display-aop">Konto za AOP</label>
                <div className="flex items-center flex-1 min-w-[200px]">
                    <input
                      id="aop-display-aop"
                      type="text"
                      readOnly
                      value={aopItem.aop}
                      className="w-24 p-1 bg-gray-200 border border-gray-300 rounded-sm text-sm"
                    />
                    <input
                      id="aop-display-opis"
                      type="text"
                      readOnly
                      value={aopItem.opis}
                      className="flex-1 p-1 bg-gray-200 border border-gray-300 rounded-sm text-sm ml-2"
                      aria-label="AOP Opis"
                    />
                </div>
              </div>
               <div className="flex flex-wrap items-center gap-y-1 gap-x-2">
                <label className="w-full sm:w-36 sm:text-right shrink-0">Konto</label>
                <div className="flex items-center flex-1 min-w-[200px]">
                  <button 
                    onClick={() => setIsPlanModalOpen(true)} 
                    className="w-full text-center p-2 border border-gray-400 rounded-md bg-white hover:bg-gray-100 shadow-sm font-medium text-gray-700"
                  >
                      Odabrano ({selectedAccounts.length}) konta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPlanModalOpen && (
        <RacunskiPlanModal 
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          onSelect={handleAccountSelect}
          initiallySelectedAccounts={selectedAccounts}
        />
      )}
    </>
  );
};

export default NewAccountModal;
