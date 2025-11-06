
import React, { useState } from 'react';
import { Bars3Icon, HeartIcon, SearchIcon, UserIcon, ChevronDownIcon, XIcon, ChevronRightIcon } from '../constants';
import type { NavItem } from '../types';

interface HeaderProps {
  isNavOpen: boolean;
  setIsNavOpen: (isOpen: boolean) => void;
  setCurrentPage: (page: string) => void;
  onGoHome: () => void;
  navItems: NavItem[];
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


const Header: React.FC<HeaderProps> = ({ isNavOpen, setIsNavOpen, setCurrentPage, onGoHome, navItems }) => {
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
            <span className="hidden sm:block">Korisnik d. o. o. (01) - 2025.</span>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="hidden sm:flex items-center space-x-1 cursor-pointer p-2 rounded-md hover:bg-slate-600">
                    <UserIcon className="h-5 w-5" />
                    <span>Sistemski operater</span>
                    <ChevronDownIcon className="h-4 w-4" />
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