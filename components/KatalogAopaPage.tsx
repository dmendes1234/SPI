
import React, { useMemo } from 'react';
import BreadcrumbsAndTitle from './BreadcrumbsAndTitle';
import AopTable from './AopTable';
import DependentAccountsTable from './DependentAccountsTable';
import type { AopItem, DependentAccount, Korisnik } from '../types';

interface KatalogAopaPageProps {
  aopData: AopItem[];
  dependentAccountsData: {[key: string]: DependentAccount[]};
  selectedAop: AopItem | null;
  onSelectAop: (aop: AopItem) => void;
  onUpdateAop: (aop: AopItem) => void;
  onUpdateDependentAccount: (account: DependentAccount) => void;
  onSetDependentAccountsForAop: (accounts: Omit<DependentAccount, 'id'>[]) => void;
  allKorisnici: Korisnik[];
  onCopyAllDependentAccounts: (selectedUserIds: string[]) => void;
  formType: string;
}

const KatalogAopaPage: React.FC<KatalogAopaPageProps> = ({
  aopData,
  dependentAccountsData,
  selectedAop,
  onSelectAop,
  onUpdateAop,
  onUpdateDependentAccount,
  onSetDependentAccountsForAop,
  allKorisnici,
  onCopyAllDependentAccounts,
  formType
}) => {
  const isAopDescriptionRestricted = useMemo(() => {
    if (!selectedAop || !selectedAop.opis) return false;
    const lowerCaseDescription = selectedAop.opis.toLowerCase();
    return lowerCaseDescription.includes('šifra') || lowerCaseDescription.includes('šifre');
  }, [selectedAop]);

  return (
    <>
      <BreadcrumbsAndTitle formType={formType} />
      <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto mt-2 lg:space-x-3 space-y-3 lg:space-y-0">
        <div className="flex-1 w-full overflow-x-auto lg:flex-[2_2_0%]">
          <AopTable
            aopData={aopData}
            selectedAop={selectedAop}
            onSelectAop={onSelectAop}
            onUpdateAop={onUpdateAop}
          />
        </div>
        <div className="flex-1 w-full overflow-x-auto lg:flex-[3_3_0%]">
          <DependentAccountsTable
            selectedAop={selectedAop}
            accountsData={dependentAccountsData[selectedAop?.aop || ''] || []}
            onUpdateAccount={onUpdateDependentAccount}
            onSetAccounts={onSetDependentAccountsForAop}
            allKorisnici={allKorisnici}
            onCopyAllDependentAccounts={onCopyAllDependentAccounts}
            isAopDescriptionRestricted={isAopDescriptionRestricted}
          />
        </div>
      </div>
    </>
  );
};

export default KatalogAopaPage;
