import React, { useState } from 'react';
import { TestCase } from '../types';
import { runAllTests, TEST_DEFINITIONS } from '../tests/testRunner';
import {
  Beaker,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  X,
  Clock,
  ShieldCheck,
  FileCode2,
  Cpu,
  Layers,
} from 'lucide-react';

interface TestingSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestingSuiteModal: React.FC<TestingSuiteModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [hasRun, setHasRun] = useState(false);

  if (!isOpen) return null;

  const handleRunTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    try {
      const results = await runAllTests((singleResult) => {
        setTestResults((prev) => [...prev, singleResult]);
      });
      setHasRun(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const passedCount = testResults.filter((t) => t.status === 'passed').length;
  const failedCount = testResults.filter((t) => t.status === 'failed').length;
  const totalTests = TEST_DEFINITIONS.length;

  // Group test results by suite
  const suites = [
    'Unit Test: Form Validation',
    'Unit Test: Global State Reducer',
    'Integration Test: API Integration',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-auto overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Beaker className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Bảng Kiểm Thử Tự Động (Testing Suite)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                  Defense Case Study 3
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Unit Testing (Validation, Reducer) & Integration Testing (REST API, State)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Stats Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs">
            <div>
              Tổng số bài test: <span className="font-bold text-slate-900">{totalTests}</span>
            </div>
            {hasRun && (
              <>
                <div className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đạt: {passedCount}
                </div>
                {failedCount > 0 && (
                  <div className="text-rose-700 font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    Thất bại: {failedCount}
                  </div>
                )}
              </>
            )}
          </div>

          <button
            id="btn-run-all-tests"
            onClick={handleRunTests}
            disabled={isRunning}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isRunning ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang thực thi các bài test...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Chạy toàn bộ bài test ({totalTests})</span>
              </>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {!hasRun && !isRunning && (
            <div className="p-8 text-center bg-indigo-50/50 rounded-2xl border border-indigo-100">
              <Beaker className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-800">Sẵn sàng chạy bộ kiểm thử doanh nghiệp</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                Nhấn nút &ldquo;Chạy toàn bộ bài test&rdquo; ở trên để kiểm tra toàn bộ các hàm Form Validation, Reducer của Global State và các luồng gọi API theo đúng yêu cầu đặc tả SRS Case Study 3.
              </p>
            </div>
          )}

          {suites.map((suiteTitle) => {
            const suiteTests = testResults.filter((t) => t.suite === suiteTitle);
            const suiteDefinitions = TEST_DEFINITIONS.filter((d) => d.suite === suiteTitle);

            return (
              <div key={suiteTitle} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {suiteTitle.includes('Validation') ? (
                    <FileCode2 className="w-4 h-4 text-indigo-600" />
                  ) : suiteTitle.includes('Reducer') ? (
                    <Cpu className="w-4 h-4 text-purple-600" />
                  ) : (
                    <Layers className="w-4 h-4 text-emerald-600" />
                  )}
                  <span>{suiteTitle}</span>
                  <span className="text-[10px] font-normal lowercase text-slate-400">
                    ({suiteDefinitions.length} test cases)
                  </span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {suiteDefinitions.map((def) => {
                    const result = suiteTests.find((r) => r.id === def.id);
                    const isPending = !result && isRunning;

                    return (
                      <div
                        key={def.id}
                        className="p-3 flex items-start justify-between gap-3 text-xs hover:bg-slate-50/60 transition-colors"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="mt-0.5 shrink-0">
                            {result?.status === 'passed' && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            )}
                            {result?.status === 'failed' && (
                              <XCircle className="w-4 h-4 text-rose-600" />
                            )}
                            {(!result || isPending) && (
                              <div className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-indigo-600 animate-spin" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 leading-snug">{def.name}</p>
                            {result?.error && (
                              <p className="text-[11px] text-rose-600 font-mono mt-1 bg-rose-50 p-1.5 rounded">
                                Lỗi: {result.error}
                              </p>
                            )}
                          </div>
                        </div>

                        {result && (
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {result.durationMs}ms
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                result.status === 'passed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {result.status === 'passed' ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Defense Case Study 3 Q&A Reference Guide */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Hướng dẫn trả lời phản biện Case Study 3 (Defense Q&A Summary):
            </h5>
            <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed text-[11px]">
              <li>
                <strong>F01 Xác thực & Global State:</strong> Form validation email/mật khẩu, gọi `loginApi` trả về JWT token và lưu đồng bộ vào Context/useReducer (`authReducer`), lưu trữ bền vững tại `localStorage`.
              </li>
              <li>
                <strong>F02 CRUD & Bất đồng bộ:</strong> Gọi API đọc danh sách, xử lý đủ 4 trạng thái bất đồng bộ (Loading, Success, Error retry, Empty). Tạo/sửa có Form Validation nghiêm ngặt (tên, email độc nhất, số ĐT VN, ngày làm, lương). Xóa an toàn qua Confirm Modal.
              </li>
              <li>
                <strong>F03 Điều hướng:</strong> Header và Sidebar phản hồi động theo `AuthState` (tên người dùng, vai trò Admin/Employee), có nút Đăng xuất xóa sạch Global State.
              </li>
              <li>
                <strong>Kiểm thử (Section 4):</strong> Đã viết Unit Test cho validation & reducer, Integration Test cho API.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Đóng bảng kiểm thử
          </button>
        </div>
      </div>
    </div>
  );
};
