import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-subtle ${
        hoverable ? 'hover:shadow-premium hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
