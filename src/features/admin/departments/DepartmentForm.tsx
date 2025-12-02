import React from "react";
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
import { Switch } from "@/components/ui/switch";
import { useDepartmentForm } from "./DepartmentForm.logic";
import { useI18n } from "@/i18n";

export function DepartmentForm() {
  const { t } = useI18n();
  const {
    formData,
    errors,
    isLoading,
    isEditMode,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    handleInputChange,
    handleSubmit,
    handleConfirmSubmit,
    handleCancel,
  } = useDepartmentForm();

  if (isLoading && isEditMode) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <p className="text-[#6F6F6F]">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleCancel} className="mb-4 gap-2">
            <ArrowRight className="w-5 h-5" />
            العودة إلى القائمة
          </Button>
          <h1 className="text-[#2B2B2B] mb-2">
            {isEditMode ? "تعديل القسم" : "إضافة قسم جديد"}
          </h1>
          <p className="text-[#6F6F6F]">
            {isEditMode ? "تحديث بيانات القسم" : "إضافة قسم جديد إلى النظام"}
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nameAr" className="text-[#2B2B2B]">
                  اسم القسم (عربي) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nameAr"
                  value={formData.nameAr}
                  onChange={(e) => handleInputChange("nameAr", e.target.value)}
                  className={`rounded-xl mt-2 ${
                    errors.nameAr ? "border-red-500" : ""
                  }`}
                />
                {errors.nameAr && (
                  <p className="text-red-500 text-sm mt-1">{errors.nameAr}</p>
                )}
              </div>

              <div>
                <Label htmlFor="nameEn" className="text-[#2B2B2B]">
                  اسم القسم (إنجليزي)
                </Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => handleInputChange("nameEn", e.target.value)}
                  className="rounded-xl mt-2"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Code */}
            <div>
              <Label htmlFor="code" className="text-[#2B2B2B]">
                كود القسم
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                className="rounded-xl mt-2"
                placeholder="مثال: IT, HR, FIN"
                dir="ltr"
              />
            </div>

            {/* Description Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="descriptionAr" className="text-[#2B2B2B]">
                  الوصف (عربي)
                </Label>
                <Textarea
                  id="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={(e) =>
                    handleInputChange("descriptionAr", e.target.value)
                  }
                  className="rounded-xl mt-2 min-h-[100px]"
                  placeholder="وصف القسم ومهامه..."
                />
              </div>

              <div>
                <Label htmlFor="descriptionEn" className="text-[#2B2B2B]">
                  الوصف (إنجليزي)
                </Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) =>
                    handleInputChange("descriptionEn", e.target.value)
                  }
                  className="rounded-xl mt-2 min-h-[100px]"
                  placeholder="Department description..."
                  dir="ltr"
                />
              </div>
            </div>

            {/* Active Status (only for edit mode) */}
            {isEditMode && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleInputChange("isActive", checked)
                  }
                />
                <Label
                  htmlFor="isActive"
                  className="text-[#2B2B2B] cursor-pointer"
                >
                  القسم نشط
                </Label>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
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
              {isEditMode ? "تأكيد التحديث" : "تأكيد الإضافة"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEditMode ? (
                <>
                  هل أنت متأكد من تحديث القسم{" "}
                  <span className="font-semibold text-[#2B2B2B]">
                    "{formData.nameAr}"
                  </span>
                  ؟
                </>
              ) : (
                <>
                  هل أنت متأكد من إضافة القسم{" "}
                  <span className="font-semibold text-[#2B2B2B]">
                    "{formData.nameAr}"
                  </span>{" "}
                  إلى النظام؟
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmDialogOpen(false)}>
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              {isEditMode ? "تحديث" : "إضافة"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
