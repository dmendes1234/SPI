
import React from 'react';
import { HomeIcon } from '../constants';

interface SidebarProps {
  onToggleAppDrawer: () => void;
  onGoHome: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggleAppDrawer, onGoHome }) => {
  return (
    <aside className="w-12 bg-slate-800 text-white flex flex-col items-center justify-between py-2 shadow-lg">
      <div className="flex flex-col items-center space-y-4">
        <button type="button" onClick={onGoHome} className="p-2 rounded-md hover:bg-slate-700" aria-label="Početna">
          <HomeIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="flex flex-col items-center">
        <button type="button" onClick={onToggleAppDrawer} className="text-sm font-semibold p-2 rounded-md hover:bg-slate-700" aria-label="Sve aplikacije">
          SA
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
