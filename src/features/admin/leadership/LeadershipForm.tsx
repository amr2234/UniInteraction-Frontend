import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface CreateLeadershipDto {
  nameAr: string;
  nameEn?: string;
  positionAr: string;
  positionEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  displayOrder: number;
}

interface UpdateLeadershipDto {
  id: number;
  nameAr: string;
  nameEn?: string;
  positionAr: string;
  positionEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export function LeadershipForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateLeadershipDto | UpdateLeadershipDto>({
    nameAr: "",
    nameEn: "",
    positionAr: "",
    positionEn: "",
    descriptionAr: "",
    descriptionEn: "",
    email: "",
    phone: "",
    imageUrl: "",
    displayOrder: 1,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode) {
      fetchLeader();
    }
  }, [id]);

  const fetchLeader = async () => {
    setIsLoading(true);
    try {
      // TODO: Fetch leadership data from API
      // const response = await fetch(`/api/leadership/${id}`);
      // const data = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockLeader = {
        id: parseInt(id!),
        nameAr: "د. عبدالله محمد الغامدي",
        nameEn: "Dr. Abdullah Mohammed Al-Ghamdi",
        positionAr: "رئيس الجامعة",
        positionEn: "University President",
        descriptionAr: "يتمتع بخبرة واسعة في التعليم العالي وإدارة الجامعات",
        descriptionEn: "Has extensive experience in higher education and university management",
        email: "president@sru.edu.sa",
        phone: "+966 11 1234567",
        imageUrl: "https://via.placeholder.com/150",
        displayOrder: 1,
        isActive: true,
      };
      setFormData(mockLeader);
    } catch (error) {
      toast.error("فشل تحميل بيانات القيادة");
      navigate("/admin/leadership");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nameAr?.trim()) {
      errors.nameAr = "الاسم بالعربية مطلوب";
    }

    if (!formData.positionAr?.trim()) {
      errors.positionAr = "المسمى الوظيفي بالعربية مطلوب";
    }

    if (!formData.displayOrder || formData.displayOrder < 1) {
      errors.displayOrder = "ترتيب العرض مطلوب ويجب أن يكون أكبر من صفر";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "البريد الإلكتروني غير صحيح";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsLoading(true);
    setIsConfirmDialogOpen(false);

    try {
      if (!isEditMode) {
        // TODO: POST /api/leadership
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success(`تم إضافة "${formData.nameAr}" بنجاح`, {
          duration: 4000,
        });
      } else {
        // TODO: PUT /api/leadership/{id}
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success(`تم تحديث بيانات "${formData.nameAr}" بنجاح`, {
          duration: 4000,
        });
      }

      navigate("/admin/leadership");
    } catch (error) {
      toast.error("حدث خطأ. يرجى المحاولة مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <p className="text-[#6F6F6F]">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/leadership")}
            className="mb-4 gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            العودة إلى قائمة القيادات
          </Button>
          <h1 className="text-[#2B2B2B] mb-2">
            {isEditMode ? "تعديل القيادة" : "إضافة قيادة جديدة"}
          </h1>
          <p className="text-[#6F6F6F]">
            {isEditMode ? "قم بتعديل بيانات القيادة" : "أدخل بيانات القيادة الجديدة"}
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nameAr" className="text-[#2B2B2B]">
                  الاسم بالعربية <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nameAr"
                  value={formData.nameAr}
                  onChange={(e) => {
                    setFormData({ ...formData, nameAr: e.target.value });
                    if (formErrors.nameAr)
                      setFormErrors({ ...formErrors, nameAr: "" });
                  }}
                  className={`rounded-xl mt-2 ${
                    formErrors.nameAr ? "border-red-500" : ""
                  }`}
                  placeholder="د. أحمد محمد"
                />
                {formErrors.nameAr && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.nameAr}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="nameEn" className="text-[#2B2B2B]">
                  الاسم بالإنجليزية
                </Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) =>
                    setFormData({ ...formData, nameEn: e.target.value })
                  }
                  className="rounded-xl mt-2"
                  dir="ltr"
                  placeholder="Dr. Ahmed Mohammed"
                />
              </div>
            </div>

            {/* Position Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="positionAr" className="text-[#2B2B2B]">
                  المسمى الوظيفي بالعربية <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="positionAr"
                  value={formData.positionAr}
                  onChange={(e) => {
                    setFormData({ ...formData, positionAr: e.target.value });
                    if (formErrors.positionAr)
                      setFormErrors({ ...formErrors, positionAr: "" });
                  }}
                  className={`rounded-xl mt-2 ${
                    formErrors.positionAr ? "border-red-500" : ""
                  }`}
                  placeholder="رئيس الجامعة"
                />
                {formErrors.positionAr && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.positionAr}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="positionEn" className="text-[#2B2B2B]">
                  المسمى الوظيفي بالإنجليزية
                </Label>
                <Input
                  id="positionEn"
                  value={formData.positionEn}
                  onChange={(e) =>
                    setFormData({ ...formData, positionEn: e.target.value })
                  }
                  className="rounded-xl mt-2"
                  dir="ltr"
                  placeholder="University President"
                />
              </div>
            </div>

            {/* Description Arabic */}
            <div>
              <Label htmlFor="descriptionAr" className="text-[#2B2B2B]">
                الوصف بالعربية
              </Label>
              <Textarea
                id="descriptionAr"
                value={formData.descriptionAr}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionAr: e.target.value })
                }
                className="rounded-xl mt-2 min-h-[100px]"
                placeholder="نبذة عن القيادة وخبراتها"
              />
            </div>

            {/* Description English */}
            <div>
              <Label htmlFor="descriptionEn" className="text-[#2B2B2B]">
                الوصف بالإنجليزية
              </Label>
              <Textarea
                id="descriptionEn"
                value={formData.descriptionEn}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionEn: e.target.value })
                }
                className="rounded-xl mt-2 min-h-[100px]"
                dir="ltr"
                placeholder="Brief about the leader and experience"
              />
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-[#2B2B2B]">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email)
                      setFormErrors({ ...formErrors, email: "" });
                  }}
                  className={`rounded-xl mt-2 ${
                    formErrors.email ? "border-red-500" : ""
                  }`}
                  dir="ltr"
                  placeholder="example@sru.edu.sa"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-[#2B2B2B]">
                  رقم التواصل
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="rounded-xl mt-2"
                  dir="ltr"
                  placeholder="+966 XX XXX XXXX"
                />
              </div>
            </div>

            {/* Image URL & Display Order */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="imageUrl" className="text-[#2B2B2B]">
                  رابط الصورة
                </Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="rounded-xl mt-2"
                  dir="ltr"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  رابط صورة القيادة (اختياري)
                </p>
              </div>

              <div>
                <Label htmlFor="displayOrder" className="text-[#2B2B2B]">
                  ترتيب العرض <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="displayOrder"
                  type="number"
                  min="1"
                  value={formData.displayOrder}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      displayOrder: parseInt(e.target.value) || 1,
                    });
                    if (formErrors.displayOrder)
                      setFormErrors({ ...formErrors, displayOrder: "" });
                  }}
                  className={`rounded-xl mt-2 ${
                    formErrors.displayOrder ? "border-red-500" : ""
                  }`}
                  placeholder="1"
                />
                {formErrors.displayOrder && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.displayOrder}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  يحدد ترتيب ظهور القيادة في القائمة
                </p>
              </div>
            </div>

            {/* Active Status (only for edit mode) */}
            {isEditMode && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Switch
                  id="isActive"
                  checked={(formData as UpdateLeadershipDto).isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label
                  htmlFor="isActive"
                  className="text-[#2B2B2B] cursor-pointer"
                >
                  نشط (ظاهر للمستخدمين)
                </Label>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/leadership")}
                className="rounded-xl"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 rounded-xl gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEditMode ? "تأكيد التحديث" : "تأكيد إضافة قيادة"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEditMode ? (
                <>
                  هل أنت متأكد من حفظ التغييرات لـ{" "}
                  <span className="font-semibold text-[#2B2B2B]">
                    "{formData.nameAr}"
                  </span>
                  ؟
                </>
              ) : (
                <>
                  هل أنت متأكد من إضافة{" "}
                  <span className="font-semibold text-[#2B2B2B]">
                    "{formData.nameAr}"
                  </span>{" "}
                  إلى قيادات الجامعة؟
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSubmit}
              className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90"
            >
              {isEditMode ? "حفظ" : "إضافة"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
