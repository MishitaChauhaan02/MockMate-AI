import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code,
  Terminal,
  Coffee,
  Brain,
  Sparkles,
  Database,
  Cpu,
  Network,
  Layers,
  Briefcase,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { interviewApi } from '../../services/api';

interface NewInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'Data Structures and Algorithms', name: 'Data Structures & Algorithms', icon: Code, desc: 'Arrays, Trees, Graphs, DP' },
  { id: 'Python', name: 'Python', icon: Terminal, desc: 'GIL, Generators, OOP, Async' },
  { id: 'Java', name: 'Java', icon: Coffee, desc: 'JVM, Garbage Collection, Concurrency' },
  { id: 'Machine Learning', name: 'Machine Learning', icon: Brain, desc: 'Supervised, Metrics, Ensembles' },
  { id: 'Artificial Intelligence', name: 'Artificial Intelligence', icon: Sparkles, desc: 'Transformers, Attention, RAG' },
  { id: 'Database Management Systems', name: 'DBMS & SQL', icon: Database, desc: 'ACID, B+ Trees, Isolation' },
  { id: 'Operating Systems', name: 'Operating Systems', icon: Cpu, desc: 'Processes, Memory, Deadlocks' },
  { id: 'Computer Networks', name: 'Computer Networks', icon: Network, desc: 'TCP/IP, Handshakes, Protocols' },
  { id: 'System Design', name: 'System Design', icon: Layers, desc: 'Distributed Systems, Scaling' },
  { id: 'General Technical Interview', name: 'General Technical', icon: Briefcase, desc: 'Debugging, SOLID, CI/CD' },
];

const DIFFICULTIES = [
  { id: 'Beginner', label: 'Beginner', desc: 'Core fundamentals & definitions' },
  { id: 'Intermediate', label: 'Intermediate', desc: 'Tradeoffs, internals & implementations' },
  { id: 'Advanced', label: 'Advanced', desc: 'Architectural depth & edge cases' },
];

const QUESTION_COUNTS = [5, 10, 15];

export const NewInterviewModal: React.FC<NewInterviewModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Intermediate');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [mode, setMode] = useState<'practice' | 'assessment'>('practice');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartInterview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const interview = await interviewApi.createInterview({
        category: selectedCategory,
        difficulty: selectedDifficulty,
        total_questions: questionCount,
        mode,
      });
      onClose();
      navigate(`/app/interview/${interview.id}`);
    } catch (err: any) {
      console.error('Failed to create interview:', err);
      setError(err.response?.data?.detail || 'Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure New Technical Interview"
      subtitle="Select your target domain, difficulty, and practice mode to begin."
      maxWidth="xl"
    >
      <div className="space-y-5">
        {error && (
          <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 rounded-lg border border-rose-200 dark:border-rose-800">
            {error}
          </div>
        )}

        {/* 1. Category Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            1. Target Domain / Category
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-brand-50/80 border-brand-500 ring-1 ring-brand-500 dark:bg-brand-950/60'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {cat.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {cat.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Difficulty & Question Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              2. Difficulty Level
            </label>
            <div className="space-y-1.5">
              {DIFFICULTIES.map((d) => (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setSelectedDifficulty(d.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all text-xs ${
                    selectedDifficulty === d.id
                      ? 'bg-brand-50 border-brand-500 text-brand-900 dark:bg-brand-950/50 dark:text-brand-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{d.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              3. Questions & Mode
            </label>
            <div className="flex gap-2 mb-3">
              {QUESTION_COUNTS.map((count) => (
                <button
                  type="button"
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    questionCount === count
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {count} Questions
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('practice')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  mode === 'practice'
                    ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500 dark:bg-teal-950/50'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white">
                  <Zap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  Practice
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Instant AI feedback per answer
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('assessment')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  mode === 'assessment'
                    ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500 dark:bg-teal-950/50'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  Assessment
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Feedback revealed at the end
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleStartInterview}
            isLoading={isLoading}
            leftIcon={<Sparkles className="w-4 h-4 text-teal-300" />}
          >
            Launch Interview Workspace
          </Button>
        </div>
      </div>
    </Modal>
  );
};
