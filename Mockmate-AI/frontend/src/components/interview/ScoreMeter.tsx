import React from 'react';

interface ScoreMeterProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showMax?: boolean;
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({
  score,
  label,
  size = 'md',
  showMax = true,
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 4.0) return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800';
    if (val >= 3.0) return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800';
    return 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-xl px-4 py-2 font-bold',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`inline-flex items-center justify-center font-bold rounded-lg border ${getScoreColor(score)} ${sizeClasses[size]}`}>
        {score.toFixed(1)}
        {showMax && <span className="text-[11px] font-normal opacity-70 ml-0.5">/5.0</span>}
      </div>
      {label && <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>}
    </div>
  );
};
