import React, { useState, useMemo, useEffect } from 'react';
import OperateriBreadcrumbs from './OperateriBreadcrumbs';
import Toolbar from './Toolbar';
import { NewIcon, EditIcon, DeleteIcon, RefreshIcon, ExcelIcon } from '../constants';
import type { Operator } from '../types';
import OperatorModal from './OperatorModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface KatalogOperateraPageProps {
  operators: Operator[];
  onAddOperator: (operator: Omit<Operator, 'id'>) => void;
  onUpdateOperator: (operator: Operator) => void;
  onDeleteOperator: (operatorId: string) => void;
}

const KatalogOperateraPage: React.FC<KatalogOperateraPageProps> = ({ operators, onAddOperator, onUpdateOperator, onDeleteOperator }) => {
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(operators.length > 0 ? operators[0] : null);
  const [filters, setFilters] = useState({ ime: '', prezime: '', korisnickoIme: '' });
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    // If an operator is selected, ensure it's up-to-date with the operators list from props.
    // This handles cases where the selected operator's data is updated.
    if (selectedOperator) {
        const freshSelectedOperator = operators.find(op => op.id === selectedOperator.id);
        // If the operator still exists, update the local state to the fresh one.
        // If it doesn't exist (e.g., was deleted), reset selection.
        setSelectedOperator(freshSelectedOperator || (operators.length > 0 ? operators[0] : null));
    } else if (operators.length > 0 && !selectedOperator) {
        // If no operator is selected, default to the first one.
        setSelectedOperator(operators[0]);
    }
  }, [operators]);

  const filteredOperators = useMemo(() => {
    return operators.filter(op =>
      op.ime.toLowerCase().includes(filters.ime.toLowerCase()) &&
      op.prezime.toLowerCase().includes(filters.prezime.toLowerCase()) &&
      op.korisnickoIme.toLowerCase().includes(filters.korisnickoIme.toLowerCase())
    );
  }, [operators, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDelete = () => {
    if (selectedOperator) {
      onDeleteOperator(selectedOperator.id);
      setIsDeleteModalOpen(false);
      // After deletion, the useEffect will handle re-selecting an operator
    }
  };
  
  const toolbarActions = [
    { label: 'Novi', icon: <NewIcon />, onClick: () => setIsNewModalOpen(true) },
    { label: 'Promjena', icon: <EditIcon />, onClick: () => { if (selectedOperator) setIsEditModalOpen(true) } },
    { label: 'Brisanje', icon: <DeleteIcon />, onClick: () => { if (selectedOperator) setIsDeleteModalOpen(true) } },
    { label: 'Osvježi', icon: <RefreshIcon /> },
    { label: 'Preuzmi u Excel-u', icon: <ExcelIcon /> },
  ];

  return (
    <>
      <OperateriBreadcrumbs />
      <div className="flex flex-col flex-1 mt-2">
        <Toolbar actions={toolbarActions} />
        <div className="flex-1 overflow-y-auto bg-white border border-gray-200 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-600 text-white z-10">
              <tr>
                <th className="p-2 font-semibold">Ime</th>
                <th className="p-2 font-semibold">Prezime</th>
                <th className="p-2 font-semibold">Korisničko ime</th>
              </tr>
              <tr className="bg-gray-100">
                <td className="p-1"><input type="text" name="ime" value={filters.ime} onChange={handleFilterChange} className="w-full text-xs p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white" aria-label="Filter by Ime"/></td>
                <td className="p-1"><input type="text" name="prezime" value={filters.prezime} onChange={handleFilterChange} className="w-full text-xs p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white" aria-label="Filter by Prezime"/></td>
                <td className="p-1"><input type="text" name="korisnickoIme" value={filters.korisnickoIme} onChange={handleFilterChange} className="w-full text-xs p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white" aria-label="Filter by Korisničko ime"/></td>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOperators.map(op => (
                <tr
                  key={op.id}
                  onClick={() => setSelectedOperator(op)}
                  className={`cursor-pointer hover:bg-blue-100 ${selectedOperator?.id === op.id ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  <td className="p-2">{op.ime}</td>
                  <td className="p-2">{op.prezime}</td>
                  <td className="p-2">{op.korisnickoIme}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {isNewModalOpen && (
        <OperatorModal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          onSave={onAddOperator}
        />
      )}
      
      {isEditModalOpen && selectedOperator && (
        <OperatorModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={onUpdateOperator}
          operatorToEdit={selectedOperator}
        />
      )}
      
      {isDeleteModalOpen && selectedOperator && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          itemName={selectedOperator.korisnickoIme}
          itemType="operatera"
        />
      )}
    </>
  );
};

export default KatalogOperateraPage;