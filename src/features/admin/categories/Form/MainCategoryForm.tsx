import React from "react";
import { Controller } from "react-hook-form";
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
import { useMainCategoryForm } from "./MainCategoryForm.logic";
import { useI18n } from "@/i18n";

// FormField Component
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  hint,
  children,
}) => {
  return (
    <div>
      <Label className="text-[#2B2B2B]">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// PageHeader Component
interface PageHeaderProps {
  isEditMode: boolean;
  onBack: () => void;
  t: (key: string) => string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ isEditMode, onBack, t }) => {
  return (
    <div className="mb-8">
      <Button variant="ghost" onClick={onBack} className="mb-4 gap-2">
        <ArrowRight className="w-5 h-5" />
        {t("categories.backToList")}
      </Button>
      <h1 className="text-[#2B2B2B] mb-2">
        {isEditMode ? t("categories.editMainCategoryTitle") : t("categories.addMainCategoryTitle")}
      </h1>
      <p className="text-[#6F6F6F]">
        {isEditMode ? t("categories.editMainCategoryDesc") : t("categories.addMainCategoryDesc")}
      </p>
    </div>
  );
};

// ConfirmDialog Component
interface ConfirmDialogProps {
  open: boolean;
  isEditMode: boolean;
  categoryName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  t: (key: string) => string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  isEditMode,
  categoryName,
  onOpenChange,
  onConfirm,
  t,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isEditMode ? t("categories.confirmUpdate") : t("categories.confirmAddMainCategory")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isEditMode ? (
              <>
                {t("categories.confirmUpdateMessage")}{" "}
                <span className="font-semibold text-[#2B2B2B]">
                  "{categoryName}"
                </span>
                ؟
              </>
            ) : (
              <>
                {t("categories.confirmAddMessage")}{" "}
                <span className="font-semibold text-[#2B2B2B]">
                  "{categoryName}"
                </span>{" "}
                {t("categories.toSystem")}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {isEditMode ? t("categories.update") : t("categories.add")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export function MainCategoryForm() {
  const { t } = useI18n();
  const {
    control,
    handleSubmit,
    formState,
    isEditMode,
    isLoading,
    isDirty,
    handleCancel,
    handleConfirmSubmit,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    currentFormData,
  } = useMainCategoryForm();

  const { errors, isSubmitting } = formState;

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
        <PageHeader isEditMode={isEditMode} onBack={handleCancel} t={t} />

        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <Controller
                name="nameAr"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={t("categories.nameArLabel")}
                    required
                    error={errors.nameAr?.message}
                  >
                    <Input
                      {...field}
                      id="nameAr"
                      className={`rounded-xl mt-2 ${
                        errors.nameAr ? "border-red-500" : ""
                      }`}
                      placeholder={t("categories.nameArPlaceholder")}
                    />
                  </FormField>
                )}
              />

              <Controller
                name="nameEn"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={t("categories.nameEnLabel")}
                    error={errors.nameEn?.message}
                  >
                    <Input
                      {...field}
                      id="nameEn"
                      className={`rounded-xl mt-2 ${
                        errors.nameEn ? "border-red-500" : ""
                      }`}
                      dir="ltr"
                      placeholder={t("categories.nameEnPlaceholder")}
                    />
                  </FormField>
                )}
              />
            </div>

            {/* Description Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <Controller
                name="descriptionAr"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={t("categories.descriptionArLabel")}
                    error={errors.descriptionAr?.message}
                  >
                    <Textarea
                      {...field}
                      id="descriptionAr"
                      className="rounded-xl mt-2 min-h-[100px]"
                      placeholder={t("categories.descriptionArPlaceholder")}
                    />
                  </FormField>
                )}
              />

              <Controller
                name="descriptionEn"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={t("categories.descriptionEnLabel")}
                    error={errors.descriptionEn?.message}
                  >
                    <Textarea
                      {...field}
                      id="descriptionEn"
                      className="rounded-xl mt-2 min-h-[100px]"
                      placeholder={t("categories.descriptionEnPlaceholder")}
                      dir="ltr"
                    />
                  </FormField>
                )}
              />
            </div>

            {/* Active Status (only for edit mode) */}
            {isEditMode && (
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Switch
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label
                      htmlFor="isActive"
                      className="text-[#2B2B2B] cursor-pointer"
                    >
                      {t("categories.categoryActive")}
                    </Label>
                  </div>
                )}
              />
            )}

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="rounded-xl"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || (!isDirty && isEditMode)}
                className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 rounded-xl gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? t("common.saving") : t("common.save")}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={isConfirmDialogOpen}
        isEditMode={isEditMode}
        categoryName={currentFormData?.nameAr || ""}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleConfirmSubmit}
        t={t}
      />
    </div>
  );
}
