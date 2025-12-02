import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FAQDto {
  id: number;
  questionAr: string;
  questionEn?: string;
  answerAr: string;
  answerEn?: string;
  order: number;
  isActive: boolean;
}

export function FAQManagement() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<FAQDto[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQDto | null>(null);

  // Mock data
  const mockFaqs: FAQDto[] = [
    {
      id: 1,
      questionAr: "كيف يمكنني تقديم اقتراح؟",
      questionEn: "How can I submit a suggestion?",
      answerAr: "يمكنك تقديم اقتراح من خلال الذهاب إلى قسم الاقتراحات وملء النموذج المطلوب.",
      answerEn: "You can submit a suggestion by going to the suggestions section and filling out the required form.",
      order: 1,
      isActive: true,
    },
    {
      id: 2,
      questionAr: "ما هي مواعيد العمل؟",
      questionEn: "What are the working hours?",
      answerAr: "مواعيد العمل من الأحد إلى الخميس من الساعة 8 صباحاً حتى 4 عصراً.",
      answerEn: "Working hours are Sunday to Thursday from 8 AM to 4 PM.",
      order: 2,
      isActive: true,
    },
    {
      id: 3,
      questionAr: "كيف يمكنني حجز موعد زيارة؟",
      questionEn: "How can I book a visit?",
      answerAr: "يمكنك حجز موعد زيارة من خلال نظام الحجز الإلكتروني المتاح على الموقع.",
      answerEn: "You can book a visit through the electronic booking system available on the website.",
      order: 3,
      isActive: false,
    },
  ];

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    filterFaqs();
  }, [faqs, searchTerm, activeFilter]);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/faqs?activeOnly=${activeFilter === 'active'}`);
      // const data = await response.json();
      
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFaqs(mockFaqs);
    } catch (error) {
      toast.error("فشل تحميل الأسئلة الشائعة");
    } finally {
      setIsLoading(false);
    }
  };

  const filterFaqs = () => {
    let filtered = [...faqs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (faq) =>
          faq.questionAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.questionEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answerAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answerEn?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Active filter
    if (activeFilter === "active") {
      filtered = filtered.filter((faq) => faq.isActive);
    } else if (activeFilter === "inactive") {
      filtered = filtered.filter((faq) => !faq.isActive);
    }

    // Sort by order
    filtered.sort((a, b) => a.order - b.order);

    setFilteredFaqs(filtered);
  };

  const handleDeleteFaq = async () => {
    if (!selectedFaq) return;

    try {
      // TODO: DELETE /api/faqs/{id}
      await new Promise((resolve) => setTimeout(resolve, 500));

      setFaqs(faqs.filter((f) => f.id !== selectedFaq.id));

      toast.success(`تم حذف السؤال "${selectedFaq.questionAr}" بنجاح`, {
        duration: 4000,
      });
      setIsDeleteDialogOpen(false);
      setSelectedFaq(null);
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[#2B2B2B] mb-2">إدارة الأسئلة الشائعة</h1>
            <p className="text-[#6F6F6F]">إدارة الأسئلة والأجوبة الشائعة</p>
          </div>
          <Button
            onClick={() => navigate("/admin/faqs/new")}
            className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 gap-2 rounded-xl"
          >
            <Plus className="w-5 h-5" />
            إضافة سؤال جديد
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 rounded-xl border-0 shadow-soft bg-white">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
              <Input
                placeholder="ابحث في الأسئلة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 rounded-xl"
              />
            </div>

            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="حالة النشر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأسئلة</SelectItem>
                <SelectItem value="active">النشطة فقط</SelectItem>
                <SelectItem value="inactive">المخفية فقط</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card className="rounded-xl border-0 shadow-soft bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-right font-semibold text-gray-700">
                    الترتيب
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    السؤال
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    الحالة
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700">
                    الإجراءات
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
                    >
                      جاري التحميل...
                    </TableCell>
                  </TableRow>
                ) : filteredFaqs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
                    >
                      لا توجد نتائج
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFaqs.map((faq) => (
                    <TableRow key={faq.id} className="hover:bg-gray-50">
                      <TableCell className="text-right">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#6CAEBD]/10 text-[#6CAEBD] font-semibold">
                          {faq.order}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <p className="font-medium text-[#2B2B2B]">
                            {faq.questionAr}
                          </p>
                          {faq.questionEn && (
                            <p className="text-xs text-gray-500 mt-1" dir="ltr">
                              {faq.questionEn}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={faq.isActive ? "default" : "secondary"}
                          className={
                            faq.isActive ? "bg-green-500" : "bg-gray-400"
                          }
                        >
                          {faq.isActive ? "نشط" : "مخفي"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/faqs/edit/${faq.id}`)
                            }
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedFaq(faq);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف السؤال "{selectedFaq?.questionAr}"؟ لا يمكن
              التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFaq}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
