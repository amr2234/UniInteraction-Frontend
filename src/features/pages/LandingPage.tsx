import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useLandingPage } from "./LandingPage.logic";
import {
  HelpCircle,
  Shield,
  CheckCircle,
  Zap,
  FileSearch,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import logoImage from "figma:asset/3ed7ad000b3c6c19b182fbe3a9d4158789dc4548.png";

export function LandingPage() {
  const {
    t,
    isLoggedIn,
    isAdmin,
    isEmployee,
    isUser,
    mainServices,
    features,
    stats,
    userTypes,
    faqs,
    isFaqsLoading,
  } = useLandingPage();

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section - Modern & Clean */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#6CAEBD] via-[#6CAEBD]/95 to-[#875E9E]">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#875E9E]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
              >
                <Sparkles className="w-4 h-4 text-[#EABB4E]" />
                <span className="text-sm">{t("landing.hero.badge")}</span>
              </motion.div>

              <motion.h1
                className="text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {t("landing.hero.title")}
              </motion.h1>

              <motion.p
                className="text-xl text-white/90 mb-8 leading-relaxed"
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
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {!isLoggedIn && (
                  <Link to="/login">
                    <Button size="lg" className="bg-white text-[#6CAEBD] hover:bg-white/95 rounded-xl h-14 px-8 gap-2 shadow-lg">
                      <Shield className="w-5 h-5" />
                      {t("landing.hero.loginButton")}
                    </Button>
                  </Link>
                )}
                
                {isLoggedIn && (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-white text-[#6CAEBD] hover:bg-white/95 rounded-xl h-14 px-8 gap-2 shadow-lg">
                      {t("landing.hero.dashboardButton")}
                    </Button>
                  </Link>
                )}
                
                {(isAdmin || isEmployee) && (
                  <Link to="/dashboard/track">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-white text-white hover:bg-white/10 rounded-xl h-14 px-8 gap-2"
                    >
                      <FileSearch className="w-5 h-5" />
                      {t("landing.hero.trackButton")}
                    </Button>
                  </Link>
                )}
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                className="grid  sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-xs sm:text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Image/Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:flex justify-center items-center"
            >
              <div className="relative">
                {/* Logo Card with Glow Effect */}
                <div className="relative bg-white/10 backdrop-blur-md border border-white/30 rounded-3xl p-12 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                  <img 
                    src={logoImage} 
                    alt="جامعة سليمان الراجحي" 
                    className="relative z-10 w-full max-w-sm mx-auto drop-shadow-2xl"
                  />
                </div>
                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-24 h-24 bg-[#EABB4E]/20 rounded-2xl backdrop-blur-sm"
                  animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-2xl backdrop-blur-sm"
                  animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Smooth Wave Transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 sm:h-24" preserveAspectRatio="none">
            <path
              d="M0,64 C360,100 720,20 1440,64 L1440,120 L0,120 Z"
              fill="white"
              className="wave-path"
            />
          </svg>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[#2B2B2B] mb-4">{t("landing.services.title")}</h2>
            <p className="text-[#6F6F6F] text-lg max-w-3xl mx-auto">
              {t("landing.services.subtitle")}
            </p>
          </motion.div>

          <div className="grid  sm:grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {mainServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link to={service.link}>
                  <Card className="group relative overflow-hidden bg-white border-0 shadow-soft hover:shadow-soft-lg rounded-2xl p-8 h-full transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                        <service.icon className={`w-8 h-8 ${service.color}`} />
                      </div>
                      <h3 className="text-[#2B2B2B] mb-2">{service.title}</h3>
                      <p className="text-[#6F6F6F] text-sm leading-relaxed mb-4">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-2 text-[#6CAEBD] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>{t("landing.services.getStarted")}</span>
                        <ChevronLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-[#F4F4F4] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[#2B2B2B] mb-4">{t("landing.features.title")}</h2>
            <p className="text-[#6F6F6F] text-lg max-w-3xl mx-auto">
              {t("landing.features.subtitle")}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="bg-white border-0 shadow-soft hover:shadow-soft-lg rounded-2xl p-6 h-full  transition-all hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-xl  flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h4 className="text-[#2B2B2B] mb-2">{feature.title}</h4>
                  <p className="text-[#6F6F6F] text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Only show if FAQs exist */}
      {!isFaqsLoading && faqs.length > 0 && (
        <section className="py-16 sm:py-24 bg-gradient-to-br from-[#F4F4F4] to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <motion.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-[#2B2B2B] mb-4">{t("landing.faq.title")}</h2>
              <p className="text-[#6F6F6F] text-lg">
                {t("landing.faq.subtitle")}
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="bg-white border-0 shadow-soft hover:shadow-soft-lg rounded-2xl p-6 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#6CAEBD]/10 flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="w-5 h-5 text-[#6CAEBD]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[#2B2B2B] font-semibold mb-2">{faq.question}</h3>
                        <p className="text-[#6F6F6F] leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* User Types Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[#2B2B2B] mb-4">{t("landing.userTypes.title")}</h2>
            <p className="text-[#6F6F6F] text-lg max-w-3xl mx-auto">
              {t("landing.userTypes.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <Card className="bg-white border-0 shadow-soft hover:shadow-soft-lg rounded-2xl p-8 text-center h-full transition-all hover:-translate-y-2">
                  <div className="inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6CAEBD]/10 to-[#875E9E]/10 items-center  mb-5">
                    <type.icon className={`w-10 h-10 ${type.color}`} />
                  </div>
                  <h3 className="text-[#2B2B2B] mb-3">{type.title}</h3>
                  <p className="text-[#6F6F6F] leading-relaxed">
                    {type.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Strong Call to Action - Only show for logged out users */}
      {!isLoggedIn && (
        <section className="py-16 sm:py-24 bg-gradient-to-br from-[#6CAEBD] via-[#6CAEBD]/95 to-[#875E9E]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-[#EABB4E]" />
                <span className="text-sm text-white">{t("landing.cta.badge")}</span>
              </div>
              
              <h2 className="text-white mb-4">{t("landing.cta.title")}</h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                {t("landing.cta.description")}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/login">
                  <Button size="lg" className="bg-white text-[#6CAEBD] hover:bg-white/95 rounded-xl h-14 px-10 gap-2 shadow-lg">
                    <Shield className="w-5 h-5" />
                    <span>{t("landing.cta.loginButton")}</span>
                  </Button>
                </Link>
     
              </div>

          
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer - Clean & Professional */}
      <footer className="bg-[#2B2B2B] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid pt-10 lg:grid-cols-3 sm:grid-cols-2 gap-8 mb-12">
            
            {/* About */}
            <div>
              <img 
                src={logoImage} 
                alt="جامعة سليمان الراجحي" 
                className="h-12 mb-4 brightness-0 invert"
              />
              <p className="text-gray-400 text-sm leading-relaxed">
                {t("landing.footer.description")}
              </p>
            </div>


            {/* Services */}
            <div>
              <h4 className="text-white mb-4">{t("landing.footer.servicesTitle")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/dashboard/inquiry" className="text-gray-400 hover:text-white transition">
                    {t("landing.footer.submitInquiry")}
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/complaint" className="text-gray-400 hover:text-white transition">
                    {t("landing.footer.submitComplaint")}
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/suggestion" className="text-gray-400 hover:text-white transition">
                    {t("landing.footer.submitSuggestion")}
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/book-visit" className="text-gray-400 hover:text-white transition">
                    {t("landing.footer.bookAppointment")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white mb-4">{t("landing.footer.contactUs")}</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4 text-[#6CAEBD] flex-shrink-0" />
                  <a href="mailto:info@sr.edu.sa" className="hover:text-white transition">
                    info@sr.edu.sa
                  </a>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-4 h-4 text-[#6CAEBD] flex-shrink-0" />
                  <a href="tel:920012345" className="hover:text-white transition" dir="ltr">
                    920012345
                  </a>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 text-[#6CAEBD] flex-shrink-0 mt-0.5" />
                  <span>{t("landing.footer.location")}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <p className="text-center sm:text-right">
                {t("landing.footer.copyright")}
              </p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition">{t("landing.footer.privacyPolicy")}</a>
                <a href="#" className="hover:text-white transition">{t("landing.footer.terms")}</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
