import React, { useState } from 'react';
import { Settings, User as UserIcon, Lock, Moon, Sun, Check, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { authApi } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [fullName, setFullName] = useState<string>(user?.full_name || '');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsUpdatingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      await authApi.updateProfile({ full_name: fullName.trim() });
      await refreshUser();
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err: any) {
      setProfileError(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      await authApi.updateProfile({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess('Password updated successfully!');
      setTimeout(() => setPasswordSuccess(null), 3000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.detail || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-600" />
          Settings & Account
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal details, credentials, and application preferences.
        </p>
      </div>

      {/* Profile Information */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-brand-600" />
          Personal Profile
        </h3>

        {profileSuccess && (
          <div className="p-3 text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4" />
            {profileSuccess}
          </div>
        )}
        {profileError && (
          <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {profileError}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Email is your unique identifier and cannot be modified.
            </span>
          </div>

          <Button type="submit" size="sm" variant="primary" isLoading={isUpdatingProfile}>
            Save Profile
          </Button>
        </form>
      </Card>

      {/* Security & Password */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-brand-600" />
          Security & Password
        </h3>

        {passwordSuccess && (
          <div className="p-3 text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4" />
            {passwordSuccess}
          </div>
        )}
        {passwordError && (
          <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {passwordError}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="At least 6 characters"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          <Button type="submit" size="sm" variant="primary" isLoading={isUpdatingPassword}>
            Update Password
          </Button>
        </form>
      </Card>

      {/* Preferences & Appearance */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Appearance & Theme
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              Interface Color Scheme
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Current mode: <span className="capitalize font-medium">{theme}</span>
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleTheme}
            leftIcon={theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </div>
      </Card>

      {/* Session Logout */}
      <Card className="p-6 flex items-center justify-between border-rose-200/60 dark:border-rose-900/40">
        <div>
          <p className="text-xs font-bold text-rose-700 dark:text-rose-400">
            Sign Out of Account
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            End your current session on this device.
          </p>
        </div>
        <Button
          size="sm"
          variant="danger"
          onClick={logout}
          leftIcon={<LogOut className="w-4 h-4" />}
        >
          Log Out
        </Button>
      </Card>
    </div>
  );
};
