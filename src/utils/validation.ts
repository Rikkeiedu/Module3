import { Employee, Gender, Department, EmployeeStatus } from '../types';

export const DEPARTMENTS: Department[] = [
  'Kỹ thuật & Công nghệ',
  'Nhân sự',
  'Tài chính - Kế toán',
  'Kinh doanh & Marketing',
  'Chăm sóc khách hàng',
  'Ban Giám đốc',
];

export const STATUS_LABELS: Record<EmployeeStatus, { label: string; bg: string; text: string; dot: string }> = {
  active: {
    label: 'Đang làm việc',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  probation: {
    label: 'Thử việc',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  leave: {
    label: 'Nghỉ phép/Tạm hoãn',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  terminated: {
    label: 'Đã nghỉ việc',
    bg: 'bg-slate-100 text-slate-600 border-slate-200',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
  },
};

/**
 * Validates email format according to standard RFC 5322 regex
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email không được để trống' };
  }
  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Định dạng email không hợp lệ (ví dụ: user@hrm.vn)' };
  }
  return { isValid: true };
}

/**
 * Validates password format
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'Mật khẩu không được để trống' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Mật khẩu phải có tối thiểu 6 ký tự' };
  }
  return { isValid: true };
}

/**
 * Validates Vietnamese phone number (10 digits starting with 03, 05, 07, 08, 09)
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'Số điện thoại không được để trống' };
  }
  const cleanPhone = phone.trim().replace(/\s+/g, '');
  const vnPhoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
  if (!vnPhoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Số điện thoại Việt Nam không hợp lệ (10 chữ số, bắt đầu 03, 05, 07, 08, 09)' };
  }
  return { isValid: true };
}

/**
 * Validates full name
 */
export function validateFullName(name: string): { isValid: boolean; error?: string } {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Họ và tên không được để trống' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Họ và tên phải có ít nhất 2 ký tự' };
  }
  if (trimmed.length > 60) {
    return { isValid: false, error: 'Họ và tên không vượt quá 60 ký tự' };
  }
  // Check that name does not contain numbers or excessive special characters
  const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
  if (!nameRegex.test(trimmed)) {
    return { isValid: false, error: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng' };
  }
  return { isValid: true };
}

/**
 * Validates salary
 */
export function validateSalary(salary: number | string): { isValid: boolean; error?: string } {
  if (salary === '' || salary === undefined || salary === null) {
    return { isValid: false, error: 'Mức lương không được để trống' };
  }
  const num = typeof salary === 'string' ? Number(salary) : salary;
  if (isNaN(num)) {
    return { isValid: false, error: 'Mức lương phải là một số hợp lệ' };
  }
  if (num < 1000000) {
    return { isValid: false, error: 'Mức lương tối thiểu là 1.000.000 VNĐ' };
  }
  if (num > 500000000) {
    return { isValid: false, error: 'Mức lương vượt quá giới hạn cho phép (500.000.000 VNĐ)' };
  }
  return { isValid: true };
}

/**
 * Validates hire date
 */
export function validateHireDate(dateString: string): { isValid: boolean; error?: string } {
  if (!dateString || !dateString.trim()) {
    return { isValid: false, error: 'Ngày vào làm không được để trống' };
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Ngày vào làm không hợp lệ' };
  }
  // Cannot be too far into future (more than 30 days)
  const maxFutureDate = new Date();
  maxFutureDate.setDate(maxFutureDate.getDate() + 30);
  if (date > maxFutureDate) {
    return { isValid: false, error: 'Ngày vào làm không được vượt quá 30 ngày trong tương lai' };
  }
  // Cannot be earlier than company founding (e.g., year 2000)
  const minDate = new Date('2000-01-01');
  if (date < minDate) {
    return { isValid: false, error: 'Ngày vào làm không hợp lệ (trước năm 2000)' };
  }
  return { isValid: true };
}

/**
 * Validates all employee form fields
 */
export function validateEmployeeForm(
  data: Partial<Employee>,
  existingEmployees: Employee[] = [],
  editingId?: string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const nameVal = validateFullName(data.fullName || '');
  if (!nameVal.isValid && nameVal.error) {
    errors.fullName = nameVal.error;
  }

  const emailVal = validateEmail(data.email || '');
  if (!emailVal.isValid && emailVal.error) {
    errors.email = emailVal.error;
  } else if (data.email) {
    // Check email uniqueness
    const emailConflict = existingEmployees.find(
      (emp) => emp.email.toLowerCase() === data.email?.toLowerCase().trim() && emp.id !== editingId
    );
    if (emailConflict) {
      errors.email = `Email này đã được sử dụng bởi nhân viên ${emailConflict.fullName} (${emailConflict.code})`;
    }
  }

  const phoneVal = validatePhone(data.phone || '');
  if (!phoneVal.isValid && phoneVal.error) {
    errors.phone = phoneVal.error;
  }

  if (!data.department) {
    errors.department = 'Vui lòng chọn phòng ban';
  }

  if (!data.position || !data.position.trim()) {
    errors.position = 'Chức vụ không được để trống';
  } else if (data.position.trim().length < 2) {
    errors.position = 'Chức vụ phải có ít nhất 2 ký tự';
  }

  const dateVal = validateHireDate(data.hireDate || '');
  if (!dateVal.isValid && dateVal.error) {
    errors.hireDate = dateVal.error;
  }

  const salaryVal = validateSalary(data.salary ?? '');
  if (!salaryVal.isValid && salaryVal.error) {
    errors.salary = salaryVal.error;
  }

  if (!data.status) {
    errors.status = 'Vui lòng chọn trạng thái làm việc';
  }

  if (!data.gender) {
    errors.gender = 'Vui lòng chọn giới tính';
  }

  return errors;
}

/**
 * Format currency to VND
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to DD/MM/YYYY
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('vi-VN');
}
