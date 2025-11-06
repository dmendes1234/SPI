
import React from 'react';
import { HomeIcon, ListBulletIcon } from '../constants';

const BreadcrumbsAndTitle: React.FC = () => {
  return (
    <div className="bg-white p-3 shadow-sm border border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-gray-500">
            <HomeIcon className="h-5 w-5" />
            <span>&rsaquo;</span>
            <span>Računovodstvo proračuna</span>
            <span>&rsaquo;</span>
            <span className="text-gray-800 font-semibold">Katalog AOP-a</span>
        </div>
        <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-gray-600">PR-RAS</span>
            <button className="p-1 text-gray-600 hover:text-gray-800">
                <ListBulletIcon className="h-5 w-5" />
            </button>
        </div>
    </div>
  );
};

export default BreadcrumbsAndTitle;
