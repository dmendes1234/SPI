import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AppDrawer from './components/AppDrawer';
import Footer from './components/Footer';
import MainPageContent from './components/MainPageContent';
import KatalogAopaPage from './components/KatalogAopaPage';
import KatalogOperateraPage from './components/KatalogOperateraPage';
import KatalogKorisnikaPage from './components/KatalogKorisnikaPage';
import PravaPristupaPage from './components/PravaPristupaPage';
import Toast from './components/Toast';
import LoginPage from './components/LoginPage';
import UserSelectionPage from './components/UserSelectionPage';
import InicijalnoPunjenjeAopaModal from './components/InicijalnoPunjenjeAopaModal';
import type { AopItem, DependentAccount, NavItem, Operator, Korisnik, PravaPristupa } from './types';
import { INITIAL_AOP_DATA, INITIAL_DEPENDENT_ACCOUNTS_DATA } from './constants';
import { defaultNavItems, app147NavItems, app099NavItems } from './data/navData';
import { PR_RAS_AOP_DATA, OBVEZE_AOP_DATA } from './data/aopData';

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
  { id: '151', name: 'SIP - Sustav izvješćivanja porezne uprave' },
  { id: '152', name: 'Kadrovska evidencija' },
  { id: '154', name: 'Nalozi za izravno terećenje (trajni nalo' },
  { id: '156', name: 'e-Računi' },
  { id: '192', name: 'Salda konti' },
  { id: '210', name: 'KOMIS - Komunalni informacijski sustav' },
  { id: '223', name: 'Uredsko poslovanje' },
  { id: '302', name: 'EVOK' },
];

