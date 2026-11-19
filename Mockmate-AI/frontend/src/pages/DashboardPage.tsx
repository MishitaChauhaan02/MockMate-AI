import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Trophy,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  Play,
  FileCheck,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DashboardStats, ProgressAnalytics } from '../types';
import { analyticsApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

interface OutletContextType {
  openNewInterview: () => void;
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { openNewInterview } = useOutletContext<OutletContextType>();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [progress, setProgress] = useState<ProgressAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, progressData] = await Promise.all([
          analyticsApi.getDashboardStats(),
          analyticsApi.getProgressAnalytics(),
        ]);
        setStats(statsData);
        setProgress(progressData);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const hasInterviews = stats && stats.total_interviews > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-950 text-white rounded-3xl shadow-premium relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Explainable Interview Evaluation
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Practice smarter. Interview better.
          </h2>
          <p className="text-sm text-brand-200 mt-2 leading-relaxed">
            Prepare for senior engineering roles with instant, rubric-based feedback across Clarity, Relevance, Structure, and Linguistic Confidence.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Button
            size="md"
            variant="primary"
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-md"
            onClick={openNewInterview}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Start New Interview
          </Button>
          <Button
            size="md"
            variant="secondary"
            className="bg-white/15 text-white hover:bg-white/25 border border-white/20"
            onClick={() => navigate('/app/progress')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            My Progress
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completed Interviews */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Completed Interviews
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {stats?.total_interviews || 0}
          </p>
          <span className="text-[11px] text-slate-400 block mt-1">
            Across 10 technical categories
          </span>
        </Card>

        {/* Average Score */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Average Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {stats?.average_score ? stats.average_score.toFixed(1) : '—'}
            {stats && stats.average_score > 0 && <span className="text-xs font-normal text-slate-400 ml-1">/5.0</span>}
          </p>
          <span className="text-[11px] text-slate-400 block mt-1">
            Rubric average across attempts
          </span>
        </Card>

        {/* Best Score */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Best Interview Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {stats?.best_score ? stats.best_score.toFixed(1) : '—'}
            {stats && stats.best_score > 0 && <span className="text-xs font-normal text-slate-400 ml-1">/5.0</span>}
          </p>
          <span className="text-[11px] text-slate-400 block mt-1">
            Highest scoring performance
          </span>
        </Card>

        {/* Questions Answered */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Questions Answered
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {stats?.total_questions_answered || 0}
          </p>
          <span className="text-[11px] text-slate-400 block mt-1">
            Submitted & AI evaluated
          </span>
        </Card>
      </div>

      {/* Main Grid: Performance Trend & Quick Start */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend Chart (2 cols) */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                Score Performance Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Overall score trajectory across completed interview attempts
              </p>
            </div>
            {hasInterviews && (
              <Badge variant="teal" size="sm">
                Live Data
              </Badge>
            )}
          </div>

          {hasInterviews && progress && progress.overall_trend.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progress.overall_trend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[1, 5]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <TrendingUp className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No performance data recorded yet
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Complete your first interview to generate an analytics timeline and track your score improvement.
              </p>
              <Button size="sm" variant="outline" className="mt-3" onClick={openNewInterview}>
                Start First Interview
              </Button>
            </div>
          )}
        </Card>

        {/* Dimension Snapshot */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Rubric Dimensions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Average competency across the 4 core dimensions
          </p>

          <div className="space-y-3 pt-2">
            {[
              { name: 'Clarity', score: progress?.dimension_averages?.Clarity || 0 },
              { name: 'Relevance', score: progress?.dimension_averages?.Relevance || 0 },
              { name: 'Structure', score: progress?.dimension_averages?.Structure || 0 },
              { name: 'Linguistic Confidence', score: progress?.dimension_averages?.Confidence || 0 },
            ].map((dim) => (
              <div key={dim.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300">{dim.name}</span>
                  <span className="text-brand-600 font-bold">
                    {dim.score > 0 ? `${dim.score.toFixed(1)} / 5.0` : '—'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(dim.score / 5.0) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-brand-600"
              onClick={() => navigate('/app/progress')}
            >
              View Detailed Analytics →
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Interviews Section */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Recent Interview Sessions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Continue an in-progress session or review evaluated reports
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/app/history')}
          >
            View All History →
          </Button>
        </div>

        {stats && stats.recent_interviews.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {stats.recent_interviews.map((iv) => {
              const isDone = iv.status === 'completed';
              return (
                <div
                  key={iv.id}
                  className="py-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors cursor-pointer"
                  onClick={() => navigate(`/app/interview/${iv.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300 flex items-center justify-center font-bold text-xs">
                      {iv.category.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {iv.category}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400">
                          {new Date(iv.started_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>•</span>
                        <Badge variant="neutral" size="sm">
                          {iv.difficulty}
                        </Badge>
                        <Badge variant="teal" size="sm">
                          {iv.mode}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {isDone ? (
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
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
                      leftIcon={isDone ? <FileCheck className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    >
                      {isDone ? 'Report' : 'Resume'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No interview sessions recorded yet. Launch your first technical mock interview today!
            </p>
            <Button size="sm" variant="primary" className="mt-3" onClick={openNewInterview}>
              Configure First Interview
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
