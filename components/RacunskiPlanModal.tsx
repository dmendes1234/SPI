
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { racunskiPlanData } from '../data/racunskiPlanData';
import type { RacunskiPlanItem } from '../types';
import { XIcon, RefreshIcon, SaveIcon, ExcelIcon, CheckCircleIcon, InfoIcon, NewIcon, EditIcon, DeleteIcon } from '../constants';
import Toolbar from './Toolbar';
import NotImplementedModal from './NotImplementedModal';
import ContextMenu from './ContextMenu';
import RacunskiPlanFormModal from './RacunskiPlanFormModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface RacunskiPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (accounts: RacunskiPlanItem[]) => void;
  initiallySelectedAccounts: RacunskiPlanItem[];
  isSingleSelect?: boolean;
  filterMinLength?: number;
}

const RacunskiPlanModal: React.FC<RacunskiPlanModalProps> = ({ 
    isOpen, 
    onClose, 
    onSelect, 
    initiallySelectedAccounts, 
    isSingleSelect = false, 
    filterMinLength = 0 
}) => {
  // Data State
  const [allAccounts, setAllAccounts] = useState<RacunskiPlanItem[]>(racunskiPlanData);
  
  // UI State
  const [filters, setFilters] = useState({ konto: '', opis: ''});
  const [taggedAccounts, setTaggedAccounts] = useState<RacunskiPlanItem[]>([]);
  const [showTaggedOnly, setShowTaggedOnly] = useState(false);
  
  // Modals State
  const [isNotImplementedModalOpen, setIsNotImplementedModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<RacunskiPlanItem | null>(null);

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Initialize state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTaggedAccounts(initiallySelectedAccounts);
      setFilters({ konto: '', opis: '' });
      setShowTaggedOnly(false);
      // We don't reset allAccounts here to persist changes during the session
    }
  }, [isOpen, initiallySelectedAccounts]);

  // Filtering Logic
  const filteredData = useMemo(() => {
    let data = allAccounts;
    
    if (filterMinLength > 0) {
        data = data.filter(item => item.konto.length >= filterMinLength);
    }

    if (showTaggedOnly) {
        const taggedKonti = new Set(taggedAccounts.map(a => a.konto));
        data = data.filter(item => taggedKonti.has(item.konto));
    }
    
    return data.filter(item => 
        item.konto.toLowerCase().startsWith(filters.konto.toLowerCase()) &&
        item.opis.toLowerCase().includes(filters.opis.toLowerCase())
    );
  }, [filters, taggedAccounts, showTaggedOnly, filterMinLength, allAccounts]);
  
  // CRUD Handlers
  const handleAddNew = () => {
    setAccountToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = () => {
    if (taggedAccounts.length === 1) {
        setAccountToEdit(taggedAccounts[0]);
        setIsFormModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (taggedAccounts.length === 1) {
        setIsDeleteModalOpen(true);
    }
  };

  const handleSaveAccount = (item: RacunskiPlanItem, originalKonto?: string) => {
    setAllAccounts(prev => {
        if (originalKonto) {
            // Update existing
            return prev.map(acc => acc.konto === originalKonto ? item : acc);
        } else {
            // Create new (add to top)
            return [item, ...prev];
        }
    });
    
    // If we edited an item that was selected, update selection
    if (originalKonto) {
        setTaggedAccounts(prev => prev.map(acc => acc.konto === originalKonto ? item : acc));
    }
  };

  const handleConfirmDelete = () => {
    if (taggedAccounts.length === 1) {
        const kontoToDelete = taggedAccounts[0].konto;
        setAllAccounts(prev => prev.filter(acc => acc.konto !== kontoToDelete));
        setTaggedAccounts([]); // Clear selection after delete
        setIsDeleteModalOpen(false);
    }
  };

  // Toolbar Actions
  const toolbarActions = [
    { label: 'Novi', icon: <NewIcon />, onClick: handleAddNew },
    { label: 'Promjena', icon: <EditIcon />, onClick: handleEdit, disabled: taggedAccounts.length !== 1 },
    { label: 'Brisanje', icon: <DeleteIcon />, onClick: handleDelete, disabled: taggedAccounts.length !== 1 },
    { label: 'Osvježi', icon: <RefreshIcon />, onClick: () => setFilters({ konto: '', opis: '' }) },
    { label: 'Spremi pretragu', icon: <SaveIcon /> },
    { label: 'Preuzmi u Excel-u', icon: <ExcelIcon />, onClick: () => setIsNotImplementedModalOpen(true) },
  ];
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToggleAccount = (account: RacunskiPlanItem) => {
    if (isSingleSelect) {
        setTaggedAccounts([account]);
        return;
    }
    setTaggedAccounts(prev => {
        const isTagged = prev.some(a => a.konto === account.konto);
        if (isTagged) {
            return prev.filter(a => a.konto !== account.konto);
        }
        return [...prev, account];
    });
  };

  const handleToggleSelectAll = () => {
      if (isSingleSelect) return;

      const currentKonti = taggedAccounts.map(a => a.konto);
      const filteredKonti = filteredData.map(a => a.konto);
      
      const allVisibleSelected = filteredData.every(item => currentKonti.includes(item.konto));

      if (allVisibleSelected) {
          setTaggedAccounts(prev => prev.filter(acc => !filteredKonti.includes(acc.konto)));
      } else {
          const newAccounts = filteredData.filter(item => !currentKonti.includes(item.konto));
          setTaggedAccounts(prev => [...prev, ...newAccounts]);
      }
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLTableRowElement>) => {
    if (isSingleSelect) return;
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleSelectAllShown = () => {
    setTaggedAccounts(prev => {
        const currentKonti = new Set(prev.map(a => a.konto));
        const newAccounts = [...prev];
        filteredData.forEach(item => {
            if (!currentKonti.has(item.konto)) {
                newAccounts.push(item);
            }
        });
        return newAccounts;
    });
    handleCloseContextMenu();
  };

  const handleDeselectAllShown = () => {
    const filteredKonti = new Set(filteredData.map(a => a.konto));
    setTaggedAccounts(prev => prev.filter(a => !filteredKonti.has(a.konto)));
    handleCloseContextMenu();
  };

  const handleSelect = () => {
    onSelect(taggedAccounts);
  };
  
  // Virtualization logic
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const ROW_HEIGHT = 33; 
  const OVERSCAN_COUNT = 5;

  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
        const element = scrollContainerRef.current;
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                setContainerHeight(entry.contentRect.height);
            }
        });

        resizeObserver.observe(element);
        setContainerHeight(element.clientHeight);

        return () => {
            if (element) {
              resizeObserver.unobserve(element);
            }
        };
    }
  }, [isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };
  
  const { virtualItems, paddingTop, paddingBottom } = useMemo(() => {
    const totalItems = filteredData.length;
    if (containerHeight === 0 || totalItems === 0) {
        return { virtualItems: [], paddingTop: 0, paddingBottom: 0 };
    }

    const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN_COUNT);
    const endIndex = Math.min(totalItems - 1, Math.floor((scrollTop + containerHeight) / ROW_HEIGHT) + OVERSCAN_COUNT);
    
    const virtualItems = filteredData.slice(startIndex, endIndex + 1);

    const paddingTop = startIndex * ROW_HEIGHT;
    const paddingBottom = (totalItems - (endIndex + 1)) * ROW_HEIGHT;

    return { virtualItems, paddingTop, paddingBottom };
  }, [filteredData, scrollTop, containerHeight]);


  if (!isOpen) return null;

  const areAllFilteredSelected = filteredData.length > 0 && filteredData.every(item => taggedAccounts.some(a => a.konto === item.konto));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-gray-100 rounded-sm shadow-xl w-full max-w-4xl h-full flex flex-col" onClick={e => {e.stopPropagation(); handleCloseContextMenu(); }}>
        <div className="bg-slate-700 text-white p-2 flex justify-between items-center rounded-t-sm">
          <h3 className="text-sm font-semibold">Odabir - Računski plan</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300" aria-label="Close modal">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="border-b border-gray-300">
          <Toolbar actions={toolbarActions} />
        </div>

        <div className="flex-1 p-2 flex flex-col min-h-0 bg-white border border-gray-300">
          <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto overflow-x-auto h-full">
            <table className="text-left text-xs table-fixed min-w-[700px] w-full" style={{borderCollapse: 'collapse'}}>
              <thead className="sticky top-0 bg-slate-600 text-white z-10">
                <tr>
                  <th className="p-2 font-semibold w-10">
                    {!isSingleSelect && (
                        <input 
                        type="checkbox"
                        onChange={handleToggleSelectAll}
                        checked={areAllFilteredSelected}
                        aria-label="Select all visible"
                        />
                    )}
                  </th>
                  <th className="p-2 font-semibold w-28">Konto</th>
                  <th className="p-2 font-semibold">Opis</th>
                </tr>
                <tr className="bg-gray-100">
                  <td></td>
                  <td className="p-1"><input type="text" name="konto" value={filters.konto} onChange={handleFilterChange} className="w-full text-xs p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white" aria-label="Filter by Konto"/></td>
                  <td className="p-1"><input type="text" name="opis" value={filters.opis} onChange={handleFilterChange} className="w-full text-xs p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white" aria-label="Filter by Opis"/></td>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                 {paddingTop > 0 && (
                  <tr><td style={{ height: `${paddingTop}px`}} colSpan={3}></td></tr>
                )}
                {virtualItems.map(item => (
                  <tr 
                    key={item.konto} 
                    onClick={() => handleToggleAccount(item)} 
                    onContextMenu={handleContextMenu}
                    className={`cursor-pointer hover:bg-blue-100 ${taggedAccounts.some(a => a.konto === item.konto) ? 'bg-blue-200' : ''}`}
                    style={{ height: `${ROW_HEIGHT}px`}}
                  >
                    <td className="p-2 text-center">
                       <input 
                        type="checkbox"
                        checked={taggedAccounts.some(a => a.konto === item.konto)}
                        onChange={() => handleToggleAccount(item)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select ${item.opis}`}
                       />
                    </td>
                    <td className="p-2 font-mono whitespace-nowrap overflow-hidden text-ellipsis">{item.konto}</td>
                    <td className="p-2 whitespace-nowrap overflow-hidden text-ellipsis">{item.opis}</td>
                  </tr>
                ))}
                {paddingBottom > 0 && (
                   <tr className="border-t-0"><td style={{ height: `${paddingBottom}px`}} colSpan={3}></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-3 bg-gray-100 border-t flex justify-between items-center">
            <div className="flex items-center space-x-2">
                {!isSingleSelect && (
                    <>
                        <input 
                            type="checkbox"
                            id="showTaggedOnlyCheckbox"
                            checked={showTaggedOnly}
                            onChange={(e) => setShowTaggedOnly(e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="showTaggedOnlyCheckbox" className="text-xs text-gray-700 cursor-pointer">Prikaži samo označene</label>
                    </>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={handleSelect} className="flex items-center space-x-1 px-3 py-1.5 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Odabir ({taggedAccounts.length})</span>
                </button>
                <button onClick={onClose} className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                    <InfoIcon className="h-4 w-4" />
                    <span>Izlaz</span>
                </button>
            </div>
        </div>
        
        {/* Modals */}
        <NotImplementedModal isOpen={isNotImplementedModalOpen} onClose={() => setIsNotImplementedModalOpen(false)} />
        
        {isFormModalOpen && (
            <RacunskiPlanFormModal 
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSave={handleSaveAccount}
                itemToEdit={accountToEdit}
                existingKontos={allAccounts.map(a => a.konto)}
            />
        )}
        
        {isDeleteModalOpen && taggedAccounts.length === 1 && (
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={`${taggedAccounts[0].konto} - ${taggedAccounts[0].opis}`}
                itemType="konto"
            />
        )}

        {contextMenu && !isSingleSelect && (
          <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={handleCloseContextMenu}>
              <button 
                  onClick={handleSelectAllShown} 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                  Označi sve prikazane
              </button>
              <button 
                  onClick={handleDeselectAllShown} 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                  Odznači sve prikazane
              </button>
          </ContextMenu>
        )}
      </div>
    </div>
  );
};

export default RacunskiPlanModal;
