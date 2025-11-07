
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AppDrawer from './components/AppDrawer';
import Footer from './components/Footer';
import MainPageContent from './components/MainPageContent';
import KatalogAopaPage from './components/KatalogAopaPage';
import KatalogOperateraPage from './components/KatalogOperateraPage'; // New
import Toast from './components/Toast'; // Import Toast component
import LoginPage from './components/LoginPage'; // Import LoginPage
import type { AopItem, DependentAccount, NavItem, Operator } from './types';
import { INITIAL_AOP_DATA, INITIAL_DEPENDENT_ACCOUNTS_DATA } from './constants';
import { defaultNavItems, app147NavItems, app099NavItems } from './data/navData';

interface AppInfo {
  id: string;
  name: string;
}

const APPLICATIONS: AppInfo[] = [
  { id: '099', name: 'Zajedničke baze' },
  { id: '100', name: 'Prijenosi početnih stanja' },
  { id: '105', name: 'Fakturiranje' },
  { id: '110', name: 'Blagajna' },
  { id: '111', name: 'Samostalna blagajna' },
  { id: '115', name: 'Fakturiranje usluga odgojnih i obrazovni' },
  { id: '117', name: 'Glavna knjiga - Profitno' },
  { id: '135', name: 'Praćenje projekata' },
  { id: '147', name: 'Računovodstvo proračuna' },
  { id: '150', name: 'Plaće i naknade' },
  { id: '151', name: 'SIP - Sustav izvješćivanja porezne uprav' },
  { id: '152', name: 'Kadrovska evidencija' },
  { id: '154', name: 'Nalozi za izravno terećenje (trajni nalo' },
  { id: '156', name: 'e-Računi' },
  { id: '192', name: 'Salda konti' },
  { id: '210', name: 'KOMIS - Komunalni informacijski sustav' },
  { id: '223', name: 'Uredsko poslovanje' },
  { id: '302', name: 'EVOK' },
];

// Hardcoded users for the CopyUsersModal alert message
const APP_USERS_FOR_COPY = [
  { sifra: '01', naziv: 'Korisnik d.o.o.' },
  { sifra: '02', naziv: 'Testni korisnik' },
];

