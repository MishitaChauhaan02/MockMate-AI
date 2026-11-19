import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle,
  ArrowRight,
  Target,
  Brain,
  Sliders,
  Award,
  Layers,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5 text-teal-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                Mockmate<span className="text-brand-600 ml-0.5">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Practice smarter. Interview better.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            AI-Powered Technical Interview Evaluation Engine
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Practice smarter. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-teal-500">
              Interview better.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Prepare for high-stakes technical software engineering interviews with instant, explainable feedback across <strong>Clarity</strong>, <strong>Relevance</strong>, <strong>Structure</strong>, and <strong>Linguistic Confidence</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              variant="primary"
              className="bg-brand-600 hover:bg-brand-700 shadow-md font-semibold"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Free Mock Interview
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Sign In to Dashboard
            </Button>
          </div>
        </section>

        {/* 4 Rubric Dimensions Feature Grid */}
        <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              The 4-Dimension Explainable AI Rubric
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Independent scoring based on rigorous software engineering communication standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Clarity (1 to 5)',
                desc: 'Evaluates lucidity, precision, and whether technical concepts are communicated effectively.',
                icon: Target,
                color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60',
              },
              {
                title: 'Relevance (1 to 5)',
                desc: 'Checks whether your answer addresses the prompt and covers expected domain concepts.',
                icon: CheckCircle2,
                color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60',
              },
              {
                title: 'Structure (1 to 5)',
                desc: 'Audits logical sequencing, coherent organization, and smooth conceptual transitions.',
                icon: Layers,
                color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/60',
              },
              {
                title: 'Confidence (1 to 5)',
                desc: 'Linguistic indicators of assertiveness, directness, and avoidance of excessive hesitation.',
                icon: ShieldCheck,
                color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60',
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-2.5"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${f.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Supported Categories Banner */}
        <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h3 className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              Curated Question Banks Across 10 Technical Domains
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                'Data Structures & Algorithms',
                'Python Internals & GIL',
                'Java & JVM Architecture',
                'Machine Learning',
                'Artificial Intelligence & Transformers',
                'Database Management Systems & ACID',
                'Operating Systems & Concurrency',
                'Computer Networks & Protocols',
                'System Design & Scalability',
                'General Technical Problem-Solving',
              ].map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 text-center text-xs text-slate-500">
        <p>Mockmate AI — AI-Powered Interview Preparation Platform • Built with React, FastAPI & PostgreSQL</p>
      </footer>
    </div>
  );
};
