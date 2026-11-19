import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/app');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    const demoEmail = 'alex@mockmate.ai';
    const demoPassword = 'Password123!';

    try {
      await login(demoEmail, demoPassword);
      navigate('/app');
    } catch (err) {
      // If demo account doesn't exist yet in the database, register it automatically!
      try {
        await register('Alex Rivera', demoEmail, demoPassword);
        navigate('/app');
      } catch (regErr: any) {
        setError('Failed to log in with demo account. Please try manual sign up.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          className="inline-flex items-center gap-2 cursor-pointer mb-3"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5 text-teal-300" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            Mockmate<span className="text-brand-600">AI</span>
          </span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Or{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-500">
            create a new account for free
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-premium rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Access Button */}
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 text-xs font-semibold hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>1-Click Evaluator Demo Sign In</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] uppercase font-semibold text-slate-400">
              Or with email
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="md"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
