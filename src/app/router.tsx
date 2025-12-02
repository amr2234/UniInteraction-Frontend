import { Routes, Route } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { LoginPage } from "@/features/auth/ui/LoginPage";
import { RegisterPage } from "@/features/auth/ui/RegisterPage";
import { DashboardPage } from "@/features/dashboard/ui/DashboardPage";
import { SubmitSuggestion } from "@/features/requests/ui/SubmitSuggestion";
import { SubmitComplaint } from "@/features/requests/ui/SubmitComplaint";
import { SubmitInquiry } from "@/features/requests/ui/SubmitInquiry";
import { BookVisit } from "@/features/requests/ui/BookVisit";
import { TrackRequestsPage } from "@/features/requests/pages/TrackRequestsPage";
import { RequestDetailsPage } from "@/features/requests/ui/RequestDetails";
import { EditRequestPage } from "@/features/requests/ui/EditRequest";
import { NotificationsPage } from "@/features/notifications/ui/NotificationsPage";
import { ProfilePage } from "@/features/profile/ui/ProfilePage";
import { FAQPage } from "@/features/faq/ui/FAQPage";
import { FAQManagement } from "@/features/faq/admin/FAQManagement";
import { FAQForm } from "@/features/faq/admin/FAQForm";
import { UserManagement } from "@/features/admin/users/UserManagement";
import { UserForm } from "@/features/admin/users/UserForm";
import { LeadershipManagement } from "@/features/admin/leadership/LeadershipManagement";
import { LeadershipForm } from "@/features/admin/leadership/LeadershipForm";
import { MainCategoryManagement } from "@/features/admin/categories/MainCategoryManagement";
import { MainCategoryForm } from "@/features/admin/categories/MainCategoryForm";
import { DepartmentManagement } from "@/features/admin/departments/DepartmentManagement";
import { DepartmentForm } from "@/features/admin/departments/DepartmentForm";
import { SettingsPage } from "@/features/settings/ui/SettingsPage";
import { LogsPage } from "@/features/logs/ui/LogsPage";
import { CalendarPage } from "@/features/calendar/pages/CalendarPage";
// import { SubCategoryManagement } from "@/features/admin/categories/SubCategoryManagement";
// import { SubCategoryForm } from "@/features/admin/categories/SubCategoryForm";
// import { ServiceManagement } from "@/features/admin/services/ServiceManagement";
// import { ServiceForm } from "@/features/admin/services/ServiceForm";
import { ProtectedRoute, AuthenticatedRoute } from "@/core/components/ProtectedRoute";
import { PERMISSIONS } from "@/core/constants/permissions";
import { UserRole } from "@/core/constants/roles";

export function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/preview_page_v2.html" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/faqs" element={<FAQPage />} />
      
      {/* Protected Dashboard Routes - Require Authentication */}
      <Route path="/dashboard" element={<AuthenticatedRoute><DashboardPage /></AuthenticatedRoute>} />
      
      {/* Request Submission Routes - For SuperAdmin, Admin, and Regular Users */}
      <Route path="/dashboard/suggestion" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]} showAccessDenied>
          <SubmitSuggestion />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/complaint" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]} showAccessDenied>
          <SubmitComplaint />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/inquiry" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]} showAccessDenied>
          <SubmitInquiry />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/book-visit" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]} showAccessDenied>
          <BookVisit />
        </ProtectedRoute>
      } />
      
      {/* Track Requests - For SuperAdmin, Admin, Employee, and Users */}
      <Route path="/dashboard/track" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.USER]} showAccessDenied>
          <TrackRequestsPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/request/:id" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.USER]} showAccessDenied>
          <RequestDetailsPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/request/:id/edit" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]} showAccessDenied>
          <EditRequestPage />
        </ProtectedRoute>
      } />
      
      {/* Notifications and Profile - All authenticated users */}
      <Route path="/dashboard/notifications" element={<AuthenticatedRoute><NotificationsPage /></AuthenticatedRoute>} />
      <Route path="/dashboard/profile" element={<AuthenticatedRoute><ProfilePage /></AuthenticatedRoute>} />
      
      {/* Admin Routes - For SuperAdmin and Admin */}
      <Route path="/admin/users" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} showAccessDenied>
          <UserManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/users/new" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} showAccessDenied>
          <UserForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/users/edit/:id" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} showAccessDenied>
          <UserForm />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/faqs" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} showAccessDenied>
          <FAQManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/faqs/new" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} showAccessDenied>
          <FAQForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/faqs/edit/:id" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} showAccessDenied>
          <FAQForm />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/leadership" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} showAccessDenied>
          <LeadershipManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/leadership/new" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} showAccessDenied>
          <LeadershipForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/leadership/edit/:id" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} showAccessDenied>
          <LeadershipForm />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/main-categories" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} showAccessDenied>
          <MainCategoryManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/main-categories/new" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} showAccessDenied>
          <MainCategoryForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/main-categories/edit/:id" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} showAccessDenied>
          <MainCategoryForm />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/departments" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} showAccessDenied>
          <DepartmentManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/departments/new" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} showAccessDenied>
          <DepartmentForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/departments/edit/:id" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} showAccessDenied>
          <DepartmentForm />
        </ProtectedRoute>
      } />
      
      {/* Super Admin Routes - SuperAdmin and Admin can access Settings, only SuperAdmin can access Logs */}
      <Route path="/admin/settings" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN]} showAccessDenied>
          <SettingsPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/logs" element={
        <ProtectedRoute roleId={UserRole.SUPER_ADMIN} showAccessDenied>
          <LogsPage />
        </ProtectedRoute>
      } />
      
      {/* Calendar - For SuperAdmin, Admin, and Employee */}
      <Route path="/admin/calendar" element={
        <ProtectedRoute anyRoleId={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EMPLOYEE]} showAccessDenied>
          <CalendarPage />
        </ProtectedRoute>
      } />
      
      {/* Subcategory and Service routes temporarily disabled */}
      {/* 
      <Route path="/admin/sub-categories" element={
        <ProtectedRoute roleId={UserRole.ADMIN} showAccessDenied>
          <SubCategoryManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/sub-categories/new" element={
        <ProtectedRoute roleId={UserRole.ADMIN} showAccessDenied>
          <SubCategoryForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/sub-categories/edit/:id" element={
        <ProtectedRoute roleId={UserRole.ADMIN} showAccessDenied>
          <SubCategoryForm />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/services" element={
        <ProtectedRoute roleId={UserRole.ADMIN} showAccessDenied>
          <ServiceManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/services/new" element={
        <ProtectedRoute roleId={UserRole.ADMIN} showAccessDenied>
          <ServiceForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/services/edit/:id" element={
        <ProtectedRoute roleId={UserRole.ADMIN} showAccessDenied>
          <ServiceForm />
        </ProtectedRoute>
      } />
      */}
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
