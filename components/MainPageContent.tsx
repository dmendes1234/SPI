
import React from 'react';
import { HomeIcon } from '../constants';

interface MainPageBreadcrumbsProps {
  appName: string;
}

const MainPageBreadcrumbs: React.FC<MainPageBreadcrumbsProps> = ({ appName }) => (
    <div className="bg-white p-3 shadow-sm border border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-gray-500">
            <HomeIcon className="h-5 w-5" />
            <span>&rsaquo;</span>
            <span className="text-gray-800 font-semibold">{appName}</span>
        </div>
    </div>
);

interface MainPageContentProps {
  appName: string;
}

const MainPageContent: React.FC<MainPageContentProps> = ({ appName }) => (
    <>
        <MainPageBreadcrumbs appName={appName} />
        <div className="flex-1 p-6 mt-3 bg-white border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Dobrodošli u aplikaciju</h2>
            <p className="text-4xl font-bold text-slate-700 mt-2">{appName}</p>
            <p className="mt-4 text-gray-600">Odaberite željenu opciju iz glavnog izbornika za početak rada.</p>
        </div>
    </>
);

export default MainPageContent;
