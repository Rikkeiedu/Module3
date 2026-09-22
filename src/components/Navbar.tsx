import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  LogOut,
  Shield,
  User as UserIcon,
  Menu,
  Beaker,
  WifiOff,
  Wifi,
  ChevronDown,
} from 'lucide-react';
import { isNetworkErrorSimulated, setSimulateNetworkError } from '../services/api';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenTestSuite: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenTestSuite }) => {
  const { user, logout, switchDemoRole } = useAuth();
  const { showToast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isErrorSimulated, setIsErrorSimulated] = useState(isNetworkErrorSimulated());

  const handleLogout = () => {
    logout();
    showToast('info', 'Đã đăng xuất', 'Bạn đã đăng xuất khỏi hệ thống an toàn.');
  };

  const handleToggleNetworkError = () => {
    const nextState = !isErrorSimulated;
    setSimulateNetworkError(nextState);
    setIsErrorSimulated(nextState);
    if (nextState) {
      showToast(
        'warning',
        'Bật mô phỏng lỗi mạng (503/500)',
        'Các request gọi API tiếp theo sẽ bị từ chối để kiểm thử trạng thái Error Handling.'
      );
    } else {
      showToast(
        'success',
        'Khôi phục mạng bình thường',
        'Kết nối API đã hoạt động ổn định trở lại.'
      );
    }
  };

  const handleQuickSwitchRole = async () => {
    const targetRole = user?.role === 'admin' ? 'employee' : 'admin';
    try {
      await switchDemoRole(targetRole);
      showToast(
        'success',
        'Chuyển đổi quyền thành công',
        `Hiện đang ở vai trò: ${targetRole === 'admin' ? 'Quản trị viên (Admin/HR)' : 'Nhân viên (Employee)'}`
      );
      setDropdownOpen(false);
    } catch (e: any) {
      showToast('error', 'Lỗi chuyển vai trò', e.message);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Brand */}
        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-sidebar-mobile"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Mở danh mục menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm sm:text-base leading-none block">
                HRM System
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Enterprise Personnel Management
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions, User info & Global State display */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Network Error Simulator Toggle for Defense Demonstration */}
          <button
            id="btn-toggle-network-error"
            onClick={handleToggleNetworkError}
            title={isErrorSimulated ? 'Đang giả lập lỗi mạng (Nhấp để tắt)' : 'Mô phỏng lỗi mạng để test Error state'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isErrorSimulated
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isErrorSimulated ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-600" />
                <span>Mạng lỗi (ON)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-slate-500" />
                <span>Mô phỏng lỗi API</span>
              </>
            )}
          </button>

          {/* Test Suite Modal Trigger */}
          <button
            id="btn-open-test-suite"
            onClick={onOpenTestSuite}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            title="Mở bảng chạy Unit Test & Integration Test phục vụ Defense Case Study 3"
          >
            <Beaker className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">Kiểm thử</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-indigo-600 text-white rounded-full font-bold">
              Tests
            </span>
          </button>

          {/* User Profile Menu with Global State */}
          <div className="relative">
            <button
              id="btn-user-menu"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200/80 transition-colors text-left cursor-pointer"
              aria-expanded={dropdownOpen}
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="hidden md:block pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[130px]">
                    {user?.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      user?.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user?.role === 'admin' ? 'HR ADMIN' : 'EMPLOYEE'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
                  {user?.email}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500">Vai trò:</span>
                      <span className="text-[11px] font-bold text-indigo-700">
                        {user?.role === 'admin' ? 'Quản trị viên (Toàn quyền CRUD)' : 'Nhân viên (Chỉ xem hồ sơ cá nhân)'}
                      </span>
                    </div>
                  </div>

                  {/* Switch Role action for defense testing */}
                  <div className="p-2 border-b border-slate-100">
                    <button
                      id="btn-switch-demo-role"
                      onClick={handleQuickSwitchRole}
                      className="w-full text-left px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        Chuyển vai trò sang:
                      </span>
                      <span className="font-bold text-indigo-600 uppercase text-[11px]">
                        {user?.role === 'admin' ? 'Employee' : 'Admin'}
                      </span>
                    </button>
                  </div>

                  {/* Mobile-only network simulator option */}
                  <div className="p-2 sm:hidden border-b border-slate-100">
                    <button
                      onClick={handleToggleNetworkError}
                      className="w-full text-left px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                    >
                      {isErrorSimulated ? <WifiOff className="w-3.5 h-3.5 text-rose-600" /> : <Wifi className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{isErrorSimulated ? 'Tắt lỗi mạng' : 'Bật lỗi mạng'}</span>
                    </button>
                  </div>

                  {/* Logout Button (SRS F03 requirement) */}
                  <div className="p-2">
                    <button
                      id="btn-logout"
                      onClick={handleLogout}
                      className="w-full text-left px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất (Clear Global State)</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
