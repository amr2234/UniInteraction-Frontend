import React from "react";
import { useNavigate } from "react-router-dom";
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
import { useFAQForm } from "./FAQForm.logic";

export function FAQForm() {
  const navigate = useNavigate();
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
    handleCancel
  } = useFAQForm();

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
            onClick={handleCancel}
            className="mb-4 gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            العودة إلى قائمة الأسئلة
          </Button>
          <h1 className="text-[#2B2B2B] mb-2">
            {isEditMode ? "تعديل السؤال" : "إضافة سؤال جديد"}
          </h1>
          <p className="text-[#6F6F6F]">
            {isEditMode ? "قم بتعديل بيانات السؤال" : "أدخل بيانات السؤال الجديد"}
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Arabic */}
            <div>
              <Label htmlFor="questionAr" className="text-[#2B2B2B]">
                السؤال بالعربية <span className="text-red-500">*</span>
              </Label>
              <Input
                id="questionAr"
                value={formData.questionAr}
                onChange={(e) => handleInputChange("questionAr", e.target.value)}
                className={`rounded-xl mt-2 ${errors.questionAr ? "border-red-500" : ""
                  }`}
                placeholder="أدخل السؤال بالعربية"
              />
              {errors.questionAr && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.questionAr}
                </p>
              )}
            </div>

            {/* Question English */}
            <div>
              <Label htmlFor="questionEn" className="text-[#2B2B2B]">
                السؤال بالإنجليزية
              </Label>
              <Input
                id="questionEn"
                value={formData.questionEn}
                onChange={(e) => handleInputChange("questionEn", e.target.value)}
                className="rounded-xl mt-2"
                dir="ltr"
                placeholder="Enter question in English"
              />
            </div>

            {/* Answer Arabic */}
            <div>
              <Label htmlFor="answerAr" className="text-[#2B2B2B]">
                الإجابة بالعربية <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="answerAr"
                value={formData.answerAr}
                onChange={(e) => handleInputChange("answerAr", e.target.value)}
                className={`rounded-xl mt-2 min-h-[120px] ${errors.answerAr ? "border-red-500" : ""
                  }`}
                placeholder="أدخل الإجابة بالعربية"
              />
              {errors.answerAr && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.answerAr}
                </p>
              )}
            </div>

            {/* Answer English */}
            <div>
              <Label htmlFor="answerEn" className="text-[#2B2B2B]">
                الإجابة بالإنجليزية
              </Label>
              <Textarea
                id="answerEn"
                value={formData.answerEn}
                onChange={(e) => handleInputChange("answerEn", e.target.value)}
                className="rounded-xl mt-2 min-h-[120px]"
                dir="ltr"
                placeholder="Enter answer in English"
              />
            </div>

            {/* Order */}
            <div>
              <Label htmlFor="order" className="text-[#2B2B2B]">
                ترتيب العرض <span className="text-red-500">*</span>
              </Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 1)}
                className={`rounded-xl mt-2 ${errors.order ? "border-red-500" : ""
                  }`}
                placeholder="1"
              />
              {errors.order && (
                <p className="text-red-500 text-sm mt-1">{errors.order}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                يحدد ترتيب ظهور السؤال في القائمة (الأرقام الأصغر تظهر أولاً)
              </p>
            </div>

            {/* Active Status (only for edit mode) */}
            {isEditMode && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked)}
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
              {isEditMode ? "تأكيد التحديث" : "تأكيد إضافة سؤال"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEditMode ? (
                <>
                  هل أنت متأكد من حفظ التغييرات للسؤال{" "}
                  <span className="font-semibold text-[#2B2B2B]">
                    "{formData.questionAr}"
                  </span>
                  ؟
                </>
              ) : (
                <>
                  هل أنت متأكد من إضافة السؤال{" "}
                  <span className="font-semibold text-[#2B2B2B]">
                    "{formData.questionAr}"
                  </span>{" "}
                  إلى النظام؟
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
