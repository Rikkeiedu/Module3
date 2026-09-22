# Hệ thống Quản lý Nhân sự HRM

Một ứng dụng web quản lý nhân sự được xây dựng bằng React + Vite, hỗ trợ đăng nhập theo vai trò, quản lý danh sách nhân viên, xem thống kê phòng ban và quản lý hồ sơ cá nhân.

## Mục tiêu dự án

Dự án này mô phỏng một hệ thống HRM doanh nghiệp với các tính năng cơ bản như:

- Đăng nhập và phân quyền người dùng
- Quản lý nhân sự: xem, thêm, xóa nhân viên
- Tìm kiếm, lọc, sắp xếp và phân trang dữ liệu
- Thống kê theo phòng ban và trạng thái nhân viên
- Hồ sơ cá nhân cho nhân viên
- Giao diện dễ dùng, thân thiện với người dùng
- Bộ kiểm thử nội bộ để mô phỏng đánh giá chức năng

## Công nghệ sử dụng

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- LocalStorage để lưu dữ liệu demo

## Tính năng chính

### 1. Đăng nhập và phân quyền

- Tài khoản Admin: truy cập toàn bộ hệ thống quản lý nhân sự
- Tài khoản Employee: chỉ được xem hồ sơ cá nhân, không thể truy cập danh sách nhân viên và thống kê
- Xử lý lỗi đăng nhập và kiểm tra định dạng email, mật khẩu

### 2. Quản lý nhân viên

- Hiển thị danh sách nhân viên
- Tìm kiếm theo tên hoặc mã nhân viên
- Lọc theo phòng ban và trạng thái
- Sắp xếp theo tên, ngày tuyển dụng, lương hoặc mã nhân viên
- Phân trang dữ liệu
- Thêm/sửa/xóa nhân viên tương tác trực tiếp trên giao diện

### 3. Thống kê phòng ban

- Tổng số nhân viên theo từng bộ phận
- Tỷ lệ nhân viên đang làm việc, thử việc, nghỉ phép, đã chấm dứt
- Hiển thị thông tin nhanh về tình hình nhân sự

### 4. Hồ sơ cá nhân

- Nhân viên có thể xem thông tin cá nhân của mình
- Cập nhật thông tin cơ bản nếu cần
- Giao diện tùy chỉnh theo vai trò người dùng

### 5. Testing Suite

- Có bộ kiểm tra tích hợp/đơn vị để kiểm tra logic validation, reducer, API mock
- Hỗ trợ đánh giá chức năng và đảm bảo tính ổn định của hệ thống

## Tài khoản demo

Bạn có thể dùng các tài khoản sau để đăng nhập nhanh:

| Vai trò         | Email           | Mật khẩu   | Quyền truy cập           |
| ---------------- | --------------- | ------------ | -------------------------- |
| Quản trị viên | admin@hrm.vn    | Admin@123    | Toàn quyền hệ thống    |
| Nhân viên      | nhanvien@hrm.vn | Employee@123 | Chỉ xem hồ sơ cá nhân |

## Cấu trúc thư mục

```text
.
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── types.ts
│   ├── components/
│   │   ├── ConfirmDeleteModal.tsx
│   │   ├── DepartmentStats.tsx
│   │   ├── EmployeeDetailModal.tsx
│   │   ├── EmployeeModal.tsx
│   │   ├── EmployeeTable.tsx
│   │   ├── LoginView.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProfileView.tsx
│   │   ├── Sidebar.tsx
│   │   └── TestingSuiteModal.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   ├── services/
│   │   └── api.ts
│   ├── tests/
│   │   └── testRunner.ts
│   └── utils/
│       └── validation.ts
└── public/
```

## Yêu cầu hệ thống

- Node.js 18+ hoặc 20+
- npm hoặc yarn
- Trình duyệt hiện đại: Chrome, Edge, Firefox

## Hướng dẫn chạy dự án

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Khởi chạy ứng dụng ở môi trường dev

```bash
npm run dev
```

Sau đó mở trình duyệt và truy cập:

```text
http://localhost:3000
```

### 3. Build production

```bash
npm run build
```

### 4. Xem preview bản build

```bash
npm run preview
```

## Script có sẵn

```bash
npm run dev      # chạy ứng dụng ở chế độ phát triển
npm run build    # build production
npm run preview  # xem build đã build
npm run lint     # kiểm tra TypeScript
```

## Lưu ý

- Dữ liệu ứng dụng được lưu trên LocalStorage để mô phỏng backend trong môi trường demo.
- Đây là một dự án demo/ứng dụng học tập, không phải backend thật.
- Tài khoản demo được dựng sẵn để thuận tiện cho việc kiểm thử và trình diễn.

## Ghi chú phát triển

Dự án này có thể được mở rộng bằng các tính năng sau:

- Kết nối thực tế với API Node.js/Express hoặc backend Spring Boot
- Xác thực JWT thực tế
- Quản lý upload avatar
- Bảo mật quyền truy cập ở backend
- Báo cáo thống kê nâng cao bằng biểu đồ
- Cơ chế lưu trữ dữ liệu trên database thực

## Tác giả

Dự án được phát triển trong khuôn khổ bài tập/module về hệ thống quản lý nhân sự HRM.
