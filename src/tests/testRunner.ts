import { TestCase } from '../types';
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateSalary,
  validateHireDate,
  validateFullName,
  validateEmployeeForm,
} from '../utils/validation';
import { authReducer, initialAuthState } from '../context/AuthContext';
import {
  getEmployeesApi,
  createEmployeeApi,
  deleteEmployeeApi,
} from '../services/api';

type TestFn = () => Promise<void> | void;

interface TestDefinition {
  id: string;
  suite: string;
  name: string;
  fn: TestFn;
}

function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Kỳ vọng: "${expected}", nhưng nhận được: "${actual}"`);
      }
    },
    toEqual(expected: any) {
      const a = JSON.stringify(actual);
      const b = JSON.stringify(expected);
      if (a !== b) {
        throw new Error(`Kỳ vọng cấu trúc: ${b}, nhưng nhận được: ${a}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Kỳ vọng giá trị truthy, nhưng nhận được: ${actual}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Kỳ vọng giá trị falsy, nhưng nhận được: ${actual}`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (actual <= expected) {
        throw new Error(`Kỳ vọng > ${expected}, nhưng nhận được: ${actual}`);
      }
    },
  };
}

export const TEST_DEFINITIONS: TestDefinition[] = [
  // --- SUITE 1: Form Validation Unit Tests ---
  {
    id: 'val-1',
    suite: 'Unit Test: Form Validation',
    name: 'validateEmail: Bắt lỗi khi email rỗng hoặc chỉ có khoảng trắng',
    fn: () => {
      const r1 = validateEmail('');
      expect(r1.isValid).toBe(false);
      const r2 = validateEmail('   ');
      expect(r2.isValid).toBe(false);
    },
  },
  {
    id: 'val-2',
    suite: 'Unit Test: Form Validation',
    name: 'validateEmail: Xác thực đúng email hợp lệ và từ chối sai định dạng',
    fn: () => {
      expect(validateEmail('nhanvien@hrm.vn').isValid).toBe(true);
      expect(validateEmail('user.name+test@company.com.vn').isValid).toBe(true);
      expect(validateEmail('invalid-email-no-at.com').isValid).toBe(false);
      expect(validateEmail('user@domain').isValid).toBe(false);
    },
  },
  {
    id: 'val-3',
    suite: 'Unit Test: Form Validation',
    name: 'validatePassword: Kiểm tra mật khẩu rỗng và độ dài tối thiểu 6 ký tự',
    fn: () => {
      expect(validatePassword('').isValid).toBe(false);
      expect(validatePassword('12345').isValid).toBe(false);
      expect(validatePassword('Admin@123').isValid).toBe(true);
    },
  },
  {
    id: 'val-4',
    suite: 'Unit Test: Form Validation',
    name: 'validatePhone: Kiểm tra định dạng số điện thoại di động Việt Nam (10 số)',
    fn: () => {
      expect(validatePhone('0901234567').isValid).toBe(true);
      expect(validatePhone('0387654321').isValid).toBe(true);
      expect(validatePhone('0123456789').isValid).toBe(false); // Đầu 01 không hợp lệ
      expect(validatePhone('090123456').isValid).toBe(false); // Chỉ 9 số
      expect(validatePhone('09012345678').isValid).toBe(false); // 11 số
    },
  },
  {
    id: 'val-5',
    suite: 'Unit Test: Form Validation',
    name: 'validateFullName: Kiểm tra tên tối thiểu 2 ký tự và không chứa số',
    fn: () => {
      expect(validateFullName('Nguyễn Văn An').isValid).toBe(true);
      expect(validateFullName('A').isValid).toBe(false);
      expect(validateFullName('An 123').isValid).toBe(false);
    },
  },
  {
    id: 'val-6',
    suite: 'Unit Test: Form Validation',
    name: 'validateSalary: Kiểm tra mức lương hợp lệ và biên an toàn',
    fn: () => {
      expect(validateSalary(25000000).isValid).toBe(true);
      expect(validateSalary(0).isValid).toBe(false);
      expect(validateSalary(-500000).isValid).toBe(false);
      expect(validateSalary(500000).isValid).toBe(false); // Dưới 1 triệu
    },
  },
  {
    id: 'val-7',
    suite: 'Unit Test: Form Validation',
    name: 'validateEmployeeForm: Phát hiện trùng lặp email với nhân viên hiện có',
    fn: () => {
      const mockList: any[] = [
        { id: '1', fullName: 'Nhân viên 1', email: 'exist@hrm.vn', code: 'NV-001' },
      ];
      const errors = validateEmployeeForm(
        {
          fullName: 'Người Mới',
          email: 'exist@hrm.vn',
          phone: '0901112233',
          department: 'Nhân sự',
          position: 'Chuyên viên',
          hireDate: '2023-01-01',
          salary: 15000000,
          status: 'active',
          gender: 'Nam',
        },
        mockList
      );
      expect(Boolean(errors.email)).toBe(true);
    },
  },

  // --- SUITE 2: Global State / Reducer Unit Tests ---
  {
    id: 'red-1',
    suite: 'Unit Test: Global State Reducer',
    name: 'authReducer: Xử lý LOGIN_START chuyển trạng thái sang isLoading',
    fn: () => {
      const state = authReducer(initialAuthState, { type: 'LOGIN_START' });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    },
  },
  {
    id: 'red-2',
    suite: 'Unit Test: Global State Reducer',
    name: 'authReducer: Xử lý LOGIN_SUCCESS cập nhật user, token và isAuthenticated',
    fn: () => {
      const mockUser: any = {
        id: 'u-1',
        name: 'Admin Test',
        email: 'admin@hrm.vn',
        role: 'admin',
        avatar: '',
      };
      const state = authReducer(
        { ...initialAuthState, isLoading: true },
        { type: 'LOGIN_SUCCESS', payload: { user: mockUser, token: 'mock-jwt-token' } }
      );
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.user?.email).toBe('admin@hrm.vn');
      expect(state.token).toBe('mock-jwt-token');
    },
  },
  {
    id: 'red-3',
    suite: 'Unit Test: Global State Reducer',
    name: 'authReducer: Xử lý LOGIN_FAILURE lưu trữ thông báo lỗi chính xác',
    fn: () => {
      const state = authReducer(
        { ...initialAuthState, isLoading: true },
        { type: 'LOGIN_FAILURE', payload: 'Mật khẩu không chính xác' }
      );
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Mật khẩu không chính xác');
    },
  },
  {
    id: 'red-4',
    suite: 'Unit Test: Global State Reducer',
    name: 'authReducer: Xử lý LOGOUT dọn sạch toàn bộ Global State về ban đầu',
    fn: () => {
      const activeState = {
        user: { id: '1', name: 'Test', email: 'test@hrm.vn', role: 'admin' as const, avatar: '' },
        token: 'token-abc',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      const state = authReducer(activeState, { type: 'LOGOUT' });
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBe(null);
      expect(state.token).toBe(null);
    },
  },

  // --- SUITE 3: API & CRUD Integration Tests ---
  {
    id: 'api-1',
    suite: 'Integration Test: API Integration',
    name: 'API: getEmployeesApi trả về danh sách nhân sự kèm thông số phân trang',
    fn: async () => {
      const res = await getEmployeesApi({ page: 1, limit: 5 });
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.page).toBe(1);
    },
  },
  {
    id: 'api-2',
    suite: 'Integration Test: API Integration',
    name: 'API: createEmployeeApi tạo nhân viên mới và tự sinh mã định danh NV-xxx',
    fn: async () => {
      const testEmail = `test.api.${Date.now()}@hrm.vn`;
      const newEmp = await createEmployeeApi({
        fullName: 'Nhân Viên Test API',
        email: testEmail,
        phone: '0981122334',
        gender: 'Nam',
        department: 'Kỹ thuật & Công nghệ',
        position: 'Tester',
        hireDate: '2024-01-01',
        salary: 18000000,
        status: 'active',
      });
      expect(Boolean(newEmp.id)).toBe(true);
      expect(newEmp.code.startsWith('NV-')).toBe(true);
      expect(newEmp.email).toBe(testEmail);

      // Clean up test created employee
      await deleteEmployeeApi(newEmp.id);
    },
  },
];

/**
 * Executes all or a single test case
 */
export async function runAllTests(
  onProgress?: (result: TestCase) => void
): Promise<TestCase[]> {
  const results: TestCase[] = [];

  for (const t of TEST_DEFINITIONS) {
    const startTime = performance.now();
    let status: 'passed' | 'failed' = 'passed';
    let errorMsg: string | undefined;

    try {
      await t.fn();
    } catch (err: any) {
      status = 'failed';
      errorMsg = err?.message || String(err);
    }

    const durationMs = Math.round(performance.now() - startTime);
    const testResult: TestCase = {
      id: t.id,
      suite: t.suite,
      name: t.name,
      status,
      error: errorMsg,
      durationMs,
    };

    results.push(testResult);
    if (onProgress) {
      onProgress(testResult);
    }
  }

  return results;
}
