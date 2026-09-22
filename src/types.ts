export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  position?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string } };

export type EmployeeStatus = 'active' | 'probation' | 'leave' | 'terminated';

export type Department =
  | 'Kỹ thuật & Công nghệ'
  | 'Nhân sự'
  | 'Tài chính - Kế toán'
  | 'Kinh doanh & Marketing'
  | 'Chăm sóc khách hàng'
  | 'Ban Giám đốc';

export type Gender = 'Nam' | 'Nữ' | 'Khác';

export interface Employee {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  department: Department;
  position: string;
  hireDate: string; // YYYY-MM-DD
  salary: number; // VND
  status: EmployeeStatus;
  avatar?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface TestCase {
  id: string;
  suite: string;
  name: string;
  status: 'passed' | 'failed' | 'pending';
  error?: string;
  durationMs?: number;
}

export interface FilterOptions {
  search: string;
  department: string;
  status: string;
  sortBy: 'fullName' | 'hireDate' | 'salary' | 'code';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}
