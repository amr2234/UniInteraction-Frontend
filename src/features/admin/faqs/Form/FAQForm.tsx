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
import { useFAQForm } from "./FAQForm.logic";
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

export function FAQForm() {
  const { t } = useI18n();
  const {
    control,
    handleSubmit,
    formState,
    isLoading,
    isEditMode,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    handleConfirmSubmit,
    handleCancel,
    formData,
  } = useFAQForm();

  const { errors, isSubmitting } = formState;

  if (isLoading && isEditMode) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <p className="text-[#6F6F6F]">{t('faq.loading')}</p>
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
            {t('faq.backToList')}
          </Button>
          <h1 className="text-[#2B2B2B] mb-2">
            {isEditMode ? t('faq.editFaqTitle') : t('faq.addFaqTitle')}
          </h1>
          <p className="text-[#6F6F6F]">
            {isEditMode ? t('faq.editFaqDesc') : t('faq.addFaqDesc')}
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Arabic */}
            <Controller
              name="questionAr"
              control={control}
              render={({ field }) => (
                <FormField
                  label={t('faq.questionArLabel')}
                  required
                  error={errors.questionAr?.message}
                >
                  <Input
                    {...field}
                    id="questionAr"
                    className={`rounded-xl mt-2 ${
                      errors.questionAr ? "border-red-500" : ""
                    }`}
                    placeholder={t('faq.questionArPlaceholder')}
                  />
                </FormField>
              )}
            />

            {/* Question English */}
            <Controller
              name="questionEn"
              control={control}
              render={({ field }) => (
                <FormField
                  label={t('faq.questionEnLabel')}
                  required
                  error={errors.questionEn?.message}
                >
                  <Input
                    {...field}
                    value={field.value || ""}
                    id="questionEn"
                    className={`rounded-xl mt-2 ${
                      errors.questionEn ? "border-red-500" : ""
                    }`}
                    dir="ltr"
                    placeholder={t('faq.questionEnPlaceholder')}
                  />
                </FormField>
              )}
            />

            {/* Answer Arabic */}
            <Controller
              name="answerAr"
              control={control}
              render={({ field }) => (
                <FormField
                  label={t('faq.answerArLabel')}
                  required
                  error={errors.answerAr?.message}
                >
                  <Textarea
                    {...field}
                    id="answerAr"
                    className={`rounded-xl mt-2 min-h-[120px] ${
                      errors.answerAr ? "border-red-500" : ""
                    }`}
                    placeholder={t('faq.answerArPlaceholder')}
                  />
                </FormField>
              )}
            />

            {/* Answer English */}
            <Controller
              name="answerEn"
              control={control}
              render={({ field }) => (
                <FormField
                  label={t('faq.answerEnLabel')}
                  required
                  error={errors.answerEn?.message}
                >
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    id="answerEn"
                    className={`rounded-xl mt-2 min-h-[120px] ${
                      errors.answerEn ? "border-red-500" : ""
                    }`}
                    dir="ltr"
                    placeholder={t('faq.answerEnPlaceholder')}
                  />
                </FormField>
              )}
            />

            {/* Order */}
            <Controller
              name="order"
              control={control}
              render={({ field }) => (
                <FormField
                  label={t('faq.orderLabel')}
                  required
                  error={errors.order?.message}
                  hint={t('faq.orderHelp')}
                >
                  <Input
                    {...field}
                    id="order"
                    type="number"
                    min="1"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    className={`rounded-xl mt-2 ${
                      errors.order ? "border-red-500" : ""
                    }`}
                    placeholder={t('faq.orderPlaceholder')}
                  />
                </FormField>
              )}
            />

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
                      {t('faq.faqActive')}
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
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 rounded-xl gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? t('common.saving') : t('common.save')}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={(open) => {
          if (!open) setIsConfirmDialogOpen(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEditMode ? t('faq.confirmUpdate') : t('faq.confirmAddFaq')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEditMode ? (
                <>
                  {t('faq.confirmUpdateMessage')}{" "}
                  <span className="font-semibold text-[#2B2B2B]">
                    "{formData.questionAr}"
                  </span>
                  ؟
                </>
              ) : (
                <>
                  {t('faq.confirmAddMessage')}{" "}
                  <span className="font-semibold text-[#2B2B2B]">
                    "{formData.questionAr}"
                  </span>{" "}
                  {t('faq.toSystem')}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmDialogOpen(false)}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSubmit}
              className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90"
            >
              {isEditMode ? t('common.save') : t('users.add')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
