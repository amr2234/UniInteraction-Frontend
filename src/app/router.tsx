import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import {
  ProtectedRoute,
  AuthenticatedRoute,
} from "@/core/Auth/ProtectedRoute";
import { UserRole } from "@/core/constants/roles";

// Lazy load all page components
const LandingPage = lazy(() => import("@/features/pages/LandingPage").then(m => ({ default: m.LandingPage })));
const NotFoundPage = lazy(() => import("@/features/pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const LoginPage = lazy(() => import("@/features/auth/ui/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("@/features/auth/ui/RegisterPage").then(m => ({ default: m.RegisterPage })));
const Dashboard = lazy(() => import("@/features/dashboard/ui/Dashboard").then(m => ({ default: m.Dashboard })));
const ComplaintPage = lazy(() => import("@/features/requests/pages/ComplaintPage").then(m => ({ default: m.ComplaintPage })));
const InquiryPage = lazy(() => import("@/features/requests/pages/InquiryPage").then(m => ({ default: m.InquiryPage })));
const VisitPage = lazy(() => import("@/features/requests/pages/VisitPage").then(m => ({ default: m.VisitPage })));
const TrackRequestsPage = lazy(() => import("@/features/requests/pages/TrackRequests").then(m => ({ default: m.TrackRequestsPage })));
const RequestDetailsPage = lazy(() => import("@/features/requests/ui/RequestDetails/RequestDetails").then(m => ({ default: m.RequestDetailsPage })));
const EditRequestPage = lazy(() => import("@/features/requests/ui/EditRequest/EditRequest").then(m => ({ default: m.EditRequestPage })));
const NotificationsPage = lazy(() => import("@/features/notifications/ui/NotificationsPage").then(m => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import("@/features/profile/ui/ProfilePage/ProfilePage").then(m => ({ default: m.ProfilePage })));
const FAQPage = lazy(() => import("@/features/faq/ui/FAQPage").then(m => ({ default: m.FAQPage })));
const FAQManagement = lazy(() => import("@/features/admin/faqs/Table/FAQManagement").then(m => ({ default: m.FAQManagement })));
const FAQForm = lazy(() => import("@/features/admin/faqs/Form/FAQForm").then(m => ({ default: m.FAQForm })));
const UserManagement = lazy(() => import("@/features/admin/users/Table/UserManagement").then(m => ({ default: m.UserManagement })));
const UserForm = lazy(() => import("@/features/admin/users").then(m => ({ default: m.UserForm })));
const LeadershipManagement = lazy(() => import("@/features/admin/leadership").then(m => ({ default: m.LeadershipManagement })));
const LeadershipForm = lazy(() => import("@/features/admin/leadership").then(m => ({ default: m.LeadershipForm })));
const MainCategoryManagement = lazy(() => import("@/features/admin/categories").then(m => ({ default: m.MainCategoryManagement })));
const MainCategoryForm = lazy(() => import("@/features/admin/categories").then(m => ({ default: m.MainCategoryForm })));
const DepartmentManagement = lazy(() => import("@/features/admin/departments").then(m => ({ default: m.DepartmentManagement })));
const DepartmentForm = lazy(() => import("@/features/admin/departments").then(m => ({ default: m.DepartmentForm })));
const SettingsPage = lazy(() => import("@/features/admin/settings/SettingsPage").then(m => ({ default: m.SettingsPage })));
const LogsPage = lazy(() => import("@/features/admin/logs/LogsPage").then(m => ({ default: m.LogsPage })));
const CalendarPage = lazy(() => import("@/features/calendar/pages/CalendarPage").then(m => ({ default: m.CalendarPage })));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
      {}
      <Route path="/" element={<LandingPage />} />
      <Route path="/preview_page_v2.html" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/faqs" element={<FAQPage />} />

      {}
      <Route
        path="/dashboard"
        element={
          <AuthenticatedRoute>
            <Dashboard />
          </AuthenticatedRoute>
        }
      />

      <Route
        path="/dashboard/complaint"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]}
            showAccessDenied
          >
            <ComplaintPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/suggestion"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]}
            showAccessDenied
          >
            <ComplaintPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/inquiry"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]}
            showAccessDenied
          >
            <InquiryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/book-visit"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]}
            showAccessDenied
          >
            <VisitPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/track"
        element={
          <ProtectedRoute
            anyRoleId={[
              UserRole.SUPER_ADMIN,
              UserRole.ADMIN,
              UserRole.EMPLOYEE,
              UserRole.USER,
            ]}
            showAccessDenied
          >
            <TrackRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/request/:id"
        element={
          <ProtectedRoute
            anyRoleId={[
              UserRole.SUPER_ADMIN,
              UserRole.ADMIN,
              UserRole.EMPLOYEE,
              UserRole.USER,
            ]}
            showAccessDenied
          >
            <RequestDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/request/:id/edit"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]}
            showAccessDenied
          >
            <EditRequestPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/notifications"
        element={
          <AuthenticatedRoute>
            <NotificationsPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <AuthenticatedRoute>
            <ProfilePage />
          </AuthenticatedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
            showAccessDenied
          >
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/new"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
            showAccessDenied
          >
            <UserForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/edit/:id"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
            showAccessDenied
          >
            <UserForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/faqs"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
            showAccessDenied
          >
            <FAQManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/faqs/new"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
            showAccessDenied
          >
            <FAQForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/faqs/edit/:id"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
            showAccessDenied
          >
            <FAQForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/leadership"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
            showAccessDenied
          >
            <LeadershipManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leadership/new"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
            showAccessDenied
          >
            <LeadershipForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leadership/edit/:id"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
            showAccessDenied
          >
            <LeadershipForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/main-categories"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
            showAccessDenied
          >
            <MainCategoryManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/main-categories/new"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
            showAccessDenied
          >
            <MainCategoryForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/main-categories/edit/:id"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
            showAccessDenied
          >
            <MainCategoryForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/departments"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
            showAccessDenied
          >
            <DepartmentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/departments/new"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
            showAccessDenied
          >
            <DepartmentForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/departments/edit/:id"
        element={
          <ProtectedRoute
            anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
            showAccessDenied
          >
            <DepartmentForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN]} showAccessDenied>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/logs"
        element={
          <ProtectedRoute roleId={UserRole.SUPER_ADMIN} showAccessDenied>
            <LogsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/calendar"
        element={
          <ProtectedRoute
            anyRoleId={[
              UserRole.SUPER_ADMIN,
              UserRole.ADMIN,
              UserRole.EMPLOYEE,
            ]}
            showAccessDenied
          >
            <CalendarPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
