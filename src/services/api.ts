import { Employee, User } from '../types';

const STORAGE_KEY = 'hrm_employees_data_v2';
const SIMULATE_ERROR_KEY = 'hrm_simulate_network_error';

// Default initial dataset
const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    code: 'NV-001',
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@hrm.vn',
    phone: '0901234567',
    gender: 'Nam',
    department: 'Kỹ thuật & Công nghệ',
    position: 'Trưởng nhóm Kỹ thuật (Tech Lead)',
    hireDate: '2022-03-15',
    salary: 38000000,
    status: 'active',
    address: 'Quận Cầu Giấy, Hà Nội',
    notes: 'Chịu trách nhiệm kiến trúc hệ thống và dẫn dắt team backend.',
    createdAt: '2022-03-15T08:00:00.000Z',
    updatedAt: '2024-01-10T09:30:00.000Z',
  },
  {
    id: 'emp-2',
    code: 'NV-002',
    fullName: 'Trần Thị Bích Ngọc',
    email: 'ngoc.tran@hrm.vn',
    phone: '0912345678',
    gender: 'Nữ',
    department: 'Nhân sự',
    position: 'Trưởng phòng Nhân sự (HR Manager)',
    hireDate: '2021-08-01',
    salary: 32000000,
    status: 'active',
    address: 'Quận 1, TP. Hồ Chí Minh',
    notes: 'Quản lý tuyển dụng, đãi ngộ và văn hóa doanh nghiệp.',
    createdAt: '2021-08-01T08:00:00.000Z',
    updatedAt: '2024-02-15T11:00:00.000Z',
  },
  {
    id: 'emp-3',
    code: 'NV-003',
    fullName: 'Lê Hoàng Long',
    email: 'long.le@hrm.vn',
    phone: '0987654321',
    gender: 'Nam',
    department: 'Kỹ thuật & Công nghệ',
    position: 'Kỹ sư Frontend (Senior React Dev)',
    hireDate: '2023-01-10',
    salary: 26000000,
    status: 'active',
    address: 'Quận Thanh Xuân, Hà Nội',
    notes: 'Chuyên gia UI/UX và tối ưu trải nghiệm Web App.',
    createdAt: '2023-01-10T08:00:00.000Z',
    updatedAt: '2024-03-01T14:20:00.000Z',
  },
  {
    id: 'emp-4',
    code: 'NV-004',
    fullName: 'Phạm Minh Trang',
    email: 'trang.pham@hrm.vn',
    phone: '0978123456',
    gender: 'Nữ',
    department: 'Tài chính - Kế toán',
    position: 'Kế toán trưởng',
    hireDate: '2020-05-20',
    salary: 29000000,
    status: 'active',
    address: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
    notes: 'Phụ trách báo cáo thuế, bảng lương và kiểm toán nội bộ.',
    createdAt: '2020-05-20T08:00:00.000Z',
    updatedAt: '2024-01-20T10:00:00.000Z',
  },
  {
    id: 'emp-5',
    code: 'NV-005',
    fullName: 'Hoàng Quốc Việt',
    email: 'viet.hoang@hrm.vn',
    phone: '0933987654',
    gender: 'Nam',
    department: 'Kinh doanh & Marketing',
    position: 'Chuyên viên Phát triển Thị trường',
    hireDate: '2023-09-01',
    salary: 19500000,
    status: 'probation',
    address: 'Quận Đống Đa, Hà Nội',
    notes: 'Đang trong giai đoạn thử việc tháng thứ 2, thành tích khả quan.',
    createdAt: '2023-09-01T08:00:00.000Z',
    updatedAt: '2023-09-01T08:00:00.000Z',
  },
  {
    id: 'emp-6',
    code: 'NV-006',
    fullName: 'Đỗ Thùy Linh',
    email: 'linh.do@hrm.vn',
    phone: '0965432109',
    gender: 'Nữ',
    department: 'Chăm sóc khách hàng',
    position: 'Trưởng nhóm CSKH (Customer Success Lead)',
    hireDate: '2022-11-15',
    salary: 21000000,
    status: 'active',
    address: 'Quận 3, TP. Hồ Chí Minh',
    notes: 'Quản lý chất lượng phản hồi hỗ trợ khách hàng đa kênh.',
    createdAt: '2022-11-15T08:00:00.000Z',
    updatedAt: '2024-02-10T16:00:00.000Z',
  },
  {
    id: 'emp-7',
    code: 'NV-007',
    fullName: 'Vũ Đức Thịnh',
    email: 'thinh.vu@hrm.vn',
    phone: '0918765432',
    gender: 'Nam',
    department: 'Ban Giám đốc',
    position: 'Giám đốc Điều hành (CEO)',
    hireDate: '2019-01-01',
    salary: 75000000,
    status: 'active',
    address: 'Quận Ba Đình, Hà Nội',
    notes: 'Điều hành chiến lược phát triển toàn diện của công ty.',
    createdAt: '2019-01-01T08:00:00.000Z',
    updatedAt: '2024-01-01T08:00:00.000Z',
  },
  {
    id: 'emp-8',
    code: 'NV-008',
    fullName: 'Bùi Phương Thảo',
    email: 'thao.bui@hrm.vn',
    phone: '0944112233',
    gender: 'Nữ',
    department: 'Kỹ thuật & Công nghệ',
    position: 'Kỹ sư Đảm bảo Chất lượng (QA/QC Lead)',
    hireDate: '2023-04-12',
    salary: 24000000,
    status: 'leave',
    address: 'Quận Nam Từ Liêm, Hà Nội',
    notes: 'Đang nghỉ chế độ thai sản dự kiến quay lại vào quý tới.',
    createdAt: '2023-04-12T08:00:00.000Z',
    updatedAt: '2024-03-05T09:00:00.000Z',
  },
];

