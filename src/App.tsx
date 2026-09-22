import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LoginView } from './components/LoginView';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { EmployeeTable } from './components/EmployeeTable';
import { DepartmentStats } from './components/DepartmentStats';
import { ProfileView } from './components/ProfileView';
import { TestingSuiteModal } from './components/TestingSuiteModal';

const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [currentTab, setCurrentTab] = useState<'employees' | 'analytics' | 'profile'>(
    user?.role === 'admin' ? 'employees' : 'profile'
  );
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [testSuiteOpen, setTestSuiteOpen] = useState(false);

  // Enforce access control: Employee can ONLY view profile
  useEffect(() => {
    if (user && !isAdmin && currentTab !== 'profile') {
      setCurrentTab('profile');
    }
  }, [user, isAdmin, currentTab]);

  // If not authenticated, render LoginView (SRS F01 requirement)
  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Dynamic Header based on Global State (SRS F03 requirement) */}
      <Navbar
        onToggleSidebar={() => setSidebarOpenMobile(true)}
        onOpenTestSuite={() => setTestSuiteOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Dynamic Sidebar based on Global State (SRS F03 requirement) */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isOpenMobile={sidebarOpenMobile}
          onCloseMobile={() => setSidebarOpenMobile(false)}
          onOpenTestSuite={() => setTestSuiteOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {isAdmin && currentTab === 'employees' && <EmployeeTable />}
            {isAdmin && currentTab === 'analytics' && <DepartmentStats />}
            {currentTab === 'profile' && <ProfileView />}
            {!isAdmin && currentTab !== 'profile' && <ProfileView />}
          </div>
        </main>
      </div>

      {/* Defense Case Study 3 Automated Testing Suite */}
      <TestingSuiteModal
        isOpen={testSuiteOpen}
        onClose={() => setTestSuiteOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainLayout />
      </ToastProvider>
    </AuthProvider>
  );
}
