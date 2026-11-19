import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Play,
  FileCheck,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Interview } from '../types';
import { interviewApi } from '../services/api';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await interviewApi.getInterviews();
        setInterviews(data);
        setFilteredInterviews(data);
      } catch (err) {
        console.error('Failed to load interview history:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  useEffect(() => {
    let result = interviews;
    if (selectedCategory !== 'All') {
      result = result.filter((i) => i.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.category.toLowerCase().includes(q) ||
          i.difficulty.toLowerCase().includes(q)
      );
    }
    setFilteredInterviews(result);
  }, [searchQuery, selectedCategory, interviews]);

  const categories = ['All', ...Array.from(new Set(interviews.map((i) => i.category)))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-brand-600" />
            Interview History
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review all previous mock interviews, answers, and AI rubric feedback.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total attempts: <span className="font-bold text-slate-900 dark:text-white">{interviews.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by category or difficulty..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interviews Table / Cards */}
      <Card className="p-0 overflow-hidden">
        {filteredInterviews.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredInterviews.map((iv) => {
              const isCompleted = iv.status === 'completed';
              return (
                <div
                  key={iv.id}
                  onClick={() => navigate(`/app/interview/${iv.id}`)}
                  className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      {iv.category.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {iv.category}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(iv.started_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <Badge variant="neutral" size="sm">
                          {iv.difficulty}
                        </Badge>
                        <Badge variant="teal" size="sm">
                          {iv.total_questions} Questions
                        </Badge>
                        <Badge variant="brand" size="sm">
                          {iv.mode}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {isCompleted ? (
                      <div className="text-right">
                        <span className="text-base font-extrabold text-slate-900 dark:text-white block">
                          {iv.overall_score?.toFixed(1)} / 5.0
                        </span>
                        <Badge variant="success" size="sm">
                          Completed
                        </Badge>
                      </div>
                    ) : (
                      <Badge variant="warning" size="sm">
                        In Progress
                      </Badge>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                    >
                      {isCompleted ? 'View Report' : 'Resume'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No interview records matched your filter criteria.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
