import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  BarChart3,
  UserCircle,
  Beaker,
  LogOut,
  ShieldCheck,
  Building2,
  X,
  FileCheck2,
} from 'lucide-react';

interface SidebarProps {
  currentTab: 'employees' | 'analytics' | 'profile';
  onSelectTab: (tab: 'employees' | 'analytics' | 'profile') => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenTestSuite: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onOpenTestSuite,
}) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const allNavItems = [
    {
      id: 'employees' as const,
      label: 'Quản lý Nhân sự',
      sublabel: 'CRUD & Danh sách hồ sơ',
      icon: Users,
    },
    {
      id: 'analytics' as const,
      label: 'Thống kê & Báo cáo',
      sublabel: 'Phân bố phòng ban & lương',
      icon: BarChart3,
    },
    {
      id: 'profile' as const,
      label: 'Hồ sơ của tôi',
      sublabel: 'Thông tin tài khoản cá nhân',
      icon: UserCircle,
    },
  ];

  const navItems = isAdmin
    ? allNavItems
    : allNavItems.filter((item) => item.id === 'profile');

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-black text-sm">
              HR
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-wide block">HRM PORTAL</span>
              <span className="text-[10px] text-slate-400">Defense Case Study 3</span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-400 hover:text-white lg:hidden"
            aria-label="Đóng thanh điều hướng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card inside Sidebar (reflects Global State per F03) */}
        <div className="p-4 mx-3 my-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <UserCircle className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                  user?.role === 'admin'
                    ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                    : 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                }`}
              >
                <ShieldCheck className="w-2.5 h-2.5" />
                {user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate flex items-center gap-1.5">
            <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
            {user?.department || 'Trụ sở chính'}
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {isAdmin ? 'Menu Quản Trị' : 'Menu Cá Nhân'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div className="min-w-0">
                  <div className="text-xs">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {item.sublabel}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Test Runner Suite Button in Sidebar */}
          <div className="pt-4 mt-4 border-t border-slate-800">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Kiểm thử & Đánh giá Q&A
            </div>
            <button
              id="sidebar-btn-test-suite"
              onClick={() => {
                onOpenTestSuite();
                onCloseMobile();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-indigo-300 hover:bg-indigo-950/60 hover:text-indigo-200 border border-indigo-900/50 transition-colors cursor-pointer mt-1"
            >
              <Beaker className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  Bộ Test Tự Động
                  <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.2 rounded-full">
                    SRS
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Unit & Integration Tests
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Logout Footer (SRS F03 requirement) */}
        <div className="p-3 border-t border-slate-800">
          <button
            id="sidebar-btn-logout"
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất hệ thống</span>
          </button>
        </div>
      </aside>
    </>
  );
};
