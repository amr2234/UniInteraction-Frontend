import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

interface CreateMainCategoryDto {
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
}

interface UpdateMainCategoryDto {
  id: number;
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isActive: boolean;
}

export function MainCategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateMainCategoryDto | UpdateMainCategoryDto>({
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    setIsLoading(true);
    try {
      // TODO: Fetch from API
      // const response = await fetch(`/api/main-categories/${id}`);
      // const data = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockCategory = {
        id: parseInt(id!),
        nameAr: "الشؤون الأكاديمية",
        nameEn: "Academic Affairs",
        descriptionAr: "جميع الخدمات المتعلقة بالشؤون الأكاديمية والدراسية",
        descriptionEn: "All services related to academic affairs and studies",
        isActive: true,
      };
      setFormData(mockCategory);
    } catch (error) {
      toast.error("فشل تحميل بيانات التصنيف");
      navigate("/admin/main-categories");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nameAr?.trim()) {
      errors.nameAr = "الاسم بالعربية مطلوب";
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
        // TODO: POST /api/main-categories
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success(`تم إضافة "${formData.nameAr}" بنجاح`, {
          duration: 4000,
        });
      } else {
        // TODO: PUT /api/main-categories/{id}
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success(`تم تحديث "${formData.nameAr}" بنجاح`, {
          duration: 4000,
        });
      }

      navigate("/admin/main-categories");
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
            onClick={() => navigate("/admin/main-categories")}
            className="mb-4 gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            العودة إلى التصنيفات الرئيسية
          </Button>
          <h1 className="text-[#2B2B2B] mb-2">
            {isEditMode ? "تعديل التصنيف الرئيسي" : "إضافة تصنيف رئيسي جديد"}
          </h1>
          <p className="text-[#6F6F6F]">
            {isEditMode ? "قم بتعديل بيانات التصنيف" : "أدخل بيانات التصنيف الجديد"}
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
                  placeholder="الشؤون الأكاديمية"
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
                  placeholder="Academic Affairs"
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
                placeholder="وصف التصنيف الرئيسي"
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
                placeholder="Category description"
              />
            </div>

            {/* Active Status (only for edit mode) */}
            {isEditMode && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Switch
                  id="isActive"
                  checked={(formData as UpdateMainCategoryDto).isActive}
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
                onClick={() => navigate("/admin/main-categories")}
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
              {isEditMode ? "تأكيد التحديث" : "تأكيد إضافة تصنيف"}
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
                  كتصنيف رئيسي؟
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
