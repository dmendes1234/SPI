import React from 'react';
import type { ToolbarAction } from '../types';

interface ToolbarProps {
  actions: ToolbarAction[];
}

const Toolbar: React.FC<ToolbarProps> = ({ actions }) => {
  return (
    <div className="flex items-center space-x-2 border-b border-gray-200 bg-gray-50 p-2 flex-wrap gap-y-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
        >
          {/* Fix: Explicitly type the props of the React.ReactElement to resolve the cloneElement overload error. */}
          {React.cloneElement(action.icon as React.ReactElement<{ className?: string }>, { className: 'h-4 w-4 text-gray-600' })}
          <span className="hidden sm:inline">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Toolbar;
