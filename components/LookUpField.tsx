
import React from 'react';

interface LookUpFieldProps {
    valueLeft: string;
    valueRight: string;
    onButtonClick: () => void;
    label?: string;
    className?: string;
    inputClassName?: string;
    required?: boolean;
    disabled?: boolean;
    labelClassName?: string;
}

const LookUpField: React.FC<LookUpFieldProps> = ({ 
    valueLeft, 
    valueRight, 
    onButtonClick, 
    label,
    className = "",
    inputClassName = "bg-gray-100",
    required = false,
    disabled = false,
    labelClassName
}) => {
  const finalLabelClassName = labelClassName !== undefined ? labelClassName : "mr-2 text-sm text-gray-700 w-24 text-right";
  
  // Determine background color logic
  // If required and not disabled, force yellow-50. Otherwise use provided inputClassName (default gray-100).
  const bgClass = required && !disabled ? "bg-yellow-50" : inputClassName;

  return (
    <div className={`flex items-center ${className}`}>
        {label && <span className={finalLabelClassName}>{label}</span>}
        <input 
            type="text" 
            readOnly 
            value={valueLeft} 
            className={`border border-gray-300 rounded-l-sm px-2 py-1 text-sm w-20 focus:outline-none ${bgClass} ${disabled ? 'text-gray-500' : 'text-black'}`} 
        />
        <button 
            onClick={onButtonClick}
            disabled={disabled}
            className={`border-t border-b border-gray-300 px-2 py-1 text-sm focus:outline-none ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
            ...
        </button>
        <input 
            type="text" 
            readOnly 
            value={valueRight} 
            className={`border border-gray-300 rounded-r-sm px-2 py-1 text-sm flex-1 focus:outline-none ${bgClass} ${disabled ? 'text-gray-500' : 'text-black'}`} 
        />
    </div>
  );
};

export default LookUpField;