// Helper to get employees from localStorage
function getStoredEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Lỗi khi đọc dữ liệu nhân viên từ localStorage:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
  return INITIAL_EMPLOYEES;
}

// Helper to save employees to localStorage
function saveStoredEmployees(data: Employee[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Lỗi khi lưu dữ liệu nhân viên:', e);
  }
}

// Network simulation delay
function delay(ms = 450): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Check network error simulation toggle
export function isNetworkErrorSimulated(): boolean {
  return localStorage.getItem(SIMULATE_ERROR_KEY) === 'true';
}

export function setSimulateNetworkError(shouldSimulate: boolean): void {
  if (shouldSimulate) {
    localStorage.setItem(SIMULATE_ERROR_KEY, 'true');
  } else {
    localStorage.removeItem(SIMULATE_ERROR_KEY);
  }
}

/**
 * F01: Authenticate API
 * Validates credentials and returns JWT-like token + user profile
 */
export async function loginApi(email: string, password: string): Promise<{ user: User; token: string }> {
  await delay(600);

  if (isNetworkErrorSimulated()) {
    throw new Error('500 Internal Server Error: Không thể kết nối tới máy chủ xác thực');
  }

  const cleanEmail = email.trim().toLowerCase();

  // Admin Account
  if (cleanEmail === 'admin@hrm.vn' && password === 'Admin@123') {
    const user: User = {
      id: 'usr-admin-1',
      name: 'Nguyễn Quản Trị (HR Admin)',
      email: 'admin@hrm.vn',
      role: 'admin',
      department: 'Nhân sự',
      position: 'Quản trị viên Hệ thống',
      phone: '0901234567',
    };
    const token = `hrm_jwt_${btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 }))}`;
    return { user, token };
  }

  // Employee Account
  if (cleanEmail === 'nhanvien@hrm.vn' && password === 'Employee@123') {
    const user: User = {
      id: 'usr-emp-1',
      name: 'Lê Hoàng Long',
      email: 'nhanvien@hrm.vn',
      role: 'employee',
      department: 'Kỹ thuật & Công nghệ',
      position: 'Kỹ sư Frontend (Nhân viên)',
      phone: '0987654321',
    };
    const token = `hrm_jwt_${btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 }))}`;
    return { user, token };
  }

  // Check against active employees list for demo versatility
  const employees = getStoredEmployees();
  const matchedEmp = employees.find((e) => e.email.toLowerCase() === cleanEmail);
  if (matchedEmp && password.length >= 6) {
    const user: User = {
      id: `usr-${matchedEmp.id}`,
      name: matchedEmp.fullName,
      email: matchedEmp.email,
      role: matchedEmp.department === 'Nhân sự' || matchedEmp.department === 'Ban Giám đốc' ? 'admin' : 'employee',
      department: matchedEmp.department,
      position: matchedEmp.position,
      phone: matchedEmp.phone,
    };
    const token = `hrm_jwt_${btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 }))}`;
    return { user, token };
  }

  throw new Error('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
}

/**
 * F02: Read Employees API with search, department/status filter, sorting and pagination
 */
export async function getEmployeesApi(params?: {
  search?: string;
  department?: string;
  status?: string;
  sortBy?: 'fullName' | 'hireDate' | 'salary' | 'code';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}): Promise<{ data: Employee[]; total: number; page: number; totalPages: number; allData: Employee[] }> {
  await delay(500);

  if (isNetworkErrorSimulated()) {
    throw new Error('503 Service Unavailable: Không thể kết nối tới cơ sở dữ liệu nhân sự');
  }

  let list = [...getStoredEmployees()];

  // Filter by search (name, email, code, phone)
  if (params?.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    list = list.filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        e.position.toLowerCase().includes(q)
    );
  }

  // Filter by department
  if (params?.department && params.department !== 'all') {
    list = list.filter((e) => e.department === params.department);
  }

  // Filter by status
  if (params?.status && params.status !== 'all') {
    list = list.filter((e) => e.status === params.status);
  }

  // Sort
  const sortBy = params?.sortBy || 'code';
  const sortOrder = params?.sortOrder || 'asc';
  list.sort((a, b) => {
    let res = 0;
    if (sortBy === 'salary') {
      res = a.salary - b.salary;
    } else if (sortBy === 'hireDate') {
      res = new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime();
    } else if (sortBy === 'fullName') {
      res = a.fullName.localeCompare(b.fullName, 'vi');
    } else {
      res = a.code.localeCompare(b.code);
    }
    return sortOrder === 'asc' ? res : -res;
  });

  const total = list.length;
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const paginatedData = list.slice(startIndex, startIndex + limit);

  return {
    data: paginatedData,
    total,
    page,
    totalPages,
    allData: getStoredEmployees(),
  };
}

