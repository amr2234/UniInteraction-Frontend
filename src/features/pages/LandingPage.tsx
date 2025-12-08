import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { motion } from "motion/react";
import { useState } from "react";
import { authApi } from "@/features/auth/api/auth.api";
import { useUserRole } from "@/core/hooks";
import {
  AlertCircle,
  HelpCircle,
  Calendar,
  FileText,
  Users,
  GraduationCap,
  Briefcase,
  Shield,
  Target,
  Eye,
  Award,
  TrendingUp,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronLeft,
  MessageCircle,
} from "lucide-react";
import logoImage from "@/assets/3ed7ad000b3c6c19b182fbe3a9d4158789dc4548.png";
import { useI18n } from "@/i18n";

export function LandingPage() {
  const { t } = useI18n();
  const [activeService, setActiveService] = useState<number | null>(null);
  const isLoggedIn = authApi.isAuthenticated();
  const { isAdmin, isEmployee, isUser } = useUserRole();

  const services = [
    {
      icon: AlertCircle,
      title: t("requests.submitComplaint"),
      description: t("requests.submitComplaintDesc"),
      link: "/dashboard/complaint",
      color: "from-[#875E9E] to-[#6CAEBD]",
      bgColor: "bg-purple-50",
    },
    {
      icon: HelpCircle,
      title: t("requests.submitInquiry"),
      description: t("requests.submitInquiryDesc"),
      link: "/dashboard/inquiry",
      color: "from-[#6CAEBD] to-[#875E9E]",
      bgColor: "bg-blue-50",
    },
    {
      icon: Calendar,
      title: t("requests.bookVisit"),
      description: t("requests.bookVisitDesc"),
      link: "/dashboard/book-visit",
      color: "from-[#EABB4E] to-[#6CAEBD]",
      bgColor: "bg-yellow-50",
    },
  ];

  const userTypes = [
    {
      icon: GraduationCap,
      title: t("landing.userTypes.students"),
      description: t("landing.userTypes.studentsDesc"),
      count: "+15,000",
    },
    {
      icon: Briefcase,
      title: t("landing.userTypes.employees"),
      description: t("landing.userTypes.employeesDesc"),
      count: "+2,500",
    },
    {
      icon: Shield,
      title: t("landing.userTypes.visitors"),
      description: t("landing.userTypes.visitorsDesc"),
      count: "+5,000",
    },
  ];

  const stats = [
    { number: "15,000+", label: t("landing.stats.students"), icon: GraduationCap },
    { number: "2,500+", label: t("landing.stats.employees"), icon: Users },
    { number: "50,000+", label: t("landing.stats.completedRequests"), icon: CheckCircle },
    { number: "98%", label: t("landing.stats.satisfaction"), icon: Award },
  ];

  const aboutFeatures = [
    {
      icon: Target,
      title: t("landing.aboutUs.mission"),
      description: t("landing.aboutUs.missionDesc"),
    },
    {
      icon: Eye,
      title: t("landing.aboutUs.vision"),
      description: t("landing.aboutUs.visionDesc"),
    },
    {
      icon: Award,
      title: t("landing.aboutUs.values"),
      description: t("landing.aboutUs.valuesDesc"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F4F4] to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-primary text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h1 className="mb-6">
                  {t("landing.hero.title")}
                </h1>
              </motion.div>
              
              <motion.p
                className="text-xl mb-8 text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {t("landing.hero.description")}
              </motion.p>
              
              <motion.div
                className="flex flex-wrap gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {/* Show Login button only if not logged in */}
                {!isLoggedIn && (
                  <Link to="/login">
                    <Button size="lg" className="bg-white text-[#6CAEBD] hover:bg-white/90 transition rounded-xl gap-2 h-14 px-8 shadow-soft-lg">
                      <Shield className="w-5 h-5" />
                      {t("landing.hero.loginButton")}
                    </Button>
                  </Link>
                )}
                
                {/* Show Dashboard button if logged in */}
                {isLoggedIn && (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-white text-[#6CAEBD] hover:bg-white/90 transition rounded-xl gap-2 h-14 px-8 shadow-soft-lg">
                      {t("landing.hero.dashboardButton")}
                    </Button>
                  </Link>
                )}
                
                {/* Show Track Requests only for Admin and Employee */}
                {(isAdmin || isEmployee) && (
                  <Link to="/dashboard/track">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-xl h-14 px-8">
                      {t("landing.hero.trackRequests")}
                    </Button>
                  </Link>
                )}
              </motion.div>

              <motion.div
                className="grid grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {/* Show service quick links only for regular users or non-employees */}
                {(isUser || !isLoggedIn) && [
                  { to: "/dashboard/complaint", label: t("requests.submitComplaint") },
                  { to: "/dashboard/inquiry", label: t("requests.submitInquiry") },
                  { to: "/dashboard/book-visit", label: t("requests.bookVisit") },
                  { to: "/faqs", label: t("navigation.faq") },
                ].map((item, index) => (
                  <Link key={index} to={item.to}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm rounded-xl">
                        {item.label}
                      </Button>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="hidden md:flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="relative w-full h-96 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"
                  animate={{ rotate: [6, 8, 6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"
                  animate={{ rotate: [-6, -8, -6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={logoImage} alt="جامعة سليمان الراجحي" className="w-full max-w-md" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Animated Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" className="w-full h-16">
            <motion.path
              d="M0,50 C320,90 420,10 740,50 C1060,90 1160,10 1440,50 L1440,100 L0,100 Z"
              fill="white"
              initial={{ d: "M0,50 C320,90 420,10 740,50 C1060,90 1160,10 1440,50 L1440,100 L0,100 Z" }}
              animate={{ d: "M0,50 C320,10 420,90 740,50 C1060,10 1160,90 1440,50 L1440,100 L0,100 Z" }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="p-6 hover:shadow-soft-lg transition-all hover:-translate-y-2 rounded-xl border-0 shadow-soft">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <motion.h3
                    className="text-[#6CAEBD] mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                  >
                    {stat.number}
                  </motion.h3>
                  <p className="text-[#6F6F6F] text-sm">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[#6CAEBD] mb-4">{t("landing.userTypes.title")}</h2>
          <p className="text-[#6F6F6F] max-w-7xl mx-auto">
            {t("landing.userTypes.description")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {userTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <Card className="p-8 hover:shadow-soft-lg transition-all border-0 shadow-soft rounded-xl h-full">
                <motion.div
                  className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <type.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-[#2B2B2B] mb-2">{type.title}</h3>
                <p className="text-[#6F6F6F] mb-4">{type.description}</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#EABB4E]" />
                  <span className="text-2xl font-bold text-[#6CAEBD]">{type.count}</span>
                  <span className="text-sm text-[#6F6F6F]">{t("landing.userTypes.title").split(" ")[1]}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-[#F4F4F4] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[#6CAEBD] mb-4">{t("landing.services.title")}</h2>
            <p className="text-[#6F6F6F] max-w-7xl mx-auto">
              {t("landing.services.description")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onHoverStart={() => setActiveService(index)}
                onHoverEnd={() => setActiveService(null)}
              >
                <Link to={service.link}>
                  <Card className="p-6 hover:shadow-soft-lg transition-all hover:-translate-y-2 cursor-pointer group h-full relative overflow-hidden rounded-xl border-0 shadow-soft bg-white">
                    <motion.div
                      className={`absolute inset-0 ${service.bgColor} opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                    <div className="relative z-10">
                      <motion.div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}
                        animate={activeService === index ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <service.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <h4 className="text-[#2B2B2B] mb-2">{service.title}</h4>
                      <p className="text-[#6F6F6F] text-sm mb-4">{service.description}</p>
                      <div className="flex items-center gap-2 text-[#6CAEBD] text-sm">
                        <span>{t("landing.services.startNow")}</span>
                        <motion.div
                          animate={activeService === index ? { x: -5 } : { x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[#6CAEBD] mb-4">{t("landing.aboutUs.title")}</h2>
            <p className="text-[#6F6F6F] max-w-7xl mx-auto text-lg">
              {t("landing.aboutUs.description")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {aboutFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Card className="p-8 h-full hover:shadow-soft-lg transition-all hover:-translate-y-2 border-0 shadow-soft rounded-xl">
                  <motion.div
                    className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-[#2B2B2B] mb-3">{feature.title}</h3>
                  <p className="text-[#6F6F6F] leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Why Choose Us */}
          <motion.div
            className="gradient-primary rounded-2xl p-12 text-white shadow-soft-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="mb-6">{t("landing.whyUs.title")}</h3>
                <div className="space-y-4">
                  {[
                    t("landing.whyUs.reasons.1"),
                    t("landing.whyUs.reasons.2"),
                    t("landing.whyUs.reasons.3"),
                    t("landing.whyUs.reasons.4"),
                    t("landing.whyUs.reasons.5"),
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                      <p className="text-white/90">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.div
                className="flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <div className="w-48 h-48 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Award className="w-24 h-24 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Hide for regular users, show only for non-logged-in visitors */}
      {!isLoggedIn && (
      <section className="gradient-primary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <h2 className="mb-4 text-center">{t("landing.cta.title")}</h2>
            <p className="text-xl text-white/90 mb-8 text-center">
              {t("landing.cta.description")}
            </p>
            <Link to="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-white text-[#6CAEBD] hover:bg-white/90 gap-2 h-14 px-10 rounded-xl shadow-soft-lg">
                  {t("landing.hero.loginButton")}
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
      )}

      {/* Footer */}
      <footer className="bg-[#2B2B2B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* About Column */}
            <div className="md:col-span-1">
              <div className="mb-4">
                <img src={logoImage} alt="جامعة سليمان الراجحي" className="h-20 brightness-0 invert" />
              </div>
              <p className="text-gray-400 text-sm mb-4">
                منصة الجامعة التفاعلية هي بوابتك الموحدة لجميع الخدمات الإلكترونية
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Linkedin, href: "#" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-[#6F6F6F] hover:bg-[#6CAEBD] rounded-xl flex items-center justify-center transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 text-white">{t("landing.footer.quickLinks")}</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link to="/login" className="hover:text-white transition flex items-center gap-2 group">
                    <motion.span whileHover={{ x: -4 }}>←</motion.span>
                    {t("auth.login")}
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="hover:text-white transition flex items-center gap-2 group">
                    <motion.span whileHover={{ x: -4 }}>←</motion.span>
                    {t("navigation.faq")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="mb-4 text-white">{t("landing.footer.services")}</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link to="/dashboard/complaint" className="hover:text-white transition flex items-center gap-2 group">
                    <motion.span whileHover={{ x: -4 }}>←</motion.span>
                    {t("requests.submitComplaint")}
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/inquiry" className="hover:text-white transition flex items-center gap-2 group">
                    <motion.span whileHover={{ x: -4 }}>←</motion.span>
                    {t("requests.submitInquiry")}
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/book-visit" className="hover:text-white transition flex items-center gap-2 group">
                    <motion.span whileHover={{ x: -4 }}>←</motion.span>
                    {t("requests.bookVisit")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4 text-white">{t("landing.footer.contact")}</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#6CAEBD] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs mb-1">{t("landing.footer.email")}</p>
                    <a href="mailto:info@university.edu.sa" className="hover:text-white transition">
                      info@university.edu.sa
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#6CAEBD] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs mb-1">{t("landing.footer.phone")}</p>
                    <a href="tel:920012345" className="hover:text-white transition" dir="ltr">
                      920012345
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#6CAEBD] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs mb-1">{t("landing.footer.address")}</p>
                    <p>{t("landing.footer.location")}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-right">
                {t("landing.footer.rights")} © 2025 - {t("common.appName")}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}