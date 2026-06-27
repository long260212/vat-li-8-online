import React, { useState } from 'react';
import {
  User,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Lock,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { AppUser } from '../types';
import { getStoredAccounts, hashPassword, normalizeAccountName, saveStoredAccounts, StoredAccount } from '../auth';
import AppLogo from './AppLogo';

interface LoginProps {
  onLogin: (user: AppUser) => void;
}

type AuthMode = 'login' | 'register';

export default function Login({ onLogin }: LoginProps) {
  const [accountCount, setAccountCount] = useState(() => getStoredAccounts().length);
  const [mode, setMode] = useState<AuthMode>(() => (getStoredAccounts().length > 0 ? 'login' : 'register'));
  const [fullName, setFullName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [role, setRole] = useState<AppUser['role']>('student');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegisterMode = mode === 'register';

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanName = fullName.trim().replace(/\s+/g, ' ');
    const normalizedName = normalizeAccountName(cleanName);
    const cleanClass = studentClass.trim().replace(/\s+/g, ' ');

    if (!cleanName) {
      setError('Vui lòng điền họ và tên của bạn.');
      return;
    }

    if (!password) {
      setError('Vui lòng nhập mật khẩu.');
      return;
    }

    if (password.length < 4) {
      setError('Mật khẩu phải có ít nhất 4 ký tự.');
      return;
    }


    if (isRegisterMode && password !== confirmPassword) {
      setError('Mật khẩu xác nhận chưa khớp. Vui lòng nhập lại.');
      return;
    }

    setIsSubmitting(true);

    try {
      const accounts = getStoredAccounts();
      const existingAccount = accounts.find((account) => account.normalizedName === normalizedName);

      if (isRegisterMode) {
        if (existingAccount) {
          setError('Tài khoản này đã tồn tại. Vui lòng chuyển sang Đăng nhập để vào hệ thống.');
          return;
        }

        const passwordHash = await hashPassword(password, normalizedName);
        const now = new Date().toISOString();
        const newAccount: StoredAccount = {
          id: `account-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: cleanName,
          normalizedName,
          role,
          studentClass: role === 'teacher' ? cleanClass || 'Giáo viên' : cleanClass,
          passwordHash,
          createdAt: now,
          updatedAt: now,
        };

        saveStoredAccounts([...accounts, newAccount]);
        setAccountCount(accounts.length + 1);
        setMode('login');
        setPassword('');
        setConfirmPassword('');
        setSuccess('Tạo tài khoản thành công. Bây giờ hãy nhập mật khẩu để đăng nhập.');
        return;
      }

      if (!existingAccount) {
        setError('Tài khoản chưa tồn tại. Bạn cần tạo tài khoản trước, sau đó mới đăng nhập.');
        return;
      }

      const passwordHash = await hashPassword(password, existingAccount.normalizedName);
      if (passwordHash !== existingAccount.passwordHash) {
        setError('Mật khẩu chưa đúng. Vui lòng kiểm tra lại.');
        return;
      }

      onLogin({
        name: existingAccount.name,
        role: existingAccount.role,
        studentClass: existingAccount.studentClass,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi khi xử lý đăng nhập. Vui lòng thử lại.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-200" id="login-container">
      {/* Background elegant circles */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-100/30 dark:bg-blue-950/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-100/30 dark:bg-teal-950/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10" id="login-card-wrapper">
        {/* Header Logo */}
        <div className="text-center mb-6" id="login-header">
          <div className="inline-flex items-center justify-center mb-3 drop-shadow-xl hover:scale-105 transition-transform duration-300" id="login-logo-container">
            <AppLogo size={74} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Cánh Buồm <span className="text-blue-600 dark:text-blue-400">Tri Thức</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            Học tập & Khảo thí Vật lí 8 Thông minh, kết hợp mô hình Trí tuệ Nhân tạo Gemini
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 sm:p-8 shadow-2xl shadow-slate-100/50 dark:shadow-none space-y-6" id="login-card">
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200/70 dark:border-slate-800">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                !isRegisterMode
                  ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LogIn size={14} /> Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isRegisterMode
                  ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <UserPlus size={14} /> Tạo tài khoản
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
              {isRegisterMode ? 'Tạo tài khoản mới' : 'Đăng nhập hệ thống'}
            </h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
              {isRegisterMode
                ? 'Người dùng mới cần tạo tài khoản trước. Sau khi tạo xong, hệ thống sẽ yêu cầu đăng nhập lại.'
                : accountCount > 0
                  ? 'Chỉ tài khoản đã được tạo mới có thể đăng nhập vào hệ thống.'
                  : 'Chưa có tài khoản nào trên trình duyệt này. Vui lòng tạo tài khoản trước.'}
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 text-xs leading-relaxed animate-fade-in" id="login-error">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30 text-xs leading-relaxed animate-fade-in" id="login-success">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Field: Full name */}
            <div className="space-y-1" id="fullname-field-container">
              <label htmlFor="fullname" className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase block">
                Họ và tên
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                  <User size={14} />
                </span>
                <input
                  id="fullname"
                  type="text"
                  required
                  placeholder="Nhập họ và tên đầy đủ..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                />
              </div>
            </div>

            {isRegisterMode && (
              <>
                <div className="grid grid-cols-2 gap-2" id="role-field-container">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-3 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      role === 'student'
                        ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900 text-teal-700 dark:text-teal-300'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <GraduationCap size={14} /> Học sinh
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`p-3 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      role === 'teacher'
                        ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck size={14} /> Giáo viên
                  </button>
                </div>

                <div className="space-y-1" id="class-field-container">
                  <label htmlFor="student-class" className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase block">
                    {role === 'student' ? 'Lớp' : 'Chức danh / ghi chú'}
                  </label>
                  <input
                    id="student-class"
                    type="text"
                    placeholder={role === 'student' ? 'Ví dụ: 8A1 hoặc bỏ trống' : 'Ví dụ: Giáo viên Vật lí'}
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                  />
                </div>
              </>
            )}

            {/* Field: Password */}
            <div className="space-y-1" id="password-field-container">
              <label htmlFor="password" className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase block">
                Mật khẩu
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                  <Lock size={14} />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Nhập mật khẩu tối thiểu 4 ký tự..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {isRegisterMode && (
              <div className="space-y-1" id="confirm-password-field-container">
                <label htmlFor="confirm-password" className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase block">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    <Lock size={14} />
                  </span>
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Nhập lại mật khẩu..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                  />
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 mt-2 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${
                isRegisterMode
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/15'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/15'
              }`}
            >
              {isSubmitting ? 'Đang xử lý...' : isRegisterMode ? 'Tạo tài khoản' : 'Đăng nhập'}
              {isRegisterMode ? <UserPlus size={14} /> : <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />}
            </button>
          </form>

          {/* Quick Info text / disclaimer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
            <Sparkles size={11} className="text-amber-500 shrink-0" />
            <span>{isRegisterMode ? 'Tài khoản được lưu trên trình duyệt hiện tại' : 'Đăng nhập bằng tài khoản đã tạo trước đó'}</span>
          </div>
        </div>

        {/* Outer bottom credits */}
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 mt-6 font-medium">
          Trực quan hóa Vật lí lớp 8 - Sách giáo khoa Cánh Diều / Kết nối Tri thức
        </p>
      </div>
    </div>
  );
}
