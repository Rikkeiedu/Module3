import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validatePassword } from '../utils/validation';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, LogIn, Users, CheckCircle } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, isLoading, error: authError, clearError } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('admin@hrm.vn');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    const emailVal = validateEmail(email);
    if (!emailVal.isValid) errs.email = emailVal.error;

    const passVal = validatePassword(password);
    if (!passVal.isValid) errs.password = passVal.error;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') {
      const val = validateEmail(email);
      setErrors((prev) => ({ ...prev, email: val.isValid ? undefined : val.error }));
    }
    if (field === 'password') {
      const val = validatePassword(password);
      setErrors((prev) => ({ ...prev, password: val.isValid ? undefined : val.error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!validate()) {
      showToast('warning', 'Biểu mẫu chưa hợp lệ', 'Vui lòng kiểm tra lại định dạng email và mật khẩu');
      return;
    }

    try {
      await login(email, password);
      showToast('success', 'Đăng nhập thành công', 'Chào mừng bạn quay trở lại hệ thống quản lý HRM!');
    } catch (err: any) {
      showToast('error', 'Đăng nhập thất bại', err?.message || 'Email hoặc mật khẩu không chính xác');
    }
  };

  const fillCredentials = (role: 'admin' | 'employee') => {
    clearError();
    if (role === 'admin') {
      setEmail('admin@hrm.vn');
      setPassword('Admin@123');
      setErrors({});
    } else {
      setEmail('nhanvien@hrm.vn');
      setPassword('Employee@123');
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-500/25 mb-4 text-white">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Hệ thống Quản lý Nhân sự
          </h1>
          <p className="text-sm text-slate-300 mt-2 font-medium">
            Defense Case Study 3 • HRM Portal Enterprise
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Đăng nhập tài khoản</h2>
            <p className="text-xs text-slate-500 mt-1">
              Nhập email và mật khẩu được cấp để truy cập hệ thống
            </p>
          </div>

          {/* Quick Demo Credentials Switcher for Defense Evaluation */}
          <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                Tài khoản kiểm thử nhanh (Demo):
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-demo-admin"
                onClick={() => fillCredentials('admin')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all text-left flex flex-col ${
                  email === 'admin@hrm.vn'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 ring-1 ring-indigo-400'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="font-bold flex items-center justify-between">
                  Quản trị viên (HR)
                  {email === 'admin@hrm.vn' && <CheckCircle className="w-3 h-3 text-indigo-600" />}
                </span>
                <span className="text-[11px] text-slate-500 truncate">admin@hrm.vn</span>
              </button>

              <button
                type="button"
                id="btn-demo-employee"
                onClick={() => fillCredentials('employee')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all text-left flex flex-col ${
                  email === 'nhanvien@hrm.vn'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 ring-1 ring-indigo-400'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="font-bold flex items-center justify-between">
                  Nhân viên (Xem hồ sơ)
                  {email === 'nhanvien@hrm.vn' && <CheckCircle className="w-3 h-3 text-indigo-600" />}
                </span>
                <span className="text-[11px] text-slate-500 truncate">Chỉ xem hồ sơ cá nhân</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Global API Auth Error */}
            {authError && (
              <div
                id="login-error-alert"
                className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2"
              >
                <span className="font-bold">•</span>
                <span>{authError}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email doanh nghiệp <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) {
                      const val = validateEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: val.isValid ? undefined : val.error }));
                    }
                  }}
                  onBlur={() => handleBlur('email')}
                  placeholder="nhanvien@hrm.vn"
                  className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                    touched.email && errors.email
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-200'
                      : 'border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {touched.email && errors.email && (
                <p id="error-login-email" className="text-xs text-rose-600 mt-1 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mật khẩu truy cập <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password) {
                      const val = validatePassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: val.isValid ? undefined : val.error }));
                    }
                  }}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                    touched.password && errors.password
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-200'
                      : 'border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  id="btn-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p id="error-login-password" className="text-xs text-rose-600 mt-1 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit-login"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xác thực qua API...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập hệ thống</span>
                </>
              )}
            </button>
          </form>

          {/* Footnote about SRS requirements */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Đáp ứng tiêu chuẩn SRS Defense Case Study 3: Form validation, Global State & REST API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
