
import React, { useState, useRef, useEffect } from 'react';
import { Bars3Icon, HeartIcon, SearchIcon, UserIcon, ChevronDownIcon, XIcon, ChevronRightIcon } from '../constants';
import type { NavItem, Operator, Korisnik } from '../types';

interface HeaderProps {
  isNavOpen: boolean;
  setIsNavOpen: (isOpen: boolean) => void;
  setCurrentPage: (page: string) => void;
  onGoHome: () => void;
  navItems: NavItem[];
  onLogout: () => void;
  loggedInOperator: Operator | null;
  selectedKorisnik: Korisnik | null;
  allKorisnici: Korisnik[]; // New prop: all available users
  onSwitchUserRequest: () => void; // New prop: callback to initiate user switch
}

const DropdownMenu: React.FC<{ items: NavItem[]; setCurrentPage: (page: string) => void; closeMenus: () => void; level?: number }> = ({ items, setCurrentPage, closeMenus, level = 0 }) => {
    const menuPosition = level === 0 
        ? "absolute top-full left-0 mt-0"
        : "absolute top-0 left-full -ml-1";

    return (
        <div className={`${menuPosition} bg-slate-700 rounded-md shadow-lg py-1 w-56 ring-1 ring-black ring-opacity-5 hidden group-hover:block`}>
            {items.map((item) => (
                <div key={item.label} className="relative group">
                    <a 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            if (item.page) {
                                setCurrentPage(item.page);
                                closeMenus();
                            }
                        }}
                        className="flex justify-between items-center px-3 py-2 text-sm text-white hover:bg-slate-600 rounded-md mx-1"
                    >
                        <span>{item.label}</span>
                        {item.children && <ChevronRightIcon className="h-4 w-4" />}
                    </a>
                    {item.children && (
                        <DropdownMenu items={item.children} setCurrentPage={setCurrentPage} closeMenus={closeMenus} level={level + 1} />
                    )}
                </div>
            ))}
        </div>
    );
};


const MobileNavItem: React.FC<{ item: NavItem; setCurrentPage: (page: string) => void; setIsNavOpen: (isOpen: boolean) => void; }> = ({ item, setCurrentPage, setIsNavOpen }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        if (item.children) {
            setIsOpen(!isOpen);
        } else if (item.page) {
            setCurrentPage(item.page);
            setIsNavOpen(false);
        } else {
            // It's a top-level item with no action, just close the menu if clicked
            setIsNavOpen(false);
        }
    };

    return (
        <div>
            <a 
                href="#"
                onClick={(e) => { e.preventDefault(); handleClick(); }}
                className="flex justify-between items-center px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 transition-colors"
            >
                <span>{item.label}</span>
                {item.children && <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
            </a>
            {isOpen && item.children && (
                <div className="pl-4 border-l-2 border-slate-600">
                    {item.children.map(child => <MobileNavItem key={child.label} item={child} setCurrentPage={setCurrentPage} setIsNavOpen={setIsNavOpen} />)}
                </div>
            )}
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ isNavOpen, setIsNavOpen, setCurrentPage, onGoHome, navItems, onLogout, loggedInOperator, selectedKorisnik, allKorisnici, onSwitchUserRequest }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="bg-slate-700 text-white shadow-md relative z-30">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-1 sm:space-x-4">
            <h1 className="text-xl font-bold cursor-pointer" onClick={onGoHome}>SPI®</h1>
            <button className="p-2 rounded-md hover:bg-slate-600 md:hidden" onClick={() => setIsNavOpen(true)} aria-label="Open menu">
              <Bars3Icon className="h-6 w-6" />
            </button>
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                <div 
                    key={item.label} 
                    className="relative group"
                >
                  <a href="#" onClick={(e) => {e.preventDefault(); if (item.page) setCurrentPage(item.page)}} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-600 transition-colors flex items-center">
                    {item.label}
                    {item.children && <ChevronDownIcon className="h-4 w-4 ml-1" />}
                  </a>
                  {item.children && (
                    <DropdownMenu items={item.children} setCurrentPage={setCurrentPage} closeMenus={() => {}} />
                  )}
                </div>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 text-xs">
            {selectedKorisnik && (
                <span className="hidden sm:block">{selectedKorisnik.naziv} ({selectedKorisnik.sifra}) - 2025.</span>
            )}
            <div className="flex items-center space-x-2 sm:space-x-4">
                <div ref={userDropdownRef} className="relative">
                    <button 
                        onClick={() => setUserDropdownOpen(prev => !prev)} 
                        className="flex items-center space-x-1 cursor-pointer p-2 rounded-md hover:bg-slate-600 focus:outline-none"
                        aria-haspopup="true"
                        aria-expanded={userDropdownOpen}
                        id="user-menu-button"
                    >
                        <UserIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">{loggedInOperator ? `${loggedInOperator.ime} ${loggedInOperator.prezime}` : 'Korisnik'}</span>
                        <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    {userDropdownOpen && (
                        <div 
                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none" 
                            role="menu" 
                            aria-orientation="vertical" 
                            aria-labelledby="user-menu-button"
                        >
                            {selectedKorisnik && (
                                <>
                                    <div className="block px-3 py-2 text-sm text-white font-semibold md:hidden" role="menuitem">
                                        Trenutni korisnik:
                                        <div className="text-gray-200">{selectedKorisnik.naziv} ({selectedKorisnik.sifra})</div>
                                    </div>
                                    <hr className="my-1 border-gray-600 md:hidden" />
                                </>
                            )}
                             <a 
                                href="#" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSwitchUserRequest(); // Call new handler
                                    setUserDropdownOpen(false);
                                }} 
                                className="block px-3 py-2 text-sm text-white hover:bg-slate-600 rounded-md mx-1"
                                role="menuitem"
                            >
                                Promijeni korisnika
                            </a>
                            <a
                                href="#" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    onLogout();
                                    setUserDropdownOpen(false);
                                }} 
                                className="block px-3 py-2 text-sm text-white hover:bg-slate-600 rounded-md mx-1"
                                role="menuitem"
                            >
                                Odjava
                            </a>
                        </div>
                    )}
                </div>
                <button className="p-2 rounded-md hover:bg-slate-600" aria-label="Favorites">
                    <HeartIcon className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-md hover:bg-slate-600" aria-label="Search">
                    <SearchIcon className="h-5 w-5" />
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-in-out ${isNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsNavOpen(false)} aria-hidden="true"></div>
        
        {/* Sidebar */}
        <div className={`relative bg-slate-800 w-64 h-full shadow-lg transform transition-transform ease-in-out duration-300 ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 flex justify-between items-center border-b border-slate-700">
            <h2 className="text-lg font-bold">Izbornik</h2>
            <button onClick={() => setIsNavOpen(false)} className="p-2 rounded-md hover:bg-slate-700" aria-label="Close menu">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col p-4 space-y-1">
             {navItems.map(item => (
              <MobileNavItem key={item.label} item={item} setCurrentPage={setCurrentPage} setIsNavOpen={setIsNavOpen} />
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
