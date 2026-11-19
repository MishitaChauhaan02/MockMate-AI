import React, { useEffect, useState } from 'react';
import { Sparkles, Brain, CheckCircle2, ShieldCheck } from 'lucide-react';

interface EvaluationProgressProps {
  statusMessage?: string;
}

export const EvaluationProgress: React.FC<EvaluationProgressProps> = ({
  statusMessage,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    { title: 'Semantic Ingestion', desc: 'Analyzing answer context and technical assertions' },
    { title: 'Rubric Scoring', desc: 'Evaluating Clarity, Relevance, Structure & Confidence' },
    { title: 'Evidence Verification', desc: 'Auditing textual quotes and detecting missing concepts' },
    { title: 'Feedback Synthesis', desc: 'Formulating explainable recommendations & model answer' },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStep(1), 700);
    const timer2 = setTimeout(() => setActiveStep(2), 1500);
    const timer3 = setTimeout(() => setActiveStep(3), 2300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300 flex items-center justify-center animate-pulse">
          <Sparkles className="w-5 h-5 text-teal-500" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            AI Evaluation in Progress
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {statusMessage || 'Analyzing your response across formal technical rubrics...'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((s, idx) => {
          const isDone = activeStep > idx;
          const isCurrent = activeStep === idx;
          return (
            <div
              key={s.title}
              className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
                isCurrent
                  ? 'border-brand-300 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-950/40 ring-1 ring-brand-300'
                  : isDone
                  ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/40 text-slate-600'
                  : 'border-slate-100 dark:border-slate-800/80 opacity-50'
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {s.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
