import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n";

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F4F4] to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-gradient-to-br from-[#875E9E] to-[#6CAEBD] p-6">
            <FileQuestion className="w-16 h-16 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {t("errors.pageNotFound")}
        </h2>
        <p className="text-gray-600 mb-8">
          {t("errors.pageNotFoundDesc")}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="gradient-primary text-white gap-2 rounded-xl">
              <Home className="w-5 h-5" />
              {t("navigation.home")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