function App() {
  const [activeApp, setActiveApp] = useState<AppInfo | null>(APPLICATIONS.find(app => app.id === '147') || null);
  const [currentPage, setCurrentPage] = useState('main');
  // State for PR-RAS
  const [allAopDataByKorisnik, setAllAopDataByKorisnik] = useState<{[korisnikId: string]: AopItem[]}>({});
  const [allDependentAccountsByKorisnik, setAllDependentAccountsByKorisnik] = useState<{[korisnikId: string]: {[aop: string]: DependentAccount[]}}>(
    {}
  );
  const [selectedAop, setSelectedAop] = useState<AopItem | null>(null);

  // New state for OBVEZE
  const [allAopDataObvezeByKorisnik, setAllAopDataObvezeByKorisnik] = useState<{[korisnikId: string]: AopItem[]}>({});
  const [allDependentAccountsObvezeByKorisnik, setAllDependentAccountsObvezeByKorisnik] = useState<{[korisnikId: string]: {[aop: string]: DependentAccount[]}}>(
    {}
  );
  const [selectedAopObveze, setSelectedAopObveze] = useState<AopItem | null>(null);
  
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [loggedInOperator, setLoggedInOperator] = useState<Operator | null>(null);
  const [selectedKorisnik, setSelectedKorisnik] = useState<Korisnik | null>(null);
  const [korisniciForSelection, setKorisniciForSelection] = useState<Korisnik[]>([]);
  const appDrawerContainerRef = useRef<HTMLDivElement>(null);
  const [operators, setOperators] = useState<Operator[]>([
    { id: '1', ime: 'Testni', prezime: 'Operater', korisnickoIme: 'test', lozinka: 'test123' }
  ]);
  const [korisnici, setKorisnici] = useState<Korisnik[]>([
    { id: '1', sifra: '01', naziv: 'Testni korisnik' },
    { id: '2', sifra: '02', naziv: 'Drugi korisnik' },
  ]);
  const [pravaPristupa, setPravaPristupa] = useState<PravaPristupa>({
    '1': ['1', '2'] // Initial assignment: operator '1' has access to user '1' and '2'
  });
  const [isInitAopModalOpen, setIsInitAopModalOpen] = useState(false);

  // Fix: Moved showToast definition before its usage to prevent "used before its declaration" error.
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Derived state for PR-RAS
  const currentAopData = useMemo(() => {
    if (!selectedKorisnik) return [];
    return allAopDataByKorisnik[selectedKorisnik.id] || [];
  }, [allAopDataByKorisnik, selectedKorisnik]);

  const currentDependentAccountsData = useMemo(() => {
    if (!selectedKorisnik) return {};
    return allDependentAccountsByKorisnik[selectedKorisnik.id] || {};
  }, [allDependentAccountsByKorisnik, selectedKorisnik]);

  // Derived state for OBVEZE
  const currentAopDataObveze = useMemo(() => {
    if (!selectedKorisnik) return [];
    return allAopDataObvezeByKorisnik[selectedKorisnik.id] || [];
  }, [allAopDataObvezeByKorisnik, selectedKorisnik]);

  const currentDependentAccountsDataObveze = useMemo(() => {
      if (!selectedKorisnik) return {};
      return allDependentAccountsObvezeByKorisnik[selectedKorisnik.id] || {};
  }, [allDependentAccountsObvezeByKorisnik, selectedKorisnik]);


  // Effect for PR-RAS data
  useEffect(() => {
    if (selectedKorisnik) {
      setAllAopDataByKorisnik(prev => {
        if (prev[selectedKorisnik.id] === undefined) {
          return { ...prev, [selectedKorisnik.id]: INITIAL_AOP_DATA };
        }
        return prev;
      });
      setAllDependentAccountsByKorisnik(prev => {
        if (prev[selectedKorisnik.id] === undefined) {
          return { ...prev, [selectedKorisnik.id]: INITIAL_DEPENDENT_ACCOUNTS_DATA };
        }
        return prev;
      });
      setSelectedAop(prev => {
        const currentUserAopData = allAopDataByKorisnik[selectedKorisnik.id] || INITIAL_AOP_DATA;
        if (!prev || !currentUserAopData.some(item => item.id === prev.id)) {
          return currentUserAopData[0] || null;
        }
        return prev;
      });
    } else {
      setSelectedAop(null);
    }
  }, [selectedKorisnik, allAopDataByKorisnik]);

  // Effect for OBVEZE data
  useEffect(() => {
    if (selectedKorisnik) {
      setAllAopDataObvezeByKorisnik(prev => {
        if (!prev[selectedKorisnik.id]) {
          return { ...prev, [selectedKorisnik.id]: [] };
        }
        return prev;
      });
      setAllDependentAccountsObvezeByKorisnik(prev => {
        if (!prev[selectedKorisnik.id]) {
          return { ...prev, [selectedKorisnik.id]: {} };
        }
        return prev;
      });
      setSelectedAopObveze(prev => {
        const newAopData = allAopDataObvezeByKorisnik[selectedKorisnik.id] || [];
        if (!prev || !newAopData.some(item => item.id === prev.id)) {
          return newAopData[0] || null;
        }
        return prev;
      });
    } else {
      setSelectedAopObveze(null);
    }
  }, [selectedKorisnik, allAopDataObvezeByKorisnik]);

  const handlePageChange = (page: string) => {
    if (page === 'inicijalno-punjenje-aopa') {
        setIsInitAopModalOpen(true);
    } else {
        setCurrentPage(page);
    }
  };

  const handleInicijalnoPunjenjeAopa = useCallback((selectedCatalogs: string[]) => {
      if (!selectedKorisnik) {
          showToast('Nije odabran korisnik.', 'error');
          return;
      }

      if (selectedCatalogs.includes('PR-RAS')) {
          setAllAopDataByKorisnik(prev => ({
              ...prev,
              [selectedKorisnik.id]: PR_RAS_AOP_DATA,
          }));
          setAllDependentAccountsByKorisnik(prev => ({
              ...prev,
              [selectedKorisnik.id]: {},
          }));
          setSelectedAop(PR_RAS_AOP_DATA[0] || null);
      }

      if (selectedCatalogs.includes('OBVEZE')) {
          setAllAopDataObvezeByKorisnik(prev => ({
              ...prev,
              [selectedKorisnik.id]: OBVEZE_AOP_DATA,
          }));
          setAllDependentAccountsObvezeByKorisnik(prev => ({
              ...prev,
              [selectedKorisnik.id]: {},
          }));
          setSelectedAopObveze(OBVEZE_AOP_DATA[0] || null);
      }

      showToast(`Katalozi uspješno inicijalno napunjeni: ${selectedCatalogs.join(', ')}.`, 'success');
      setIsInitAopModalOpen(false);
  }, [selectedKorisnik, showToast]);


  const navItems: NavItem[] = activeApp?.id === '147' 
    ? app147NavItems 
    : activeApp?.id === '099'
    ? app099NavItems
    : defaultNavItems;

  // Handlers for PR-RAS
  const handleUpdateAop = useCallback((updatedAop: AopItem) => {
    if (!selectedKorisnik) return;
    setAllAopDataByKorisnik(prev => {
        const currentUserAopData = prev[selectedKorisnik.id] || INITIAL_AOP_DATA;
        const updatedUserAopData = currentUserAopData.map(item => item.id === updatedAop.id ? updatedAop : item);
        return {
            ...prev,
            [selectedKorisnik.id]: updatedUserAopData,
        };
    });
    if (selectedAop?.id === updatedAop.id) {
      setSelectedAop(updatedAop);
    }
  }, [selectedKorisnik, selectedAop]);

  const handleSelectAop = useCallback((aop: AopItem) => {
    setSelectedAop(aop);
  }, []);

  const handleUpdateDependentAccount = useCallback((updatedAccount: DependentAccount) => {
    if (!selectedKorisnik || !selectedAop) return;
    setAllDependentAccountsByKorisnik(prev => {
        const currentUserDependentAccounts = prev[selectedKorisnik.id] || {};
        const accountsForCurrentAop = currentUserDependentAccounts[selectedAop.aop] as DependentAccount[] || [];

        const newAccounts = accountsForCurrentAop.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc);
        return {
            ...prev,
            [selectedKorisnik.id]: {
                ...currentUserDependentAccounts,
                [selectedAop.aop]: newAccounts,
            },
        };
    });
  }, [selectedKorisnik, selectedAop]);

  const handleSetDependentAccountsForAop = useCallback((accountsToSet: Omit<DependentAccount, 'id'>[]) => {
    if (!selectedKorisnik || !selectedAop) return;

    const newAccountsForAop: DependentAccount[] = accountsToSet.map((data, index) => ({
      ...data,
      id: `${selectedAop.aop}-${Date.now()}-${index}`,
    }));

    setAllDependentAccountsByKorisnik(prev => {
      const currentUserData = { ...prev[selectedKorisnik.id] };
      return {
        ...prev,
        [selectedKorisnik.id]: {
          ...currentUserData,
          [selectedAop.aop]: newAccountsForAop,
        },
      };
    });
  }, [selectedKorisnik, selectedAop]);
  
  const handleCopyAllDependentAccounts = useCallback((selectedTargetKorisnikIds: string[]) => {
    if (!selectedKorisnik) {
        showToast('Nije odabran izvor korisnika za kopiranje.', 'error');
        return;
    }

    const sourceDependentAccounts = allDependentAccountsByKorisnik[selectedKorisnik.id];

    if (!sourceDependentAccounts) {
        showToast('Nema zavisnih konta za kopiranje od trenutnog korisnika.', 'error');
        return;
    }

    const copiedToNames: string[] = [];
    setAllDependentAccountsByKorisnik(prevAll => {
        const newAll = { ...prevAll };
        for (const targetKorisnikId of selectedTargetKorisnikIds) {
            const targetKorisnik = korisnici.find(k => k.id === targetKorisnikId);
            if (targetKorisnik) {
                newAll[targetKorisnik.id] = Object.fromEntries(
                    Object.entries(sourceDependentAccounts).map(([aop, accounts]: [string, DependentAccount[]]) => 
                        [aop, accounts.map(acc => ({...acc, id: `${aop}-${Date.now()}-${Math.random()}`}))]
                    )
                );
                copiedToNames.push(targetKorisnik.naziv);
            }
        }
        return newAll;
    });

    if (copiedToNames.length > 0) {
        showToast(`Prijepis svih zavisnih konta uspješno obavljen na korisnike: ${copiedToNames.join(', ')}.`, 'success');
    } else {
        showToast('Nije odabran niti jedan korisnik za prijenos.', 'info');
    }
  }, [selectedKorisnik, allDependentAccountsByKorisnik, korisnici, showToast]);

  // Handlers for OBVEZE
  const handleUpdateAopObveze = useCallback((updatedAop: AopItem) => {
    if (!selectedKorisnik) return;
    setAllAopDataObvezeByKorisnik(prev => {
        const currentUserAopData = prev[selectedKorisnik.id] || [];
        const updatedUserAopData = currentUserAopData.map(item => item.id === updatedAop.id ? updatedAop : item);
        return {
            ...prev,
            [selectedKorisnik.id]: updatedUserAopData,
        };
    });
    if (selectedAopObveze?.id === updatedAop.id) {
      setSelectedAopObveze(updatedAop);
    }
  }, [selectedKorisnik, selectedAopObveze]);

  const handleSelectAopObveze = useCallback((aop: AopItem) => {
      setSelectedAopObveze(aop);
  }, []);

  const handleUpdateDependentAccountObveze = useCallback((updatedAccount: DependentAccount) => {
      if (!selectedKorisnik || !selectedAopObveze) return;
      setAllDependentAccountsObvezeByKorisnik(prev => {
          const currentUserDependentAccounts = prev[selectedKorisnik.id] || {};
          const accountsForCurrentAop = currentUserDependentAccounts[selectedAopObveze.aop] as DependentAccount[] || [];
          const newAccounts = accountsForCurrentAop.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc);
          return {
              ...prev,
              [selectedKorisnik.id]: {
                  ...currentUserDependentAccounts,
                  [selectedAopObveze.aop]: newAccounts,
              },
          };
      });
  }, [selectedKorisnik, selectedAopObveze]);

  const handleSetDependentAccountsForAopObveze = useCallback((accountsToSet: Omit<DependentAccount, 'id'>[]) => {
      if (!selectedKorisnik || !selectedAopObveze) return;
      const newAccountsForAop: DependentAccount[] = accountsToSet.map((data, index) => ({
        ...data,
        id: `${selectedAopObveze.aop}-${Date.now()}-${index}`,
      }));
      setAllDependentAccountsObvezeByKorisnik(prev => {
        const currentUserData = { ...prev[selectedKorisnik.id] };
        return {
          ...prev,
          [selectedKorisnik.id]: {
            ...currentUserData,
            [selectedAopObveze.aop]: newAccountsForAop,
          },
        };
      });
  }, [selectedKorisnik, selectedAopObveze]);

  const handleCopyAllDependentAccountsObveze = useCallback((selectedTargetKorisnikIds: string[]) => {
      if (!selectedKorisnik) {
          showToast('Nije odabran izvor korisnika za kopiranje.', 'error');
          return;
      }
      const sourceDependentAccounts = allDependentAccountsObvezeByKorisnik[selectedKorisnik.id];
      if (!sourceDependentAccounts) {
          showToast('Nema zavisnih konta za kopiranje od trenutnog korisnika.', 'error');
          return;
      }
      const copiedToNames: string[] = [];
      setAllDependentAccountsObvezeByKorisnik(prevAll => {
          const newAll = { ...prevAll };
          for (const targetKorisnikId of selectedTargetKorisnikIds) {
              const targetKorisnik = korisnici.find(k => k.id === targetKorisnikId);
              if (targetKorisnik) {
                  newAll[targetKorisnik.id] = Object.fromEntries(
                      Object.entries(sourceDependentAccounts).map(([aop, accounts]: [string, DependentAccount[]]) => 
                          [aop, accounts.map(acc => ({...acc, id: `${aop}-${Date.now()}-${Math.random()}`}))]
                      )
                  );
                  copiedToNames.push(targetKorisnik.naziv);
              }
          }
          return newAll;
      });
      if (copiedToNames.length > 0) {
          showToast(`Prijepis svih zavisnih konta uspješno obavljen na korisnike: ${copiedToNames.join(', ')}.`, 'success');
      } else {
          showToast('Nije odabran niti jedan korisnik za prijenos.', 'info');
      }
  }, [selectedKorisnik, allDependentAccountsObvezeByKorisnik, korisnici, showToast]);

  const handleSelectApp = (appInfo: AppInfo) => {
    setActiveApp(appInfo);
    setCurrentPage('main');
    setIsAppDrawerOpen(false);
  };
  
  const handleGoHome = () => {
    setActiveApp(null);
    setCurrentPage('main');
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
    setPravaPristupa(prev => {
        const newPrava = {...prev};
        delete newPrava[operatorId];
        return newPrava;
    });
    showToast('Operater uspješno obrisan.', 'success');
  };

  const handleAddKorisnik = (korisnik: Omit<Korisnik, 'id'>) => {
    const newKorisnik = { ...korisnik, id: Date.now().toString() };
    setKorisnici(prev => [...prev, newKorisnik]);
    showToast('Novi korisnik uspješno dodan.', 'success');
  };

  const handleUpdateKorisnik = (updatedKorisnik: Korisnik) => {
    setKorisnici(prev => prev.map(k => k.id === updatedKorisnik.id ? updatedKorisnik : k));
    showToast('Podaci o korisniku uspješno ažurirani.', 'success');
  };

  const handleDeleteKorisnik = (korisnikId: string) => {
    if (korisnici.length <= 1) {
        showToast('Nije moguće obrisati zadnjeg korisnika.', 'error');
        return;
    }
    setKorisnici(prev => prev.filter(k => k.id !== korisnikId));
    setPravaPristupa(prev => {
        const newPrava = {...prev};
        for (const operatorId in newPrava) {
            newPrava[operatorId] = newPrava[operatorId].filter(kId => kId !== korisnikId);
        }
        return newPrava;
    });
    setAllAopDataByKorisnik(prev => {
        const newAopData = {...prev};
        delete newAopData[korisnikId];
        return newAopData;
    });
    setAllDependentAccountsByKorisnik(prev => {
        const newDepAccData = {...prev};
        delete newDepAccData[korisnikId];
        return newDepAccData;
    });
    setAllAopDataObvezeByKorisnik(prev => {
        const newAopData = {...prev};
        delete newAopData[korisnikId];
        return newAopData;
    });
    setAllDependentAccountsObvezeByKorisnik(prev => {
        const newDepAccData = {...prev};
        delete newDepAccData[korisnikId];
        return newDepAccData;
    });
    showToast('Korisnik uspješno obrisan.', 'success');
  };

  const handleSavePravaPristupa = (operatorId: string, korisnikIds: string[]) => {
    setPravaPristupa(prev => ({
      ...prev,
      [operatorId]: korisnikIds,
    }));
  };

  const handleLogout = useCallback(() => {
    setLoggedInOperator(null);
    setSelectedKorisnik(null);
    setKorisniciForSelection([]);
  }, []);

  const handleLogin = (username: string, password_input: string) => {
    const operator = operators.find(op => op.korisnickoIme === username && op.lozinka === password_input);
    if (operator) {
      const assignedKorisnikIds = pravaPristupa[operator.id] || [];
      const assignedKorisnici = korisnici.filter(k => assignedKorisnikIds.includes(k.id));

      if (assignedKorisnici.length === 0) {
        showToast('Nemate dodijeljenog niti jednog korisnika.', 'error');
        return;
      }

      setLoggedInOperator(operator);

      if (assignedKorisnici.length === 1) {
        setSelectedKorisnik(assignedKorisnici[0]);
        showToast('Prijava uspješna!', 'success');
      } else {
        setKorisniciForSelection(assignedKorisnici);
      }
    } else {
      showToast('Neispravno korisničko ime ili lozinka.', 'error');
    }
  };
  
  const handleSelectKorisnik = (korisnik: Korisnik) => {
    setSelectedKorisnik(korisnik);
    setKorisniciForSelection([]);
    showToast(`Prijavljeni kao korisnik: ${korisnik.naziv} (${korisnik.sifra})`, 'success');
  };

  const handleManualLogout = useCallback(() => {
    handleLogout();
    showToast('Odjavljeni ste.', 'info');
  }, [showToast, handleLogout]);

  const handleInactivityLogout = useCallback(() => {
    handleLogout();
    showToast('Odjavljeni ste zbog neaktivnosti.', 'info');
  }, [showToast, handleLogout]);

  const handleSwitchUserRequest = useCallback(() => {
    if (loggedInOperator) {
      const assignedKorisnikIds = pravaPristupa[loggedInOperator.id] || [];
      const assignedKorisnici = korisnici.filter(k => assignedKorisnikIds.includes(k.id));
      setSelectedKorisnik(null);
      setKorisniciForSelection(assignedKorisnici);
      showToast('Odaberite novog korisnika.', 'info');
    }
  }, [loggedInOperator, pravaPristupa, korisnici, showToast]);

  useEffect(() => {
    if (!loggedInOperator || !selectedKorisnik) {
      return;
    }

    let inactivityTimer: number;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(handleInactivityLogout, 60000);
    };

    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [loggedInOperator, selectedKorisnik, handleInactivityLogout]);

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

  if (!selectedKorisnik && korisniciForSelection.length > 0) {
    return (
      <>
        <UserSelectionPage
          users={korisniciForSelection}
          onSelectUser={handleSelectKorisnik}
          onLogout={handleManualLogout}
          operatorName={loggedInOperator.ime ? `${loggedInOperator.ime} ${loggedInOperator.prezime}` : ''}
        />
        {toastMessage && (
          <Toast 
            message={toastMessage.message} 
            type={toastMessage.type} 
            onClose={() => setToastMessage(null)} 
          />
        )}
      </>
    );
  }

  if (loggedInOperator && selectedKorisnik) {
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
            setCurrentPage={handlePageChange}
            onGoHome={handleGoHome}
            navItems={navItems}
            onLogout={handleManualLogout}
            loggedInOperator={loggedInOperator}
            selectedKorisnik={selectedKorisnik}
            allKorisnici={korisnici}
            onSwitchUserRequest={handleSwitchUserRequest}
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
                formType="PR-RAS"
                aopData={currentAopData}
                dependentAccountsData={currentDependentAccountsData}
                selectedAop={selectedAop}
                onSelectAop={handleSelectAop}
                onUpdateAop={handleUpdateAop}
                onUpdateDependentAccount={handleUpdateDependentAccount}
                onSetDependentAccountsForAop={handleSetDependentAccountsForAop}
                allKorisnici={korisnici}
                onCopyAllDependentAccounts={handleCopyAllDependentAccounts}
              />
            )}
            {currentPage === 'katalog-aopa-obveze' && activeApp?.id === '147' && (
              <KatalogAopaPage
                formType="OBVEZE"
                aopData={currentAopDataObveze}
                dependentAccountsData={currentDependentAccountsDataObveze}
                selectedAop={selectedAopObveze}
                onSelectAop={handleSelectAopObveze}
                onUpdateAop={handleUpdateAopObveze}
                onUpdateDependentAccount={handleUpdateDependentAccountObveze}
                onSetDependentAccountsForAop={handleSetDependentAccountsForAopObveze}
                allKorisnici={korisnici}
                onCopyAllDependentAccounts={handleCopyAllDependentAccountsObveze}
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
            {currentPage === 'katalog-korisnika' && activeApp?.id === '099' && (
              <KatalogKorisnikaPage
                korisnici={korisnici}
                onAddKorisnik={handleAddKorisnik}
                onUpdateKorisnik={handleUpdateKorisnik}
                onDeleteKorisnik={handleDeleteKorisnik}
              />
            )}
            {currentPage === 'prava-pristupa' && activeApp?.id === '099' && (
              <PravaPristupaPage
                operators={operators}
                korisnici={korisnici}
                pravaPristupa={pravaPristupa}
                onSave={handleSavePravaPristupa}
                showToast={showToast}
              />
            )}
          </div>
          <Footer />
        </div>
        {isInitAopModalOpen && (
            <InicijalnoPunjenjeAopaModal
                isOpen={isInitAopModalOpen}
                onClose={() => setIsInitAopModalOpen(false)}
                onConfirm={handleInicijalnoPunjenjeAopa}
            />
        )}
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

export default App;