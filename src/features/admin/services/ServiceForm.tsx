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

interface CreateServiceDto {
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  subCategoryId: number;
}

interface UpdateServiceDto extends CreateServiceDto {
  id: number;
  isActive: boolean;
}

interface SubCategoryDto {
  id: number;
  nameAr: string;
  nameEn?: string;
}

export function ServiceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [subCategories, setSubCategories] = useState<SubCategoryDto[]>([]);
  const [formData, setFormData] = useState<CreateServiceDto | UpdateServiceDto>({
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    subCategoryId: 0,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const mockSubCategories: SubCategoryDto[] = [
    { id: 1, nameAr: "القبول والتسجيل", nameEn: "Admission & Registration" },
    { id: 2, nameAr: "الامتحانات", nameEn: "Examinations" },
    { id: 3, nameAr: "الأنشطة الطلابية", nameEn: "Student Activities" },
  ];

  useEffect(() => {
    fetchSubCategories();
    if (isEditMode) {
      fetchService();
    }
  }, [id]);

  const fetchSubCategories = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSubCategories(mockSubCategories);
    } catch (error) {
      toast.error("فشل تحميل التصنيفات الفرعية");
    }
  };

  const fetchService = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockService = {
        id: parseInt(id!),
        nameAr: "طلب إفادة تخرج",
        nameEn: "Graduation Certificate Request",
        descriptionAr: "طلب إصدار إفادة تخرج رسمية",
        descriptionEn: "Request official graduation certificate",
        subCategoryId: 1,
        isActive: true,
      };
      setFormData(mockService);
    } catch (error) {
      toast.error("فشل تحميل بيانات الخدمة");
      navigate("/admin/services");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nameAr?.trim()) {
      errors.nameAr = "اسم الخدمة بالعربية مطلوب";
    }

    if (!formData.subCategoryId || formData.subCategoryId === 0) {
      errors.subCategoryId = "التصنيف الفرعي مطلوب";
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

      navigate("/admin/services");
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
            onClick={() => navigate("/admin/services")}
            className="mb-4 gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            العودة إلى الخدمات
          </Button>
          <h1 className="text-[#2B2B2B] mb-2">
            {isEditMode ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
          </h1>
        </div>

        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nameAr" className="text-[#2B2B2B]">
                  اسم الخدمة بالعربية <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nameAr"
                  value={formData.nameAr}
                  onChange={(e) => {
                    setFormData({ ...formData, nameAr: e.target.value });
                    if (formErrors.nameAr) setFormErrors({ ...formErrors, nameAr: "" });
                  }}
                  className={`rounded-xl mt-2 ${formErrors.nameAr ? "border-red-500" : ""}`}
                  placeholder="طلب إفادة تخرج"
                />
                {formErrors.nameAr && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.nameAr}</p>
                )}
              </div>

              <div>
                <Label htmlFor="nameEn" className="text-[#2B2B2B]">
                  اسم الخدمة بالإنجليزية
                </Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="rounded-xl mt-2"
                  dir="ltr"
                  placeholder="Graduation Certificate Request"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subCategoryId" className="text-[#2B2B2B]">
                التصنيف الفرعي <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.subCategoryId?.toString()}
                onValueChange={(value) => {
                  setFormData({ ...formData, subCategoryId: parseInt(value) });
                  if (formErrors.subCategoryId) setFormErrors({ ...formErrors, subCategoryId: "" });
                }}
              >
                <SelectTrigger className={`rounded-xl mt-2 ${formErrors.subCategoryId ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="اختر التصنيف الفرعي" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id.toString()}>
                      {sub.nameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.subCategoryId && (
                <p className="text-red-500 text-sm mt-1">{formErrors.subCategoryId}</p>
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
                placeholder="وصف الخدمة"
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
                placeholder="Service description"
              />
            </div>

            {isEditMode && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Switch
                  id="isActive"
                  checked={(formData as UpdateServiceDto).isActive}
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
                onClick={() => navigate("/admin/services")}
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
              {isEditMode ? "تأكيد التحديث" : "تأكيد إضافة خدمة"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من {isEditMode ? "حفظ التغييرات" : "إضافة الخدمة"}؟
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
