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
import { isTokenExpired } from "./core/lib/authUtils";

function AppContent() {
  const { language } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const dir = i18n.getLanguage() === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", i18n.getLanguage());
  }, [language]);

  useEffect(() => {
    const checkAuth = () => {
      const token = authApi.getToken();
            const publicRoutes = ['/', '/login', '/register'];
      const isPublicRoute = publicRoutes.some(route => location.pathname === route || location.pathname.startsWith(route));
      
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
        <Toaster position="top-center" richColors />
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