/**
 * F02: Get Single Employee Details
 */
export async function getEmployeeByIdApi(id: string): Promise<Employee> {
  await delay(300);
  if (isNetworkErrorSimulated()) {
    throw new Error('Không thể tải thông tin nhân sự do lỗi mạng');
  }
  const list = getStoredEmployees();
  const emp = list.find((e) => e.id === id);
  if (!emp) {
    throw new Error('Không tìm thấy thông tin nhân sự yêu cầu (404)');
  }
  return emp;
}

/**
 * F02: Create Employee
 */
export async function createEmployeeApi(
  data: Omit<Employee, 'id' | 'code' | 'createdAt' | 'updatedAt'>
): Promise<Employee> {
  await delay(600);
  if (isNetworkErrorSimulated()) {
    throw new Error('Thêm mới thất bại: Lỗi máy chủ (500)');
  }

  const list = getStoredEmployees();

  // Email conflict verification
  const emailExists = list.some((e) => e.email.toLowerCase() === data.email.toLowerCase().trim());
  if (emailExists) {
    throw new Error(`Email "${data.email}" đã tồn tại trong hệ thống`);
  }

  // Generate new code NV-XXX
  const maxNumber = list.reduce((max, e) => {
    const num = parseInt(e.code.replace('NV-', ''), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  const nextCode = `NV-${String(maxNumber + 1).padStart(3, '0')}`;

  const now = new Date().toISOString();
  const newEmployee: Employee = {
    ...data,
    id: `emp-${Date.now()}`,
    code: nextCode,
    createdAt: now,
    updatedAt: now,
  };

  list.unshift(newEmployee);
  saveStoredEmployees(list);

  return newEmployee;
}

/**
 * F02: Update Employee
 */
export async function updateEmployeeApi(id: string, data: Partial<Employee>): Promise<Employee> {
  await delay(500);
  if (isNetworkErrorSimulated()) {
    throw new Error('Cập nhật thất bại: Lỗi máy chủ (500)');
  }

  const list = getStoredEmployees();
  const index = list.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error('Không tìm thấy nhân viên cần cập nhật');
  }

  // Check email conflict
  if (data.email) {
    const emailExists = list.some(
      (e) => e.id !== id && e.email.toLowerCase() === data.email?.toLowerCase().trim()
    );
    if (emailExists) {
      throw new Error(`Email "${data.email}" đã thuộc về một nhân viên khác`);
    }
  }

  const updatedEmployee: Employee = {
    ...list[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  list[index] = updatedEmployee;
  saveStoredEmployees(list);

  return updatedEmployee;
}

/**
 * F02: Delete Employee
 */
export async function deleteEmployeeApi(id: string): Promise<{ success: boolean; id: string; deletedName: string }> {
  await delay(500);
  if (isNetworkErrorSimulated()) {
    throw new Error('Xóa nhân sự thất bại: Lỗi máy chủ (500)');
  }

  const list = getStoredEmployees();
  const index = list.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error('Không tìm thấy nhân viên cần xóa');
  }

  const deletedName = list[index].fullName;
  list.splice(index, 1);
  saveStoredEmployees(list);

  return { success: true, id, deletedName };
}

/**
 * Reset data to factory sample
 */
export async function resetSampleDataApi(): Promise<Employee[]> {
  await delay(400);
  saveStoredEmployees(INITIAL_EMPLOYEES);
  return INITIAL_EMPLOYEES;
}
