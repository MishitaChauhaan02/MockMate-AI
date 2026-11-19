import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon, Plus, Sparkles, Menu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';

interface TopbarProps {
  onOpenNewInterviewModal: () => void;
  onToggleMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenNewInterviewModal,
  onToggleMobileMenu,
}) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/app') return 'Dashboard';
    if (path.includes('/interview/')) return 'Interview Workspace';
    if (path === '/app/history') return 'Interview History';
    if (path === '/app/progress') return 'Performance Analytics';
    if (path === '/app/settings') return 'Settings & Preferences';
    return 'Mockmate AI';
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            {getPageTitle()}
          </h1>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
            Practice smarter. Interview better.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        <Button
          onClick={onOpenNewInterviewModal}
          size="sm"
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">New Interview</span>
          <span className="sm:hidden">Start</span>
        </Button>
      </div>
    </header>
  );
};
