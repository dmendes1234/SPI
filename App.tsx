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

async function apiFetch(url: string, options?: RequestInit) {
    const response = await fetch(url, options);

    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP greška! Status: ${response.status}`);
        } catch (e) {
            throw new Error(`HTTP greška! Status: ${response.status} ${response.statusText}`);
        }
    }
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return null;
}


function App() {
  const [activeApp, setActiveApp] = useState<AppInfo | null>(APPLICATIONS.find(app => app.id === '147') || null);
  const [currentPage, setCurrentPage] = useState('main');
  const [aopData, setAopData] = useState<AopItem[]>([]);
  const [dependentAccountsData, setDependentAccountsData] = useState<{[key: string]: DependentAccount[]}>({});
  const [selectedAop, setSelectedAop] = useState<AopItem | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [loggedInOperator, setLoggedInOperator] = useState<Operator | null>(null);
  const appDrawerContainerRef = useRef<HTMLDivElement>(null);
  const [operators, setOperators] = useState<Operator[]>([]);

  const API_BASE_URL = '/api';

  const navItems: NavItem[] = activeApp?.id === '147' 
    ? app147NavItems 
    : activeApp?.id === '099'
    ? app099NavItems
    : defaultNavItems;

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 5000); // Increased timeout to 5 seconds for better readability
  }, []);

  const fetchOperators = useCallback(async () => {
    try {
      const data = await apiFetch(`${API_BASE_URL}/operators`);
      setOperators(data || []);
    } catch (error) {
      showToast((error as Error).message || 'Greška pri dohvaćanju operatera.', 'error');
      console.error(error);
    }
  }, [showToast]);

  const fetchAopData = useCallback(async () => {
    try {
      const data = await apiFetch(`${API_BASE_URL}/aop`);
      setAopData(data || []);
      if (!selectedAop && data && data.length > 0) {
        setSelectedAop(data.find((item: AopItem) => item.id === 4) || data[0]);
      }
    } catch (error) {
      showToast((error as Error).message || 'Greška pri dohvaćanju AOP stavki.', 'error');
      console.error(error);
    }
  }, [showToast, selectedAop]);

  const fetchDependentAccounts = useCallback(async () => {
    try {
      const data = await apiFetch(`${API_BASE_URL}/dependent-accounts`);
      setDependentAccountsData(data || {});
    } catch (error) {
      showToast((error as Error).message || 'Greška pri dohvaćanju zavisnih konta.', 'error');
      console.error(error);
    }
  }, [showToast]);


  useEffect(() => {
    if (loggedInOperator) {
      fetchOperators();
      fetchAopData();
      fetchDependentAccounts();
    }
  }, [loggedInOperator, fetchOperators, fetchAopData, fetchDependentAccounts]);

  const handleUpdateAop = async (updatedAop: AopItem) => {
    try {
      await apiFetch(`${API_BASE_URL}/aop`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAop)
      });
      setAopData(prevData => prevData.map(item => item.id === updatedAop.id ? updatedAop : item));
      if (selectedAop?.id === updatedAop.id) {
        setSelectedAop(updatedAop);
      }
      showToast('AOP stavka ažurirana.', 'success');
    } catch (error) {
      showToast((error as Error).message || 'Greška pri ažuriranju AOP stavke.', 'error');
    }
  };

  const handleUpdateDependentAccount = async (updatedAccount: DependentAccount) => {
    if (!selectedAop) return;
     try {
        await apiFetch(`${API_BASE_URL}/dependent-accounts`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aop: selectedAop.aop, ...updatedAccount })
        });
        await fetchDependentAccounts();
        showToast('Zavisni konto ažuriran.', 'success');
    } catch(error) {
        showToast((error as Error).message || 'Greška pri ažuriranju zavisnog konta.', 'error');
    }
  };

  const handleSetDependentAccountsForAop = async (accountsToSet: Omit<DependentAccount, 'id'>[]) => {
    if (!selectedAop) return;
    try {
        await apiFetch(`${API_BASE_URL}/dependent-accounts`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aop: selectedAop.aop, accounts: accountsToSet })
        });
        await fetchDependentAccounts();
        showToast('Zavisna konta uspješno spremljena.', 'success');
    } catch(error) {
        showToast((error as Error).message || 'Greška pri spremanju zavisnih konta.', 'error');
    }
  };

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
    const message = `Prijepis svih zavisnih konta uspješno obavljen na korisnike: ${userNames.join(', ')}.`;
    showToast(message, 'success');
  };
  
  const handleAddOperator = async (operator: Omit<Operator, 'id'>) => {
    try {
      await apiFetch(`${API_BASE_URL}/operators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operator)
      });
      await fetchOperators();
      showToast('Novi operater uspješno dodan.', 'success');
    } catch (error) {
      showToast((error as Error).message || 'Greška pri dodavanju operatera.', 'error');
    }
  };

  const handleUpdateOperator = async (updatedOperatorData: Operator & { trenutnaLozinka?: string }) => {
    try {
      const updatedOperator = await apiFetch(`${API_BASE_URL}/operators`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOperatorData)
      });
      await fetchOperators();
      
      if (loggedInOperator && updatedOperator && loggedInOperator.id === updatedOperator.id) {
        setLoggedInOperator(prev => ({...prev, ...updatedOperator}));
      }
      showToast('Podaci o operateru uspješno ažurirani.', 'success');
    } catch (error: any) {
      showToast(error.message || 'Greška pri ažuriranju operatera.', 'error');
    }
  };

  const handleDeleteOperator = async (operatorId: string) => {
    try {
      await apiFetch(`${API_BASE_URL}/operators?id=${operatorId}`, {
        method: 'DELETE'
      });
      await fetchOperators();
      showToast('Operater uspješno obrisan.', 'success');
    } catch (error: any) {
      showToast(error.message || 'Greška pri brisanju operatera.', 'error');
    }
  };


  const handleLogin = async (username: string, password_input: string) => {
    const user = await apiFetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: password_input })
    });
    setLoggedInOperator(user);
    showToast('Prijava uspješna!', 'success');
  };

  const handleLogout = useCallback(() => {
    setLoggedInOperator(null);
    setAopData([]);
    setDependentAccountsData({});
    setOperators([]);
    setSelectedAop(null);
    setCurrentPage('main');
    setActiveApp(APPLICATIONS.find(app => app.id === '147') || null);
  }, []);

  const handleManualLogout = useCallback(() => {
    handleLogout();
    showToast('Odjavljeni ste.', 'info');
  }, [handleLogout, showToast]);

  const handleInactivityLogout = useCallback(() => {
    handleLogout();
    showToast('Odjavljeni ste zbog neaktivnosti.', 'info');
  }, [handleLogout, showToast]);

  useEffect(() => {
    if (!loggedInOperator) {
      return;
    }

    let inactivityTimer: number;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(handleInactivityLogout, 600000); // 10 minutes timeout
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
        <LoginPage onLogin={handleLogin} showToast={showToast} />
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