import React, { useState, useMemo } from 'react';
import type { AopItem } from '../types';
import Toolbar from './Toolbar';
import { RefreshIcon, SaveIcon, ExcelIcon } from '../constants';
import ContextMenu from './ContextMenu';
import Modal from './Modal';

interface AopTableProps {
  aopData: AopItem[];
  selectedAop: AopItem | null;
  onSelectAop: (aop: AopItem) => void;
  onUpdateAop: (aop: AopItem) => void;
}

interface TableFilterInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ariaLabel: string;
}

const TableFilterInput: React.FC<TableFilterInputProps> = ({ value, onChange, ariaLabel }) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full text-xs p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white"
        aria-label={ariaLabel}
    />
);

const AopTable: React.FC<AopTableProps> = ({ aopData, selectedAop, onSelectAop, onUpdateAop }) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: AopItem } | null>(null);
  
  const [filters, setFilters] = useState({ rbr: '', aop: '', opis: '' });

  const toolbarActions = [
    { label: 'Osvježi', icon: <RefreshIcon /> },
    { label: 'Spremi pretragu', icon: <SaveIcon /> },
    { label: 'Preuzmi u Excel-u', icon: <ExcelIcon /> },
  ];

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredAopData = useMemo(() => {
    return aopData.filter(item =>
        String(item.rbr).toLowerCase().includes(filters.rbr.toLowerCase()) &&
        item.aop.toLowerCase().includes(filters.aop.toLowerCase()) &&
        item.opis.toLowerCase().includes(filters.opis.toLowerCase())
    );
  }, [aopData, filters]);

  const handleContextMenu = (event: React.MouseEvent<HTMLTableRowElement>, item: AopItem) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, item });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };


  return (
    <div className="bg-white border border-gray-200 shadow-sm flex flex-col h-full">
      <Toolbar actions={toolbarActions} />
      <div className="flex-1 overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead className="sticky top-0 bg-slate-600 text-white z-10">
              <tr>
                <th className="p-2 font-semibold w-16">R.br.</th>
                <th className="p-2 font-semibold w-24">AOP</th>
                <th className="p-2 font-semibold">Opis</th>
              </tr>
              <tr className="bg-gray-100">
                  <td className="p-1">
                    <TableFilterInput
                      value={filters.rbr}
                      onChange={(e) => handleFilterChange('rbr', e.target.value)}
                      ariaLabel="Filter by R.br."
                    />
                  </td>
                  <td className="p-1">
                    <TableFilterInput
                      value={filters.aop}
                      onChange={(e) => handleFilterChange('aop', e.target.value)}
                      ariaLabel="Filter by AOP"
                    />
                  </td>
                  <td className="p-1">
                    <TableFilterInput
                      value={filters.opis}
                      onChange={(e) => handleFilterChange('opis', e.target.value)}
                      ariaLabel="Filter by Opis"
                    />
                  </td>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAopData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectAop(item)}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                  className={`cursor-pointer hover:bg-blue-100 ${selectedAop?.id === item.id ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  <td className="p-2 text-right">{item.rbr}</td>
                  <td className="p-2">{item.aop}</td>
                  <td className="p-2">{item.opis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
       {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={handleCloseContextMenu}>
          {/* 'Promjena' option removed */}
          {/* Fix: Provide an empty div as children to satisfy the 'children' prop requirement */}
          <div></div> 
        </ContextMenu>
      )}
    </div>
  );
};

export default AopTable;