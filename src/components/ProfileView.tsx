import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validatePhone, STATUS_LABELS, formatVND, formatDate } from '../utils/validation';
import { getEmployeesApi } from '../services/api';
import { Employee } from '../types';
import {
  UserCheck,
  Shield,
  Mail,
  Phone,
  Building,
  Briefcase,
  Key,
  CheckCircle2,
  Save,
  Calendar,
  DollarSign,
  BadgeAlert,
  Info,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateCurrentUser, token } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user?.role === 'admin';

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '0901234567');
  const [phoneError, setPhoneError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [empRecord, setEmpRecord] = useState<Employee | null>(null);

  useEffect(() => {
    if (user?.email) {
      getEmployeesApi({ limit: 100 })
        .then((res) => {
          const found = res.allData.find(
            (e) =>
              e.email.toLowerCase() === user.email.toLowerCase() ||
              e.fullName.toLowerCase() === user.name.toLowerCase()
          );
          if (found) {
            setEmpRecord(found);
          }
        })
        .catch(console.error);
    }
  }, [user?.email, user?.name]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneVal = validatePhone(phone);
    if (!phoneVal.isValid) {
      setPhoneError(phoneVal.error || '');
      showToast('error', 'Lỗi xác thực', phoneVal.error || 'Số điện thoại không hợp lệ');
      return;
    }
    setPhoneError('');
    setIsSaving(true);
    setTimeout(() => {
      updateCurrentUser({ name, phone });
      setIsSaving(false);
      showToast('success', 'Cập nhật thành công', 'Thông tin cá nhân đã được đồng bộ vào Global State.');
    }, 400);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Hồ sơ Cá nhân của tôi
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Dữ liệu tài khoản nội bộ và phiên xác thực Token đang hoạt động
        </p>
      </div>

      {/* Employee Access Notice */}
      {!isAdmin ? (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-3 shadow-xs">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-indigo-900">Phân quyền tài khoản: Nhân viên (Employee)</h4>
            <p className="text-indigo-700 mt-1 leading-relaxed">
              Bạn đang đăng nhập với vai trò Nhân viên. Hệ thống tự động giới hạn quyền truy cập: bạn chỉ được xem và cập nhật thông tin hồ sơ cá nhân của mình. Các phân hệ <strong>Quản lý Nhân sự (CRUD)</strong> và <strong>Thống kê & Báo cáo</strong> chỉ dành riêng cho Quản trị viên (HR Admin).
            </p>
          </div>
        </div>
      ) : null}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900 p-6 flex items-end">
          <div className="flex items-center gap-4 translate-y-8">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-xl bg-indigo-50 flex items-center justify-center">
                <UserCheck className="w-10 h-10 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    user?.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {user?.role === 'admin' ? 'QUẢN TRỊ VIÊN (ADMIN)' : 'NHÂN VIÊN (EMPLOYEE)'}
                </span>
                {empRecord?.code && (
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {empRecord.code}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Phiên xác thực hợp lệ (Authenticated)</span>
            </div>
          </div>

          {/* Employee Job Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-400 block">Chức vụ</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                {empRecord?.position || user?.position || 'Nhân viên'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-400 block">Trạng thái</span>
              <span className="text-xs font-bold text-emerald-700 mt-0.5 block truncate">
                {empRecord ? STATUS_LABELS[empRecord.status]?.label : 'Đang làm việc'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-400 block">Ngày vào làm</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                {empRecord?.hireDate ? formatDate(empRecord.hireDate) : '01/01/2023'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-400 block">Mức lương cơ sở</span>
              <span className="text-xs font-bold text-indigo-700 mt-0.5 block truncate">
                {empRecord?.salary ? formatVND(empRecord.salary) : 'Thỏa thuận'}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên hiển thị
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email tài khoản (Read-only)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại cá nhân
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                    phoneError
                      ? 'border-rose-300 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {phoneError && <p className="text-[11px] text-rose-600 mt-1">{phoneError}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phòng ban trực thuộc
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.department || empRecord?.department || 'Kỹ thuật & Công nghệ'}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Token details for Defense Presentation */}
            <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                <span>Mã Bearer Token (Global State Auth):</span>
              </div>
              <p className="font-mono text-[11px] text-slate-600 break-all bg-white p-2 rounded-lg border border-slate-200">
                {token || 'Chưa cấp token'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Token này được lưu trữ đồng bộ trong Global State & LocalStorage theo đặc tả F01.
              </p>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Đang lưu vào State...' : 'Lưu thông tin'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
