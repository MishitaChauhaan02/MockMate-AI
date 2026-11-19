import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  className = '',
  color = 'bg-brand-600',
}) => {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className={`h-full transition-all duration-300 ease-out rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
