import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onOpenNewInterviewModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  onOpenNewInterviewModal,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    {
      name: 'New Interview',
      action: onOpenNewInterviewModal,
      icon: PlusCircle,
      highlight: true,
    },
    { name: 'Interview History', path: '/app/history', icon: History },
    { name: 'My Progress', path: '/app/progress', icon: TrendingUp },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-200 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigate('/app')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Sparkles className="w-5 h-5 text-teal-300" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                Mockmate<span className="text-brand-600 ml-0.5">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-1">
                AI Interview Prep
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden md:flex items-center justify-center"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.action) {
            return (
              <button
                key={item.name}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.highlight
                    ? 'bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-950/60 dark:text-brand-300 dark:hover:bg-brand-900/60'
                    : 'text-slate-600 hover:bg-slate-100 text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${item.highlight ? 'text-brand-600 dark:text-brand-400' : ''}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </button>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path!}
              end={item.path === '/app'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-100 text-brand-600 dark:bg-slate-800 dark:text-brand-400 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 ${
            isCollapsed ? 'justify-center p-2' : ''
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user?.full_name || 'Candidate'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {user?.email || 'user@mockmate.ai'}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {isCollapsed && (
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center justify-center p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
