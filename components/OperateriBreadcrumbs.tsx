
import React from 'react';
import { HomeIcon } from '../constants';

const OperateriBreadcrumbs: React.FC = () => {
  return (
    <div className="bg-white p-3 shadow-sm border border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-gray-500">
            <HomeIcon className="h-5 w-5" />
            <span>&rsaquo;</span>
            <span>Zajedničke baze</span>
            <span>&rsaquo;</span>
            <span>Katalozi</span>
            <span>&rsaquo;</span>
            <span className="text-gray-800 font-semibold">Operateri</span>
        </div>
    </div>
  );
};

export default OperateriBreadcrumbs;
