import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Radar as RadarIcon,
  PieChart as PieIcon,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ProgressAnalytics } from '../types';
import { analyticsApi } from '../services/api';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const ProgressPage: React.FC = () => {
  const [progress, setProgress] = useState<ProgressAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await analyticsApi.getProgressAnalytics();
        setProgress(data);
      } catch (err) {
        console.error('Failed to load progress analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const hasData = progress && progress.overall_trend.length > 0;

  // Format dimension data for Bar Chart
  const dimensionData = progress
    ? [
        { dimension: 'Clarity', score: progress.dimension_averages.Clarity },
        { dimension: 'Relevance', score: progress.dimension_averages.Relevance },
        { dimension: 'Structure', score: progress.dimension_averages.Structure },
        { dimension: 'Confidence', score: progress.dimension_averages.Confidence },
      ]
    : [];

  // Format skill profiles for Radar Chart
  const radarData = progress?.skill_profiles.map((sp) => ({
    category: sp.category.length > 15 ? sp.category.slice(0, 14) + '…' : sp.category,
    score: sp.average_score,
    fullMark: 5.0,
  })) || [];

  // Donut chart distribution (High / Medium / Low)
  const donutData = progress
    ? [
        {
          name: 'Excellent (4.0 - 5.0)',
          value: progress.overall_trend.filter((t) => t.score >= 4.0).length,
          color: '#10b981',
        },
        {
          name: 'Average (3.0 - 3.9)',
          value: progress.overall_trend.filter((t) => t.score >= 3.0 && t.score < 4.0).length,
          color: '#f59e0b',
        },
        {
          name: 'Needs Growth (< 3.0)',
          value: progress.overall_trend.filter((t) => t.score < 3.0).length,
          color: '#f43f5e',
        },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-600" />
          My Progress & Skill Analytics
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time performance metrics, 4-dimension rubric analytics, and skill profiles.
        </p>
      </div>

      {/* Strongest vs Weakest Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strongest */}
        <Card className="p-5 border-emerald-200/80 bg-emerald-50/30 dark:border-emerald-800/60 dark:bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                Strongest Technical Domain
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {progress?.strongest_skill || 'Not enough data yet'}
              </h3>
            </div>
          </div>
        </Card>

        {/* Weakest / Focus Area */}
        <Card className="p-5 border-amber-200/80 bg-amber-50/30 dark:border-amber-800/60 dark:bg-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
                Priority Area for Practice
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {progress?.weakest_skill || 'Not enough data yet'}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {!hasData ? (
        <Card className="p-12 text-center space-y-3">
          <BarChart3 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Completed Interviews to Analyze
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Complete at least one mock interview session to unlock detailed performance curves, rubric dimension analysis, and skill profile radars.
          </p>
        </Card>
      ) : (
        <>
          {/* Charts Row 1: Line Chart & Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Overall Performance Trend (LineChart) */}
            <Card className="p-5 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                  Score Progression Over Time
                </h3>
                <p className="text-[11px] text-slate-400">
                  Chronological overall score per interview session
                </p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progress.overall_trend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={[1, 5]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ fill: '#6366f1', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* 2. 4-Dimension Rubric Comparison (BarChart) */}
            <Card className="p-5 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-600" />
                  Average Score by Rubric Dimension
                </h3>
                <p className="text-[11px] text-slate-400">
                  Clarity, Relevance, Structure, and Linguistic Confidence
                </p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dimensionData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Bar dataKey="score" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Charts Row 2: Radar Chart & Donut Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3. Skill Profile Radar */}
            <Card className="p-5 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <RadarIcon className="w-4 h-4 text-indigo-500" />
                  Category Competency Radar
                </h3>
                <p className="text-[11px] text-slate-400">
                  Comparative performance across technical interview categories
                </p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid opacity={0.2} />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 9 }} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#4f46e5"
                      fill="#6366f1"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* 4. Performance Breakdown Donut */}
            <Card className="p-5 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-amber-500" />
                  Interview Score Distribution
                </h3>
                <p className="text-[11px] text-slate-400">
                  Breakdown of sessions by grading tier
                </p>
              </div>
              <div className="h-64 w-full flex items-center justify-center">
                {donutData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '8px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '11px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-xs text-slate-400">Insufficient distribution data</p>
                )}
              </div>
            </Card>
          </div>

          {/* Actionable Recommendations */}
          <Card className="p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-brand-600" />
              Tailored Preparation Recommendations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {progress.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                >
                  <Sparkles className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
