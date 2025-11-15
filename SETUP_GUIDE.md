# HR Management Client - React TypeScript Application

Ứng dụng quản lý nhân sự được xây dựng với React, TypeScript và Tailwind CSS.

## 📋 Tổng quan

Hệ thống HR Management bao gồm 4 modules chính:

1. **Request Management** - Quản lý yêu cầu (nghỉ phép, check-in/out, WFH, timesheet)
2. **Profile Management** - Quản lý hồ sơ nhân viên
3. **Activity Management** - Quản lý hoạt động và chứng nhận
4. **Reward Management** - Quản lý điểm thưởng và đổi quà

## 🏗️ Cấu trúc dự án

```
src/
├── contexts/              # React Contexts (Auth, Theme, etc.)
│   └── AuthContext.tsx
├── modules/              # Feature modules
│   ├── request/          # Request Management
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── profile/          # Profile Management
│   ├── activity/         # Activity Management
│   └── reward/           # Reward Management
├── routes/               # Application routing
│   └── index.tsx
├── services/             # Global services
│   ├── api.client.ts
│   └── auth.service.ts
├── shared/               # Shared resources
│   ├── components/       # Reusable components
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── LoginPage.tsx
│   │   ├── Dashboard.tsx
│   │   └── UnauthorizedPage.tsx
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript types
│   │   ├── common.types.ts
│   │   ├── user.types.ts
│   │   └── index.ts
│   └── utils/            # Utility functions
├── App.js
└── index.js
```

## 🚀 Cài đặt và chạy

### Yêu cầu

- Node.js >= 14.x
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### Chạy development server

```bash
npm start
# hoặc
yarn start
```

Ứng dụng sẽ chạy tại: http://localhost:3000

### Build production

```bash
npm run build
# hoặc
yarn build
```

## 🔑 Tính năng đã triển khai

### ✅ Đã hoàn thành

- [x] Cấu trúc dự án theo module
- [x] TypeScript types/interfaces cho tất cả entities
- [x] Authentication Context với JWT
- [x] API Client với Axios và interceptors
- [x] Protected Routes với phân quyền (Employee, Manager, HR, Admin)
- [x] Responsive layout với Tailwind CSS
- [x] Header và Sidebar navigation
- [x] Login Page
- [x] Dashboard
- [x] Routing cho tất cả modules

### 🚧 Đang phát triển

- [ ] Request Module pages
- [ ] Profile Module pages
- [ ] Activity Module pages
- [ ] Reward Module pages
- [ ] Form validation
- [ ] Error handling UI
- [ ] Loading states
- [ ] Notifications/Toasts
- [ ] Data fetching với React Query

## 🎨 UI/UX

Ứng dụng sử dụng **Tailwind CSS** cho styling với:

- Responsive design
- Modern và clean interface
- Consistent color scheme
- Accessible components

### Theme colors

- Primary: Blue (#1976d2)
- Secondary: Gray
- Success: Green
- Warning: Yellow
- Error: Red

## 🔐 Authentication

Hệ thống sử dụng JWT authentication với:

- Access Token
- Refresh Token
- Auto refresh khi token hết hạn
- Protected routes theo vai trò

### User Roles

- **EMPLOYEE**: Nhân viên thông thường
- **MANAGER**: Quản lý team
- **HR**: Nhân sự
- **ADMIN**: Quản trị viên

## 📡 API Integration

### Base URL

Cấu hình trong `.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

### API Services

- `authService`: Login, logout, refresh token
- `apiClient`: Axios instance với interceptors

## 🧪 Testing

```bash
npm test
# hoặc
yarn test
```

## 📝 TypeScript

Dự án sử dụng TypeScript với strict mode để:

- Type safety
- Better IDE support
- Easier refactoring
- Self-documenting code

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

Private - Dự án nội bộ

## 👥 Team

- Development Team: Group 01
- Version: 1.0.0

## 📞 Liên hệ

Để được hỗ trợ, vui lòng liên hệ team phát triển.
