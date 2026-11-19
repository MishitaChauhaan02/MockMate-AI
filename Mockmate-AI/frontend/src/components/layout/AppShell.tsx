import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { NewInterviewModal } from '../modals/NewInterviewModal';

export const AppShell: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isNewInterviewModalOpen, setIsNewInterviewModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar - Desktop */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenNewInterviewModal={() => setIsNewInterviewModalOpen(true)}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-slate-900/50 backdrop-blur-xs">
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 shadow-xl z-50">
            <Sidebar
              isCollapsed={false}
              setIsCollapsed={() => setIsMobileMenuOpen(false)}
              onOpenNewInterviewModal={() => {
                setIsMobileMenuOpen(false);
                setIsNewInterviewModalOpen(true);
              }}
            />
          </div>
          <div className="fixed inset-0" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ease-in-out ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <Topbar
          onOpenNewInterviewModal={() => setIsNewInterviewModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          <Outlet context={{ openNewInterview: () => setIsNewInterviewModalOpen(true) }} />
        </main>
      </div>

      {/* Global New Interview Modal */}
      <NewInterviewModal
        isOpen={isNewInterviewModalOpen}
        onClose={() => setIsNewInterviewModalOpen(false)}
      />
    </div>
  );
};
