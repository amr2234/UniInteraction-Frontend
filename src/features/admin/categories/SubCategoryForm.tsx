import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface CreateSubCategoryDto {
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  mainCategoryId: number;
}

interface UpdateSubCategoryDto extends CreateSubCategoryDto {
  id: number;
  isActive: boolean;
}

interface MainCategoryDto {
  id: number;
  nameAr: string;
  nameEn?: string;
}

export function SubCategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [mainCategories, setMainCategories] = useState<MainCategoryDto[]>([]);
  const [formData, setFormData] = useState<CreateSubCategoryDto | UpdateSubCategoryDto>({
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    mainCategoryId: 0,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const mockMainCategories: MainCategoryDto[] = [
    { id: 1, nameAr: "الشؤون الأكاديمية", nameEn: "Academic Affairs" },
    { id: 2, nameAr: "شؤون الطلاب", nameEn: "Student Affairs" },
    { id: 3, nameAr: "الموارد البشرية", nameEn: "Human Resources" },
  ];

  useEffect(() => {
    fetchMainCategories();
    if (isEditMode) {
      fetchSubCategory();
    }
  }, [id]);

  const fetchMainCategories = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setMainCategories(mockMainCategories);
    } catch (error) {
      toast.error("فشل تحميل التصنيفات الرئيسية");
    }
  };

  const fetchSubCategory = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockSubCategory = {
        id: parseInt(id!),
        nameAr: "القبول والتسجيل",
        nameEn: "Admission & Registration",
        descriptionAr: "خدمات القبول والتسجيل للطلاب الجدد",
        descriptionEn: "Admission and registration services for new students",
        mainCategoryId: 1,
        isActive: true,
      };
      setFormData(mockSubCategory);
    } catch (error) {
      toast.error("فشل تحميل بيانات التصنيف");
      navigate("/admin/sub-categories");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nameAr?.trim()) {
      errors.nameAr = "الاسم بالعربية مطلوب";
    }

    if (!formData.mainCategoryId || formData.mainCategoryId === 0) {
      errors.mainCategoryId = "التصنيف الرئيسي مطلوب";
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
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success(`تم إضافة "${formData.nameAr}" بنجاح`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success(`تم تحديث "${formData.nameAr}" بنجاح`);
      }

      navigate("/admin/sub-categories");
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
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/sub-categories")}
            className="mb-4 gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            العودة إلى التصنيفات الفرعية
          </Button>
          <h1 className="text-[#2B2B2B] mb-2">
            {isEditMode ? "تعديل التصنيف الفرعي" : "إضافة تصنيف فرعي جديد"}
          </h1>
        </div>

        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    if (formErrors.nameAr) setFormErrors({ ...formErrors, nameAr: "" });
                  }}
                  className={`rounded-xl mt-2 ${formErrors.nameAr ? "border-red-500" : ""}`}
                />
                {formErrors.nameAr && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.nameAr}</p>
                )}
              </div>

              <div>
                <Label htmlFor="nameEn" className="text-[#2B2B2B]">
                  الاسم بالإنجليزية
                </Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="rounded-xl mt-2"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mainCategoryId" className="text-[#2B2B2B]">
                التصنيف الرئيسي <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.mainCategoryId?.toString()}
                onValueChange={(value) => {
                  setFormData({ ...formData, mainCategoryId: parseInt(value) });
                  if (formErrors.mainCategoryId) setFormErrors({ ...formErrors, mainCategoryId: "" });
                }}
              >
                <SelectTrigger className={`rounded-xl mt-2 ${formErrors.mainCategoryId ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="اختر التصنيف الرئيسي" />
                </SelectTrigger>
                <SelectContent>
                  {mainCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.nameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.mainCategoryId && (
                <p className="text-red-500 text-sm mt-1">{formErrors.mainCategoryId}</p>
              )}
            </div>

            <div>
              <Label htmlFor="descriptionAr" className="text-[#2B2B2B]">
                الوصف بالعربية
              </Label>
              <Textarea
                id="descriptionAr"
                value={formData.descriptionAr}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                className="rounded-xl mt-2 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="descriptionEn" className="text-[#2B2B2B]">
                الوصف بالإنجليزية
              </Label>
              <Textarea
                id="descriptionEn"
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                className="rounded-xl mt-2 min-h-[100px]"
                dir="ltr"
              />
            </div>

            {isEditMode && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Switch
                  id="isActive"
                  checked={(formData as UpdateSubCategoryDto).isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive" className="text-[#2B2B2B] cursor-pointer">
                  نشط (ظاهر للمستخدمين)
                </Label>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/sub-categories")}
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

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEditMode ? "تأكيد التحديث" : "تأكيد إضافة تصنيف"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من {isEditMode ? "حفظ التغييرات" : "إضافة"}؟
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
