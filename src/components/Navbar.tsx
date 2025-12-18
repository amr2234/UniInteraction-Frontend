import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import logoImage from "@/assets/Logo-Test.png";
import { NotificationBell } from "./NotificationBell";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useI18n } from "@/i18n";
import { authApi } from "@/features/auth/api/auth.api";

export function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = authApi.isAuthenticated();
  const { t } = useI18n();

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img 
              src={logoImage} 
              alt={t("common.appName")} 
              className="h-14"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <LanguageSwitcher />
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <Button className="gradient-primary hover:opacity-90 transition rounded-xl">
                    {t("auth.login")}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <NotificationBell />
                <button
                  onClick={() => {
                    authApi.logout();
                    window.location.href = "/login";
                  }}
                  className="p-2 text-[#6F6F6F] hover:text-red-500 transition"
                  title={t("auth.logout")}
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <Link to="/dashboard/profile">
                  <Button variant="outline" className="flex items-center gap-2 rounded-xl border-[#6CAEBD] text-[#6CAEBD] hover:bg-[#6CAEBD] hover:text-white">
                    <User className="w-4 h-4" />
                    <span>{t("navigation.profile")}</span>
                  </Button>
                </Link>
              </>
            )}
          </nav>

          <button
            className="md:hidden p-2 text-[#6F6F6F]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              {!isLoggedIn ? (
                <>
                  <Link to="/login">
                    <Button className="gradient-primary hover:opacity-90 transition w-full rounded-xl">
                      {t("auth.login")}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard/profile" className="text-[#6F6F6F] hover:text-[#6CAEBD] transition">
                    {t("navigation.profile")}
                  </Link>
                  <button
                    onClick={() => {
                      authApi.logout();
                      window.location.href = "/login";
                    }}
                    className="text-left text-[#6F6F6F] hover:text-red-500 transition"
                  >
                    {t("auth.logout")}
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
