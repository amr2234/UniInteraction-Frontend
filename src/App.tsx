import { BrowserRouter as Router, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import { Toaster } from "./shared/ui/sonner";
import { AppRouter } from "./app/router";
import { QueryProvider } from "./core/lib/QueryProvider";
import { I18nProvider, useI18n } from "./i18n";
import { i18n } from "./i18n/i18n";
import { authApi } from "./features/auth/api/auth.api";
import { isTokenExpired, getCurrentUser } from "./core/lib/authUtils";
import { useRealtimeNotifications } from "./features/notifications/hooks/useRealtimeNotifications";

function AppContent() {
  const { language } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  // Get access token and user info for SignalR
  const accessToken = authApi.getToken();
  const isAuthenticated = accessToken && !isTokenExpired(accessToken);
  const currentUser = getCurrentUser();
  const userIdNumber = currentUser?.userId ? parseInt(currentUser.userId, 10) : 0;
  
  
  
  useRealtimeNotifications(
    isAuthenticated ? userIdNumber : 0,
    isAuthenticated ? accessToken : ''
  );
  

  useEffect(() => {
    const dir = i18n.getLanguage() === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", i18n.getLanguage());
  }, [language]);

  useEffect(() => {
    const checkAuth = () => {
      const token = authApi.getToken();
      const publicRoutes = ['/', '/login', '/register', '/verify-email', '/create-password', '/faqs'];
      // Check exact match for public routes (don't use startsWith for '/')
      const isPublicRoute = publicRoutes.includes(location.pathname) || 
        location.pathname.startsWith('/login') || 
        location.pathname.startsWith('/register') ||
        location.pathname.startsWith('/verify-email') ||
        location.pathname.startsWith('/create-password');
      
      if (isPublicRoute) return;
      
      if (!token || isTokenExpired(token)) {
        authApi.logout();
        navigate('/login', { replace: true });
      }
    };
    
    checkAuth();
  }, [location.pathname, navigate]);

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen">
        <Navbar />
        <AppRouter />
        <Toaster position="top-center" richColors expand={true} />
      </div>
    </>
  );
}

export default function App() {
  return (
    <QueryProvider>
      <I18nProvider>
        <Router>
          <AppContent />
        </Router>
      </I18nProvider>
    </QueryProvider>
  );
}