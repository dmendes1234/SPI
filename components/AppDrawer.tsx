
import React from 'react';

interface AppInfo {
  id: string;
  name: string;
}

interface AppDrawerProps {
    isOpen: boolean;
    onSelectApp: (app: AppInfo) => void;
    activeAppId: string | null;
    applications: AppInfo[];
}

const AppDrawer: React.FC<AppDrawerProps> = ({ isOpen, onSelectApp, activeAppId, applications }) => {

  return (
    <aside className={`bg-slate-800 text-white flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'w-64' : 'w-0'}`}>
        <div className="w-64 h-full overflow-y-auto">
            <div className="p-4">
                <h2 className="text-base font-semibold mb-2 text-gray-400">Sve aplikacije</h2>
                <nav>
                    <ul className="space-y-1">
                    {applications.map(app => (
                        <li key={app.id}>
                        <a 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            onSelectApp(app);
                          }} 
                          className={`flex items-center p-2 rounded-md text-sm ${app.id === activeAppId ? 'bg-slate-900' : 'hover:bg-slate-700'}`}
                        >
                            <span className="bg-slate-700 text-xs font-mono p-1 rounded-sm mr-3 w-10 text-center">{app.id}</span>
                            <span className="flex-1 truncate">{app.name}</span>
                        </a>
                        </li>
                    ))}
                    </ul>
                </nav>
            </div>
      </div>
    </aside>
  );
};

export default AppDrawer;
