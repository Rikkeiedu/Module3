import React, { useState, useEffect } from 'react';
import { Employee, Department, EmployeeStatus, Gender } from '../types';
import {
  DEPARTMENTS,
  STATUS_LABELS,
  validateEmployeeForm,
  validateFullName,
  validateEmail,
  validatePhone,
  validateSalary,
  validateHireDate,
} from '../utils/validation';
import {
  X,
  UserPlus,
  Edit,
  Building,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  User,
  MapPin,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  employeeToEdit?: Employee | null;
  existingEmployees: Employee[];
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employeeToEdit,
  existingEmployees,
}) => {
  const isEdit = Boolean(employeeToEdit);

  const initialForm = {
    fullName: '',
    email: '',
    phone: '',
    gender: 'Nam' as Gender,
    department: 'Kỹ thuật & Công nghệ' as Department,
    position: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: 15000000,
    status: 'active' as EmployeeStatus,
    address: '',
    notes: '',
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        fullName: employeeToEdit.fullName,
        email: employeeToEdit.email,
        phone: employeeToEdit.phone,
        gender: employeeToEdit.gender,
        department: employeeToEdit.department,
        position: employeeToEdit.position,
        hireDate: employeeToEdit.hireDate,
        salary: employeeToEdit.salary,
        status: employeeToEdit.status,
        address: employeeToEdit.address || '',
        notes: employeeToEdit.notes || '',
      });
      setErrors({});
      setTouched({});
    } else {
      setFormData(initialForm);
      setErrors({});
      setTouched({});
    }
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Instant validation on change if already touched
    if (touched[field]) {
      const updated = { ...formData, [field]: value };
      const currentErrors = validateEmployeeForm(updated, existingEmployees, employeeToEdit?.id);
      setErrors((prev) => ({
        ...prev,
        [field]: currentErrors[field] || '',
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentErrors = validateEmployeeForm(formData, existingEmployees, employeeToEdit?.id);
    setErrors((prev) => ({
      ...prev,
      [field]: currentErrors[field] || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);

    const formErrors = validateEmployeeForm(formData, existingEmployees, employeeToEdit?.id);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      // Error will be notified via Toast in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-auto overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
              isEdit ? 'bg-amber-600' : 'bg-indigo-600'
            }`}>
              {isEdit ? <Edit className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {isEdit ? `Chỉnh sửa nhân viên: ${employeeToEdit?.code}` : 'Thêm mới nhân sự vào hệ thống'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEdit ? 'Cập nhật thông tin chi tiết và quyền hạn' : 'Điền đầy đủ thông tin nhân viên (Bắt buộc kiểm tra validation)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Section 1: Thông tin cơ bản */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Thông tin cá nhân & Liên hệ
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Họ và tên */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên đầy đủ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-employee-fullname"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="Ví dụ: Nguyễn Văn Hoàng"
                    className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      touched.fullName && errors.fullName
                        ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-200 text-rose-900'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                  />
                </div>
                {touched.fullName && errors.fullName && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email doanh nghiệp <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-employee-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="hoang.nguyen@hrm.vn"
                    className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      touched.email && errors.email
                        ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-200 text-rose-900'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-employee-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="0901234567 (10 số)"
                    className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      touched.phone && errors.phone
                        ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-200 text-rose-900'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                  />
                </div>
                {touched.phone && errors.phone && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Giới tính */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Giới tính <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-4 items-center h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  {(['Nam', 'Nữ', 'Khác'] as Gender[]).map((g) => (
                    <label key={g} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={() => handleChange('gender', g)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Địa chỉ */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ thường trú
                </label>
                <input
                  id="input-employee-address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Quận/Huyện, Tỉnh/TP"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Vị trí công việc & Hợp đồng */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" /> Vị trí công tác & Đãi ngộ
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phòng ban */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phòng ban <span className="text-rose-500">*</span>
                </label>
                <select
                  id="select-employee-department"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value as Department)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chức vụ */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chức vụ <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-employee-position"
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  onBlur={() => handleBlur('position')}
                  placeholder="Ví dụ: Chuyên viên Phân tích (BA)"
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                    touched.position && errors.position
                      ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-200 text-rose-900'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {touched.position && errors.position && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {errors.position}
                  </p>
                )}
              </div>

              {/* Ngày vào làm */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ngày vào làm <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-employee-hiredate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => handleChange('hireDate', e.target.value)}
                  onBlur={() => handleBlur('hireDate')}
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                    touched.hireDate && errors.hireDate
                      ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-200 text-rose-900'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {touched.hireDate && errors.hireDate && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {errors.hireDate}
                  </p>
                )}
              </div>

              {/* Mức lương */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mức lương cơ bản (VNĐ) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-employee-salary"
                  type="number"
                  step="500000"
                  value={formData.salary}
                  onChange={(e) => handleChange('salary', Number(e.target.value))}
                  onBlur={() => handleBlur('salary')}
                  placeholder="15000000"
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                    touched.salary && errors.salary
                      ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-200 text-rose-900'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {touched.salary && errors.salary && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {errors.salary}
                  </p>
                )}
              </div>

              {/* Trạng thái làm việc */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trạng thái hồ sơ <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(STATUS_LABELS) as EmployeeStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleChange('status', st)}
                      className={`p-2 rounded-xl border text-xs font-medium transition-all text-left flex items-center gap-2 ${
                        formData.status === st
                          ? `${STATUS_LABELS[st].bg} ring-2 ring-indigo-500/20 font-bold border-indigo-400`
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${STATUS_LABELS[st].dot}`} />
                      <span className="truncate">{STATUS_LABELS[st].label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ghi chú */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ghi chú nội bộ
                </label>
                <textarea
                  id="textarea-employee-notes"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Đặc điểm công việc, chứng chỉ hoặc kết quả thử việc..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Đóng
          </button>
          <button
            id="btn-submit-employee-form"
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang gửi API...</span>
              </>
            ) : (
              <>
                {isEdit ? <Edit className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                <span>{isEdit ? 'Lưu thay đổi (Update)' : 'Thêm mới (Create)'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
