import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900 transition-colors">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 text-left font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="text-sm font-semibold flex items-center gap-2">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180 text-brand-600' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-3.5 pb-4 pt-1 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60 animate-in fade-in duration-150">
          {children}
        </div>
      )}
    </div>
  );
};