function App() {
  const [activeApp, setActiveApp] = useState<AppInfo | null>(APPLICATIONS.find(app => app.id === '147') || null);
  const [currentPage, setCurrentPage] = useState('main');
  const [aopData, setAopData] = useState<AopItem[]>(INITIAL_AOP_DATA);
  const [dependentAccountsData, setDependentAccountsData] = useState<{[key: string]: DependentAccount[]}>(INITIAL_DEPENDENT_ACCOUNTS_DATA);
  const [selectedAop, setSelectedAop] = useState<AopItem | null>(aopData.find(item => item.id === 4) || aopData[0]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [loggedInOperator, setLoggedInOperator] = useState<Operator | null>(null);
  const appDrawerContainerRef = useRef<HTMLDivElement>(null);
  const [operators, setOperators] = useState<Operator[]>([
    { id: '1', ime: 'Testni', prezime: 'Operater', korisnickoIme: 'test', lozinka: 'test123' }
  ]);


  const navItems: NavItem[] = activeApp?.id === '147' 
    ? app147NavItems 
    : activeApp?.id === '099'
    ? app099NavItems
    : defaultNavItems;

  const handleUpdateAop = (updatedAop: AopItem) => {
    setAopData(prevData => prevData.map(item => item.id === updatedAop.id ? updatedAop : item));
    if (selectedAop?.id === updatedAop.id) {
      setSelectedAop(updatedAop);
    }
  };

  const handleUpdateDependentAccount = (updatedAccount: DependentAccount) => {
    if (!selectedAop) return;
    setDependentAccountsData(prevData => {
        const newAccounts = (prevData[selectedAop.aop] || []).map(acc => acc.id === updatedAccount.id ? updatedAccount : acc);
        return {
            ...prevData,
            [selectedAop.aop]: newAccounts,
        };
    });
  };

  const handleSetDependentAccountsForAop = (accountsToSet: Omit<DependentAccount, 'id'>[]) => {
    if (!selectedAop) return;

    const newAccountsForAop: DependentAccount[] = accountsToSet.map((data, index) => ({
      ...data,
      id: `${selectedAop.aop}-${Date.now()}-${index}`,
    }));

    setDependentAccountsData(prevData => {
      return {
        ...prevData,
        [selectedAop.aop]: newAccountsForAop,
      };
    });
  };

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000); // Hide toast after 3 seconds
  }, []);

  const handleSelectApp = (appInfo: AppInfo) => {
    setActiveApp(appInfo);
    setCurrentPage('main');
    setIsAppDrawerOpen(false);
  };
  
  const handleGoHome = () => {
    setActiveApp(null);
    setCurrentPage('main');
  };

  const handleCopyAllDependentAccounts = (selectedUserCodes: string[], allDependentAccounts: {[key: string]: DependentAccount[]}) => {
    const userNames = APP_USERS_FOR_COPY.filter(user => selectedUserCodes.includes(user.sifra)).map(user => user.naziv);
    // Simulating the data being copied without actually modifying state
    const message = `Prijepis svih zavisnih konta uspješno obavljen na korisnike: ${userNames.join(', ')}.`;
    showToast(message, 'success');
  };
  
  const handleAddOperator = (operator: Omit<Operator, 'id'>) => {
    const newOperator = { ...operator, id: Date.now().toString() };
    setOperators(prev => [...prev, newOperator]);
    showToast('Novi operater uspješno dodan.', 'success');
  };

  const handleUpdateOperator = (updatedOperator: Operator) => {
    setOperators(prev => prev.map(op => op.id === updatedOperator.id ? updatedOperator : op));
    if (loggedInOperator && loggedInOperator.id === updatedOperator.id) {
      setLoggedInOperator(updatedOperator);
    }
    showToast('Podaci o operateru uspješno ažurirani.', 'success');
  };

  const handleDeleteOperator = (operatorId: string) => {
    if (operators.length <= 1) {
        showToast('Nije moguće obrisati zadnjeg operatera.', 'error');
        return;
    }
    setOperators(prev => prev.filter(op => op.id !== operatorId));
    showToast('Operater uspješno obrisan.', 'success');
  };


  const handleLogin = (username: string, password_input: string) => {
    const user = operators.find(op => op.korisnickoIme === username && op.lozinka === password_input);
    if (user) {
      setLoggedInOperator(user);
      showToast('Prijava uspješna!', 'success');
    } else {
      showToast('Neispravno korisničko ime ili lozinka.', 'error');
    }
  };

  const handleManualLogout = useCallback(() => {
    setLoggedInOperator(null);
    showToast('Odjavljeni ste.', 'info');
  }, [showToast]);

  const handleInactivityLogout = useCallback(() => {
    setLoggedInOperator(null);
    showToast('Odjavljeni ste zbog neaktivnosti.', 'info');
  }, [showToast]);

  useEffect(() => {
    if (!loggedInOperator) {
      return;
    }

    let inactivityTimer: number;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(handleInactivityLogout, 60000); // 1 minute timeout
    };

    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // Start the timer on login

    // Cleanup function
    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [loggedInOperator, handleInactivityLogout]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isAppDrawerOpen && appDrawerContainerRef.current && !appDrawerContainerRef.current.contains(event.target as Node)) {
        setIsAppDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAppDrawerOpen]);


  if (!loggedInOperator) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 p-4">
        <LoginPage onLogin={handleLogin} />
        {toastMessage && (
          <Toast 
            message={toastMessage.message} 
            type={toastMessage.type} 
            onClose={() => setToastMessage(null)} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-gray-800 font-sans text-sm">
      <div ref={appDrawerContainerRef} className="flex flex-shrink-0">
        <Sidebar onToggleAppDrawer={() => setIsAppDrawerOpen(prev => !prev)} onGoHome={handleGoHome} />
        <AppDrawer 
          isOpen={isAppDrawerOpen} 
          onSelectApp={handleSelectApp}
          activeAppId={activeApp?.id || null}
          applications={APPLICATIONS}
        />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          isNavOpen={isNavOpen} 
          setIsNavOpen={setIsNavOpen} 
          setCurrentPage={setCurrentPage}
          onGoHome={handleGoHome}
          navItems={navItems}
          onLogout={handleManualLogout}
          loggedInOperator={loggedInOperator}
        />
        <div className="flex-1 flex flex-col overflow-y-auto p-3 bg-gray-100">
          {!activeApp && (
             <div className="flex-1 p-6 bg-white border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                <h2 className="text-2xl font-semibold text-gray-800">Dobrodošli u SPI® aplikacije</h2>
                <p className="mt-4 text-gray-600">Odaberite aplikaciju iz izbornika 'Sve aplikacije' za početak rada.</p>
            </div>
          )}
          {currentPage === 'main' && activeApp && <MainPageContent appName={activeApp.name} />}
          {currentPage === 'katalog-aopa' && activeApp?.id === '147' && (
            <KatalogAopaPage
              aopData={aopData}
              dependentAccountsData={dependentAccountsData}
              selectedAop={selectedAop}
              onSelectAop={setSelectedAop}
              onUpdateAop={handleUpdateAop}
              // Fix: Corrected typo. The value passed to onUpdateDependentAccount should be the handler function 'handleUpdateDependentAccount'.
              onUpdateDependentAccount={handleUpdateDependentAccount}
              onSetDependentAccountsForAop={handleSetDependentAccountsForAop}
              allDependentAccountsData={dependentAccountsData}
              onCopyAllDependentAccounts={handleCopyAllDependentAccounts}
            />
          )}
          {currentPage === 'katalog-operatera' && activeApp?.id === '099' && (
            <KatalogOperateraPage
              operators={operators}
              onAddOperator={handleAddOperator}
              // Fix: Corrected typo. The value passed to onUpdateOperator should be the handler function 'handleUpdateOperator'.
              onUpdateOperator={handleUpdateOperator}
              onDeleteOperator={handleDeleteOperator}
            />
          )}
        </div>
        <Footer />
      </div>
      {toastMessage && (
        <Toast 
          message={toastMessage.message} 
          type={toastMessage.type} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
}

export default App;
