import { Routes, Route } from "react-router-dom";
import { LandingPage } from "@/features/pages/LandingPage";
import { NotFoundPage } from "@/features/pages/NotFoundPage";
import { LoginPage } from "@/features/auth/ui/LoginPage";
import { RegisterPage } from "@/features/auth/ui/RegisterPage";
import { DashboardPage } from "@/features/dashboard/ui/DashboardPage";
import { ComplaintPage } from "@/features/requests/pages/ComplaintPage";
import { InquiryPage } from "@/features/requests/pages/InquiryPage";
import { VisitPage } from "@/features/requests/pages/VisitPage";
import { TrackRequestsPage } from "@/features/requests/pages/TrackRequestsPage";
import { RequestDetailsPage } from "@/features/requests/ui/RequestDetails";
import { EditRequestPage } from "@/features/requests/ui/EditRequest";
import { NotificationsPage } from "@/features/notifications/ui/NotificationsPage";
import { ProfilePage } from "@/features/profile/ui/ProfilePage";
import { FAQPage } from "@/features/faq/ui/FAQPage";
import { FAQManagement } from "@/features/admin/faqs/Table/FAQManagement";
import { FAQForm } from "@/features/admin/faqs/Form/FAQForm";
import { UserManagement } from "@/features/admin/users/Table/UserManagement";
import { UserForm } from "@/features/admin/users";
import {
  LeadershipManagement,
  LeadershipForm,
} from "@/features/admin/leadership";
import {
  MainCategoryManagement,
  MainCategoryForm,
} from "@/features/admin/categories";
import {
  DepartmentManagement,
  DepartmentForm,
} from "@/features/admin/departments";
import { SettingsPage } from "@/features/admin/settings/SettingsPage";
import { LogsPage } from "@/features/admin/logs/LogsPage";
import { CalendarPage } from "@/features/calendar/pages/CalendarPage";

import {
  ProtectedRoute,
  AuthenticatedRoute,
} from "@/core/components/ProtectedRoute";
import { PERMISSIONS } from "@/core/constants/permissions";
import { UserRole } from "@/core/constants/roles";

export function AppRouter() {
  return (
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
            <DashboardPage />
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
  );
}
