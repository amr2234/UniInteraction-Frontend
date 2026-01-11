import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Shield, ChevronLeft, HelpCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";

// Types
interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  gradient: string;
  color: string;
  bgColor: string;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface UserType {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

interface FAQ {
  question: string;
  answer: string;
}

// Memoized Service Card Component
export const ServiceCard = memo(({ service, index, t }: { service: Service; index: number; t: (key: string) => string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link to={service.link}>
        <Card className="group relative overflow-hidden bg-white border-0 shadow-soft hover:shadow-soft-lg rounded-2xl p-8 h-full transition-all duration-300 hover:-translate-y-2 cursor-pointer">
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
  );
});

ServiceCard.displayName = "ServiceCard";

// Memoized Feature Card Component
export const FeatureCard = memo(({ feature, index }: { feature: Feature; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="bg-white border-0 shadow-soft hover:shadow-soft-lg rounded-2xl p-6 h-full transition-all hover:-translate-y-1">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
          <feature.icon className={`w-7 h-7 ${feature.color}`} />
        </div>
        <h4 className="text-[#2B2B2B] mb-2">{feature.title}</h4>
        <p className="text-[#6F6F6F] text-sm leading-relaxed">
          {feature.description}
        </p>
      </Card>
    </motion.div>
  );
});

FeatureCard.displayName = "FeatureCard";

// Memoized User Type Card Component
export const UserTypeCard = memo(({ userType, index }: { userType: UserType; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="bg-white border-0 shadow-soft hover:shadow-soft-lg rounded-2xl p-8 text-center h-full transition-all hover:-translate-y-1">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6CAEBD]/10 to-[#875E9E]/10 flex items-center justify-center mx-auto mb-4">
          <userType.icon className={`w-8 h-8 ${userType.color}`} />
        </div>
        <h4 className="text-[#2B2B2B] mb-2">{userType.title}</h4>
        <p className="text-[#6F6F6F] text-sm leading-relaxed">
          {userType.description}
        </p>
      </Card>
    </motion.div>
  );
});

UserTypeCard.displayName = "UserTypeCard";

// Memoized FAQ Item Component
export const FAQItem = memo(({ faq, index }: { faq: FAQ; index: number }) => {
  return (
    <AccordionItem
      value={`faq-${index}`}
      className="border border-gray-200 rounded-xl bg-white hover:border-[#6CAEBD]/50 hover:shadow-md transition-all"
    >
      <AccordionTrigger className="px-4 sm:px-6 py-4 text-right hover:no-underline group [&[data-state=open]]:border-b [&[data-state=open]]:border-gray-100">
        <div className="flex items-start gap-3 w-full text-right">
          <div className="w-8 h-8 rounded-lg bg-[#6CAEBD]/10 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-4 h-4 text-[#6CAEBD]" />
          </div>
          <span className="text-sm sm:text-base font-semibold text-[#2B2B2B] text-right flex-1 pr-4 group-hover:text-[#6CAEBD] transition-colors break-words">
            {faq.question}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 sm:px-6 pb-4 pt-2 text-[#6F6F6F] text-sm sm:text-base leading-relaxed text-right">
        <div className="pr-11 break-words whitespace-pre-wrap mb-4">
          {faq.answer}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

FAQItem.displayName = "FAQItem";

// Memoized CTA Section Component
export const CTASection = memo(({ t }: { t: (key: string) => string }) => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-[#6CAEBD] via-[#6CAEBD]/95 to-[#875E9E]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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
  );
});

CTASection.displayName = "CTASection";
