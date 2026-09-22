import React, { useState, useEffect, useCallback } from 'react';
import { Employee, Department, EmployeeStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getEmployeesApi,
  createEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi,
  resetSampleDataApi,
} from '../services/api';
import {
  DEPARTMENTS,
  STATUS_LABELS,
  formatVND,
  formatDate,
} from '../utils/validation';
import { EmployeeModal } from './EmployeeModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { EmployeeDetailModal } from './EmployeeDetailModal';
import {
  Search,
  Plus,
  Filter,
  RefreshCw,
  Trash2,
  Edit2,
  Eye,
  AlertCircle,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  UserX,
  FileSpreadsheet,
} from 'lucide-react';

export const EmployeeTable: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const isAdmin = user?.role === 'admin';

  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'code' | 'fullName' | 'hireDate' | 'salary'>('code');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 8;

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);

  // Fetch employees from API (Asynchronous handling per F02)
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getEmployeesApi({
        search,
        department,
        status,
        sortBy,
        sortOrder,
        page,
        limit,
      });
      setEmployees(res.data);
      setAllEmployees(res.allData);
      setTotalPages(res.totalPages);
      setTotalItems(res.total);
    } catch (err: any) {
      const msg = err?.message || 'Không thể tải danh sách nhân viên từ máy chủ';
      setError(msg);
      showToast('error', 'Lỗi tải dữ liệu', msg);
    } finally {
      setLoading(false);
    }
  }, [search, department, status, sortBy, sortOrder, page, limit, showToast]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handle Create / Update Submit
  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingEmployee) {
        const updated = await updateEmployeeApi(editingEmployee.id, formData);
        showToast(
          'success',
          'Cập nhật thành công',
          `Hồ sơ của nhân viên ${updated.fullName} (${updated.code}) đã được lưu.`
        );
      } else {
        const created = await createEmployeeApi(formData);
        showToast(
          'success',
          'Thêm mới thành công',
          `Đã tạo mới nhân viên ${created.fullName} với mã ${created.code}.`
        );
      }
      setIsFormOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err: any) {
      const msg = err?.message || 'Có lỗi xảy ra khi thao tác với dữ liệu nhân sự';
      showToast('error', 'Thao tác thất bại', msg);
      throw err;
    }
  };

  // Handle Safe Delete
  const handleConfirmDelete = async () => {
    if (!deletingEmployee) return;
    try {
      setIsDeleting(true);
      await deleteEmployeeApi(deletingEmployee.id);
      showToast(
        'success',
        'Đã xóa nhân viên an toàn',
        `Đã xóa hồ sơ nhân viên ${deletingEmployee.fullName} khỏi hệ thống.`
      );
      setDeletingEmployee(null);
      // If current page is now empty and page > 1, go back one page
      if (employees.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchEmployees();
      }
    } catch (err: any) {
      showToast('error', 'Lỗi khi xóa nhân viên', err?.message || 'Không thể xóa hồ sơ');
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset sample data
  const handleResetData = async () => {
    if (window.confirm('Khôi phục danh sách nhân sự về mẫu ban đầu?')) {
      try {
        setLoading(true);
        await resetSampleDataApi();
        showToast('success', 'Đã khôi phục', 'Dữ liệu nhân sự mẫu đã được nạp lại thành công.');
        setPage(1);
        setSearch('');
        setDepartment('all');
        setStatus('all');
        fetchEmployees();
      } catch (e: any) {
        showToast('error', 'Lỗi khôi phục', e.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setDepartment('all');
    setStatus('all');
    setPage(1);
  };

  const toggleSort = (col: 'code' | 'fullName' | 'hireDate' | 'salary') => {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('asc');
    }
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Page Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Danh sách Nhân sự
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Module CRUD nhân sự • Phân quyền {isAdmin ? 'Quản trị viên (Admin)' : 'Nhân viên (Xem thông tin)'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-refresh-table"
            onClick={fetchEmployees}
            disabled={loading}
            className="p-2.5 sm:px-3 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Làm mới bảng"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          <button
            id="btn-reset-sample-data"
            onClick={handleResetData}
            className="p-2.5 sm:px-3 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Nạp lại dữ liệu mẫu ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đặt lại mẫu</span>
          </button>

          {/* Add Employee Button (Admin Only per SRS) */}
          {isAdmin ? (
            <button
              id="btn-add-employee"
              onClick={() => {
                setEditingEmployee(null);
                setIsFormOpen(true);
              }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mới nhân sự</span>
            </button>
          ) : (
            <div
              className="px-3 py-2 bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium rounded-xl flex items-center gap-1.5"
              title="Tài khoản nhân viên chỉ có quyền xem, liên hệ Admin để thêm mới"
            >
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Chế độ chỉ xem (Employee)</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative sm:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="input-search-employee"
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo tên, mã NV, email, số điện thoại hoặc chức vụ..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              id="filter-department"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">Tất cả phòng ban ({allEmployees.length})</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              id="filter-status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang làm việc</option>
              <option value="probation">Thử việc</option>
              <option value="leave">Nghỉ phép/Tạm hoãn</option>
              <option value="terminated">Đã nghỉ việc</option>
            </select>
          </div>
        </div>

        {/* Filter Stats & Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Đang hiển thị <span className="font-bold text-slate-800">{employees.length}</span> trên tổng số{' '}
            <span className="font-bold text-slate-800">{totalItems}</span> nhân viên
          </div>
          {(search || department !== 'all' || status !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Asynchronous State: ERROR HANDLING (SRS F02 requirement) */}
      {error && !loading && (
        <div
          id="employee-error-state"
          className="p-5 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-800"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">Lỗi không thể kết nối tới API</h4>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            id="btn-retry-fetch"
            onClick={fetchEmployees}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thử lại kết nối (Retry)</span>
          </button>
        </div>
      )}

      {/* Asynchronous State: LOADING SKELETON (SRS F02 requirement) */}
      {loading && (
        <div id="employee-loading-state" className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/6"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="h-12 bg-slate-100 rounded-xl animate-pulse flex items-center gap-4 px-4">
                <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/6 hidden sm:block"></div>
                <div className="h-4 bg-slate-200 rounded w-1/6 hidden md:block"></div>
                <div className="h-4 bg-slate-200 rounded w-1/12 ml-auto"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Asynchronous State: EMPTY RESULT */}
      {!loading && !error && employees.length === 0 && (
        <div id="employee-empty-state" className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <UserX className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy nhân viên nào</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Không có kết quả nào khớp với điều kiện tìm kiếm hoặc bộ lọc hiện tại của bạn.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Xóa bộ lọc tìm kiếm
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingEmployee(null);
                  setIsFormOpen(true);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Thêm nhân viên mới
              </button>
            )}
          </div>
        </div>
      )}

      {/* Asynchronous State: SUCCESS - TABLE VIEW WITH RESPONSIVE HORIZONTAL SCROLL */}
      {!loading && !error && employees.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Scrollable container for mobile responsiveness per Non-functional SRS */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">
                    <button
                      onClick={() => toggleSort('code')}
                      className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
                    >
                      <span>Mã NV</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">
                    <button
                      onClick={() => toggleSort('fullName')}
                      className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
                    >
                      <span>Họ và Tên</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Phòng Ban & Vị Trí</th>
                  <th className="py-3.5 px-4">
                    <button
                      onClick={() => toggleSort('hireDate')}
                      className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
                    >
                      <span>Ngày Vào</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">
                    <button
                      onClick={() => toggleSort('salary')}
                      className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
                    >
                      <span>Mức Lương</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {employees.map((emp) => {
                  const statusInfo = STATUS_LABELS[emp.status];
                  return (
                    <tr
                      key={emp.id}
                      id={`emp-row-${emp.id}`}
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                        {emp.code}
                      </td>

                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="min-w-0">
                          <button
                            onClick={() => setViewingEmployee(emp)}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors block text-left truncate cursor-pointer"
                          >
                            {emp.fullName}
                          </button>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {emp.email} • {emp.phone}
                          </span>
                        </div>
                      </td>

                      {/* Department & Position */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block truncate max-w-[170px]">
                          {emp.department}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[170px]">
                          {emp.position}
                        </span>
                      </td>

                      {/* Hire Date */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {formatDate(emp.hireDate)}
                      </td>

                      {/* Salary */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {formatVND(emp.salary)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Action buttons with RBAC restrictions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Detail */}
                          <button
                            id={`btn-view-${emp.id}`}
                            onClick={() => setViewingEmployee(emp)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Xem chi tiết hồ sơ"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit (Admin Only) */}
                          {isAdmin && (
                            <button
                              id={`btn-edit-${emp.id}`}
                              onClick={() => {
                                setEditingEmployee(emp);
                                setIsFormOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Chỉnh sửa thông tin"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete (Admin Only with confirmation dialog per SRS F02) */}
                          {isAdmin && (
                            <button
                              id={`btn-delete-${emp.id}`}
                              onClick={() => setDeletingEmployee(emp)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa nhân viên (yêu cầu xác nhận)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-4 py-3 bg-slate-50/75 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div>
              Trang <span className="font-bold text-slate-900">{page}</span> /{' '}
              <span className="font-bold text-slate-900">{totalPages}</span> (Tổng số{' '}
              <span className="font-bold text-slate-900">{totalItems}</span> nhân sự)
            </div>

            <div className="flex items-center gap-1">
              <button
                id="btn-prev-page"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Trước</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                    page === num
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                id="btn-next-page"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
              >
                <span>Sau</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleFormSubmit}
        employeeToEdit={editingEmployee}
        existingEmployees={allEmployees}
      />

      {/* Safe Delete Confirmation Dialog (SRS F02 requirement) */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingEmployee)}
        employee={deletingEmployee}
        isDeleting={isDeleting}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        isOpen={Boolean(viewingEmployee)}
        employee={viewingEmployee}
        onClose={() => setViewingEmployee(null)}
        onEdit={(emp) => {
          setEditingEmployee(emp);
          setIsFormOpen(true);
        }}
        canEdit={isAdmin}
      />
    </div>
  );
};
