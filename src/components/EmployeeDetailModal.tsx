import React from 'react';
import { Employee } from '../types';
import { STATUS_LABELS, formatVND, formatDate } from '../utils/validation';
import {
  X,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  BadgeCheck,
  User,
  Clock,
} from 'lucide-react';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (employee: Employee) => void;
  canEdit?: boolean;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  isOpen,
  onClose,
  onEdit,
  canEdit = false,
}) => {
  if (!isOpen || !employee) return null;

  const statusInfo = STATUS_LABELS[employee.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Banner with Avatar */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/40 shadow-md flex items-center justify-center text-white shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white truncate">{employee.fullName}</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-white/20 text-white rounded font-bold">
                  {employee.code}
                </span>
              </div>
              <p className="text-xs text-indigo-100 mt-0.5 truncate">{employee.position}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusInfo.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                  {statusInfo.label}
                </span>
                <span className="text-[11px] text-indigo-200 flex items-center gap-1">
                  <User className="w-3 h-3" /> {employee.gender}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email doanh nghiệp
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1 truncate">{employee.email}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Số điện thoại
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1">{employee.phone}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" /> Phòng ban
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1">{employee.department}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Ngày gia nhập
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1">{formatDate(employee.hireDate)}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl sm:col-span-2">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Mức lương cơ bản
              </span>
              <p className="text-sm font-black text-emerald-700 mt-1">{formatVND(employee.salary)}</p>
            </div>

            {employee.address && (
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl sm:col-span-2">
                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Địa chỉ thường trú
                </span>
                <p className="text-xs text-slate-700 mt-1">{employee.address}</p>
              </div>
            )}

            {employee.notes && (
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl sm:col-span-2">
                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Ghi chú nội bộ
                </span>
                <p className="text-xs text-slate-700 mt-1 italic">{employee.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Cập nhật: {formatDate(employee.updatedAt.split('T')[0])}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Đóng
            </button>
            {canEdit && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(employee);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
              >
                Chỉnh sửa hồ sơ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
