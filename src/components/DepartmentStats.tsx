import React, { useState, useEffect } from 'react';
import { Employee, Department } from '../types';
import { getEmployeesApi } from '../services/api';
import { DEPARTMENTS, formatVND } from '../utils/validation';
import {
  Users,
  Briefcase,
  TrendingUp,
  UserCheck,
  UserX,
  PieChart,
  DollarSign,
  Building,
} from 'lucide-react';

export const DepartmentStats: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getEmployeesApi({ limit: 100 });
        setEmployees(res.allData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const total = employees.length;
  const activeCount = employees.filter((e) => e.status === 'active').length;
  const probationCount = employees.filter((e) => e.status === 'probation').length;
  const leaveCount = employees.filter((e) => e.status === 'leave').length;
  const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);
  const avgSalary = total > 0 ? totalPayroll / total : 0;

  // Breakdown by department
  const deptBreakdown = DEPARTMENTS.map((dept) => {
    const inDept = employees.filter((e) => e.department === dept);
    const count = inDept.length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    const deptSalary = inDept.reduce((sum, e) => sum + e.salary, 0);
    return { dept, count, percentage, deptSalary };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Báo cáo & Thống kê Nhân sự
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Tổng hợp dữ liệu nguồn nhân lực và phân bổ chi phí lương
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng nhân sự</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{total}</span>
            <span className="text-xs text-emerald-600 font-bold">100%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Đang được quản lý trên hệ thống</p>
        </div>

        {/* Active Staff */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Đang làm việc</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{activeCount}</span>
            <span className="text-xs text-slate-500 font-medium">
              {total > 0 ? Math.round((activeCount / total) * 100) : 0}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Chính thức có hiệu lực hợp đồng</p>
        </div>

        {/* Probation Staff */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Thử việc & Tạm hoãn</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">{probationCount + leaveCount}</span>
            <span className="text-xs text-amber-600 font-medium">
              {probationCount} thử việc
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{leaveCount} nhân viên tạm hoãn/nghỉ phép</p>
        </div>

        {/* Total Payroll */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng quỹ lương/tháng</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-black text-purple-900 block truncate">
              {formatVND(totalPayroll)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">TB: {formatVND(avgSalary)}/người</p>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Phân bố nhân sự theo phòng ban</h3>
            <p className="text-xs text-slate-500">Tỷ lệ quy mô và ngân sách chi trả từng bộ phận</p>
          </div>
          <Building className="w-5 h-5 text-indigo-600" />
        </div>

        <div className="space-y-4">
          {deptBreakdown.map((item) => (
            <div key={item.dept} className="p-3.5 bg-slate-50/75 rounded-xl border border-slate-200/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{item.dept}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-semibold">
                    {item.count} nhân sự
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700">
                  Quỹ lương: <span className="font-bold text-slate-900">{formatVND(item.deptSalary)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(item.percentage, 4)}%` }}
                />
              </div>
              <div className="text-right text-[10px] text-slate-500 mt-1 font-medium">
                {item.percentage}% tổng quy mô công ty
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
