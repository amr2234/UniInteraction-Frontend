import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { useI18n } from "@/i18n";

interface FAQDto {
  id: number;
  questionAr: string;
  questionEn?: string;
  answerAr: string;
  answerEn?: string;
  order: number;
  isActive: boolean;
}

export function FAQPage() {
  const { t } = useI18n();
  const [faqs, setFaqs] = useState<FAQDto[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const mockFaqs: FAQDto[] = [
    {
      id: 1,
      questionAr: "كيف يمكنني تقديم اقتراح؟",
      questionEn: "How can I submit a suggestion?",
      answerAr: "يمكنك تقديم اقتراح من خلال الذهاب إلى قسم الاقتراحات في لوحة التحكم وملء النموذج المطلوب. سيتم مراجعة اقتراحك من قبل الفريق المختص والرد عليك في أقرب وقت ممكن.",
      answerEn: "You can submit a suggestion by going to the suggestions section in the dashboard and filling out the required form. Your suggestion will be reviewed by the relevant team and you will receive a response as soon as possible.",
      order: 1,
      isActive: true,
    },
    {
      id: 2,
      questionAr: "ما هي مواعيد العمل الرسمية؟",
      questionEn: "What are the official working hours?",
      answerAr: "مواعيد العمل الرسمية هي من الأحد إلى الخميس من الساعة 8:00 صباحاً حتى 4:00 عصراً. يمكنك التواصل معنا خلال هذه الأوقات للحصول على الدعم المباشر.",
      answerEn: "Official working hours are Sunday to Thursday from 8:00 AM to 4:00 PM. You can contact us during these times for direct support.",
      order: 2,
      isActive: true,
    },
    {
      id: 3,
      questionAr: "كيف يمكنني حجز موعد زيارة؟",
      questionEn: "How can I book a visit appointment?",
      answerAr: "يمكنك حجز موعد زيارة من خلال نظام الحجز الإلكتروني المتاح في لوحة التحكم. اختر التاريخ والوقت المناسب لك وسيتم تأكيد الموعد عبر البريد الإلكتروني.",
      answerEn: "You can book a visit appointment through the electronic booking system available in the dashboard. Choose the date and time that suits you and the appointment will be confirmed via email.",
      order: 3,
      isActive: true,
    },
    {
      id: 4,
      questionAr: "كيف يمكنني تتبع حالة طلبي؟",
      questionEn: "How can I track my request status?",
      answerAr: "يمكنك تتبع حالة طلبك من خلال قسم 'تتبع الطلبات' في لوحة التحكم. ستجد جميع طلباتك مع حالتها الحالية وتاريخ التحديث الأخير.",
      answerEn: "You can track your request status through the 'Track Requests' section in the dashboard. You will find all your requests with their current status and last update date.",
      order: 4,
      isActive: true,
    },
    {
      id: 5,
      questionAr: "ما هي أنواع الطلبات المتاحة؟",
      questionEn: "What types of requests are available?",
      answerAr: "يمكنك تقديم أربعة أنواع من الطلبات: الاقتراحات، الشكاوى، الاستفسارات، وحجز المواعيد. كل نوع له نموذج خاص لضمان معالجة طلبك بشكل صحيح.",
      answerEn: "You can submit four types of requests: suggestions, complaints, inquiries, and appointment bookings. Each type has a dedicated form to ensure your request is processed correctly.",
      order: 5,
      isActive: true,
    },
    {
      id: 6,
      questionAr: "هل يمكنني تعديل طلب بعد تقديمه؟",
      questionEn: "Can I edit a request after submission?",
      answerAr: "بعد تقديم الطلب، لا يمكنك تعديله مباشرة. ولكن يمكنك التواصل مع الدعم الفني أو تقديم طلب جديد مع توضيح أنه تحديث للطلب السابق.",
      answerEn: "After submitting a request, you cannot edit it directly. However, you can contact technical support or submit a new request clarifying that it is an update to the previous request.",
      order: 6,
      isActive: true,
    },
  ];

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    filterFaqs();
  }, [faqs, searchTerm]);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/faqs?activeOnly=true');
      // const data = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 500));
      setFaqs(mockFaqs);
    } catch (error) {
      console.error("Failed to load FAQs");
    } finally {
      setIsLoading(false);
    }
  };

  const filterFaqs = () => {
    let filtered = faqs.filter((faq) => faq.isActive);

    if (searchTerm) {
      filtered = filtered.filter(
        (faq) =>
          faq.questionAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.questionEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answerAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answerEn?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => a.order - b.order);
    setFilteredFaqs(filtered);
  };

  const toggleFaq = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#6CAEBD] to-[#875E9E] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#2B2B2B]">{t("faq.title")}</h1>
            <p className="text-lg md:text-xl text-[#2B2B2B]">
              {t("faq.answersToCommonQuestions")}
            </p>
          </div>
        </div>
      </div>

      {/* FAQs List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-[#6F6F6F] text-lg">{t("faq.loading")}</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#6F6F6F] text-lg">{t("faq.noResults")}</p>
            <p className="text-gray-500 text-sm mt-2">{t("faq.tryDifferentKeywords")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <Card
                key={faq.id}
                className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-right p-6 flex items-start gap-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#6CAEBD] to-[#875E9E] text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 text-right min-w-0">
                    <h3 className="text-lg font-bold text-[#2B2B2B] mb-2 leading-relaxed">
                      {faq.questionAr}
                    </h3>
                    {faq.questionEn && (
                      <p className="text-sm text-gray-500" dir="ltr">
                        {faq.questionEn}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {expandedId === faq.id ? (
                      <ChevronUp className="w-6 h-6 text-[#6CAEBD]" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>

                {expandedId === faq.id && (
                  <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="mr-14 bg-[#6CAEBD]/5 rounded-xl p-5 border-r-4 border-[#6CAEBD]">
                      <div className="text-[#2B2B2B] leading-relaxed text-base">
                        {faq.answerAr}
                      </div>
                      {faq.answerEn && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-gray-600 text-sm leading-relaxed" dir="ltr">
                            {faq.answerEn}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-br from-white to-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4">
            {t("faq.didntFindAnswer")}
          </h2>
          <p className="text-[#6F6F6F] text-lg mb-8 max-w-2xl mx-auto">
            {t("faq.contactDirectly")}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/dashboard/inquiry"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#6CAEBD] text-white font-semibold rounded-xl hover:bg-[#6CAEBD]/90 shadow-md hover:shadow-lg transition-all duration-200"
            >
              {t("faq.submitInquiry")}
            </a>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#6CAEBD] font-semibold border-2 border-[#6CAEBD] rounded-xl hover:bg-[#6CAEBD]/5 transition-all duration-200"
            >
              {t("auth.login")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
