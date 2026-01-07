import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  Bell,
  ChevronLeft,
  Clock,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  Lightbulb,
  Calendar,
  FileSearch,
  User,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  
} from "lucide-react";
import logoImage from "figma:asset/feafe15647caf57cbb0488bb53100be4d28ef084.png";
import { useUserDashboard } from "./UserDashboard.logic";

export function UserDashboard() {
  const {
    t,
    quickStats,
    mainServices,
    quickLinks,
    recentActivity,
    getUserDisplayName,
  } = useUserDashboard();

  return (
    <>
      <div className="min-h-screen bg-[#F4F4F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Hero Section */}
          <div className="mb-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#6CAEBD] via-[#5A9FB0] to-[#875E9E] rounded-3xl shadow-2xl">
              {/* Enhanced Decorative elements with animations */}
              <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#875E9E]/30 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#EABB4E]/10 rounded-full blur-3xl"></div>
              
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
              
              <div className="relative z-10 p-8 sm:p-12">
                {/* Header Section with improved layout */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
                  <div className="flex-1 max-w-3xl">
                    {/* Greeting badge */}
                    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/20">
                      <Sparkles className="w-4 h-4 text-[#EABB4E] animate-pulse" />
                      <span className="text-white/90 text-sm font-medium">{t("dashboard.user.welcome")}</span>
                    </div>
                    
                    {/* Main heading with enhanced typography */}
                    <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight">
                      {t("dashboard.user.welcomeBack")}
                      <br />
                      <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                        {getUserDisplayName()}
                      </span>
                    </h1>
                    
                    {/* Subtitle with better readability */}
                    <p className="text-white/95 text-lg sm:text-xl font-light leading-relaxed">
                      {t("dashboard.user.howCanWeHelp")}
                    </p>
                  </div>
                  
                  {/* Enhanced action area */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6" 
                  style={{ marginBottom: "1rem" }}>
                    <Link to="/dashboard/track" className="w-full sm:w-auto">
                      <button className=" sm:w-auto group bg-white hover:bg-white/95 text-black px-8 py-4  rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg flex items-center justify-center gap-3">
                        <FileSearch className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span>{t("dashboard.user.quickLinks.trackRequests")}</span>
                        <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                    <div className="hidden lg:block">
                      <img 
                        src={logoImage} 
                        alt="جامعة سليمان الراجحي" 
                        className="h-24 opacity-95 drop-shadow-2xl" 
                      />
                    </div>
                  </div>
                </div>

                {/* Enhanced Quick Stats Cards */}
                <div className="grid grid-cols-2  gap-2 sm:gap-6 max-w-5xl" 
               >
                  {quickStats.map((stat, index) => (
                    <Link key={index} to="/dashboard/track">
                      <div className="group relative bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl cursor-pointer overflow-hidden">
                        {/* Animated gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="relative z-10 flex items-center gap-4">
                          {/* Icon with enhanced styling */}
                          <div className="w-16 h-16 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0">
                            <stat.icon className="w-8 h-8 text-white drop-shadow-lg" strokeWidth={2.5} />
                          </div>
                          
                          {/* Content with improved typography */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-white text-4xl sm:text-5xl font-bold leading-none tracking-tight drop-shadow-md">
                                {stat.value}
                              </span>
                              <span className="text-white/90 text-sm font-semibold">
                                {stat.label}
                              </span>
                            </div>
                            <p className="text-white/90 text-base font-medium">
                              {stat.description}
                            </p>
                          </div>
                          
                          {/* Arrow indicator */}
                          <ChevronLeft className="w-5 h-5 text-white/60 group-hover:text-white group-hover:-translate-x-1 transition-all flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Services - Responsive grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#2B2B2B]">{t("dashboard.user.services.howCanWeHelp")}</h2>
            </div>
            
            {/* Grid: 2 columns on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
              {mainServices.map((service, index) => (
                <Link key={index} to={service.link}>
                  <Card className="group relative overflow-hidden bg-white border-0 shadow-soft hover:shadow-soft-lg rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                    
                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                      </div>
                      <h3 className="text-[#2B2B2B] mb-2">{service.title}</h3>
                      <p className="text-[#6F6F6F] text-sm leading-relaxed mb-4">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-2 text-[#6CAEBD] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>{t("dashboard.user.services.startNow")}</span>
                        <ChevronLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="grid lg:grid-cols-1 gap-6">
            <div>
              <Card className="bg-white border-0 shadow-soft rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#6CAEBD]/10 flex items-center justify-center">
                      <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#6CAEBD]" />
                    </div>
                    <h3 className="text-[#2B2B2B] text-base sm:text-lg">{t("dashboard.user.updates.title")}</h3>
                  </div>
                  <Link to="/dashboard/track" className="text-[#6CAEBD] hover:text-[#875E9E] text-xs sm:text-sm flex items-center gap-1 transition-colors">
                    <span className="hidden sm:inline">{t("dashboard.user.updates.viewAll")}</span>
                    <span className="sm:hidden">الكل</span>
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Link>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity: any, index: any) => (
                      <Link key={index} to={`/dashboard/request/${activity.id}`}>
                        <div className="flex items-start gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-[#F4F4F4]/50 hover:bg-[#F4F4F4] hover:shadow-soft transition-all duration-200 cursor-pointer group">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${activity.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                            <activity.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${activity.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#2B2B2B] text-sm sm:text-base mb-1 truncate group-hover:text-[#6CAEBD] transition-colors">
                              {activity.title}
                            </p>
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-[#6F6F6F]">
                              <span className={`${activity.color} truncate max-w-[100px] sm:max-w-none`}>{activity.status}</span>
                              <span className="text-gray-300">•</span>
                              <span className="truncate">{activity.date}</span>
                            </div>
                          </div>
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#6F6F6F] flex-shrink-0 group-hover:text-[#6CAEBD] group-hover:-translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#F4F4F4] flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-[#6F6F6F]" />
                      </div>
                      <p className="text-[#6F6F6F] text-sm sm:text-base mb-2">{t("dashboard.user.updates.noUpdates")}</p>
                      <p className="text-[#6F6F6F] text-xs sm:text-sm">{t("dashboard.user.updates.noUpdatesDesc")}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}