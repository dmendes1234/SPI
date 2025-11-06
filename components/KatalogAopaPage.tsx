
import React from 'react';
import BreadcrumbsAndTitle from './BreadcrumbsAndTitle';
import AopTable from './AopTable';
import DependentAccountsTable from './DependentAccountsTable';
import type { AopItem, DependentAccount } from '../types';

interface KatalogAopaPageProps {
  aopData: AopItem[];
  dependentAccountsData: {[key: string]: DependentAccount[]};
  selectedAop: AopItem | null;
  onSelectAop: (aop: AopItem) => void;
  onUpdateAop: (aop: AopItem) => void;
  onUpdateDependentAccount: (account: DependentAccount) => void;
  onSetDependentAccountsForAop: (accounts: Omit<DependentAccount, 'id'>[]) => void;
  allDependentAccountsData: {[key: string]: DependentAccount[]}; // New prop
  onCopyAllDependentAccounts: (selectedUserCodes: string[], allDependentAccounts: {[key: string]: DependentAccount[]}) => void; // New prop
}

const KatalogAopaPage: React.FC<KatalogAopaPageProps> = ({
  aopData,
  dependentAccountsData,
  selectedAop,
  onSelectAop,
  onUpdateAop,
  onUpdateDependentAccount,
  onSetDependentAccountsForAop,
  allDependentAccountsData, // Destructure new prop
  onCopyAllDependentAccounts // Destructure new prop
}) => {
  return (
    <>
      <BreadcrumbsAndTitle />
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
            allDependentAccountsData={allDependentAccountsData} // Pass new prop
            onCopyAllDependentAccounts={onCopyAllDependentAccounts} // Pass new prop
          />
        </div>
      </div>
    </>
  );
};

export default KatalogAopaPage;
