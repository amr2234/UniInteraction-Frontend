import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
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
import { ArrowRight, Save, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useUserForm } from "./UserForm.logic";
import { useI18n } from "@/i18n";
import { UserRole, ROLE_TRANSLATION_KEYS } from "@/core/constants/roles";

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
}) => (
  <div>
    <Label className="text-[#2B2B2B]">
      {label}
      {required && <span className="text-red-500"> *</span>}
      {hint && <span className="text-orange-500 text-sm"> {hint}</span>}
    </Label>
    {children}
    {error && (
      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        {error}
      </p>
    )}
  </div>
);

interface PageHeaderProps {
  isEditMode: boolean;
  onBack: () => void;
  t: (key: string) => string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ isEditMode, onBack, t }) => (
  <div className="mb-8">
    <Button variant="ghost" onClick={onBack} className="mb-4 gap-2">
      <ArrowRight className="w-5 h-5" />
      {t("users.backToList")}
    </Button>
    <h1 className="text-[#2B2B2B] mb-2">
      {isEditMode ? t("users.editUserTitle") : t("users.addUserTitle")}
    </h1>
    <p className="text-[#6F6F6F]">
      {isEditMode ? t("users.editUserDesc") : t("users.addUserDesc")}
    </p>
  </div>
);

interface ConfirmDialogProps {
  open: boolean;
  isEditMode: boolean;
  userName: string;
  userRole?: number;
  roleLabels: Record<number, string>;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  t: (key: string) => string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  isEditMode,
  userName,
  userRole,
  roleLabels,
  onOpenChange,
  onConfirm,
  t,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {isEditMode ? t("users.confirmUpdate") : t("users.confirmAddUser")}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {isEditMode ? (
            <>
              {t("users.confirmUpdateMessage")}{" "}
              <span className="font-semibold text-[#2B2B2B]">"{userName}"</span>
              ؟
            </>
          ) : (
            <>
              {t("users.confirmAddMessage")}{" "}
              <span className="font-semibold text-[#2B2B2B]">
                {userRole && t(roleLabels[userRole])} "{userName}"
              </span>{" "}
              {t("users.toSystem")}
            </>
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => onOpenChange(false)}>
          {t("common.cancel")}
        </AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>
          {isEditMode ? t("common.save") : t("users.add")}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export function UserForm() {
  const { t } = useI18n();
  const {
    control,
    handleSubmit,
    formState,
    watch,
    isEditMode,
    isLoading,
    isDirty,
    departments,
    handleCancel,
    handleConfirmSubmit,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    currentFormData,
  } = useUserForm();

  const { errors, isSubmitting } = formState;
  const watchedRole = watch("roleId");

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
            { }
            <div className="grid md:grid-cols-2 gap-4">
              <Controller
                name="nameAr"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={t("users.nameArLabel")}
                    required
                    error={errors.nameAr?.message}
                  >
                    <Input
                      {...field}
                      id="nameAr"
                      className={`rounded-xl mt-2 ${errors.nameAr ? "border-red-500" : ""
                        }`}
                      placeholder={t("users.nameArPlaceholder")}
                    />
                  </FormField>
                )}
              />

              <Controller
                name="nameEn"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={t("users.nameEnLabel")}
                    error={errors.nameEn?.message}
                  >
                    <Input
                      {...field}
                      id="nameEn"
                      className={`rounded-xl mt-2 ${errors.nameEn ? "border-red-500" : ""
                        }`}
                      dir="ltr"
                      placeholder="John Doe"
                    />
                  </FormField>
                )}
              />
            </div>

            { }
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <FormField
                  label={t("users.emailLabel")}
                  required
                  error={errors.email?.message}
                >
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    className={`rounded-xl mt-2 ${errors.email ? "border-red-500" : ""
                      }`}
                    dir="ltr"
                    placeholder="example@university.edu.sa"
                  />
                </FormField>
              )}
            />

            { }
            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <FormField
                  label={t("users.roleLabel")}
                  required
                  error={errors.roleId?.message}
                >
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value: string) =>
                      field.onChange(parseInt(value))
                    }
                  >
                    <SelectTrigger
                      className={`rounded-xl mt-2 ${errors.roleId ? "border-red-500" : ""
                        }`}
                    >
                      <SelectValue placeholder={t("users.selectRole")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">
                        {t("users.roles.admin")}
                      </SelectItem>
                      <SelectItem value="3">
                        {t("users.roles.employee")}
                      </SelectItem>
                      <SelectItem value="4">
                        {t("users.roles.visitor")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              )}
            />

            { }
            <div className="grid md:grid-cols-2 gap-4">
              <Controller
                name="mobile"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={t("users.mobileLabel")}
                    required
                    error={errors.mobile?.message}
                  >
                    <Input
                      {...field}
                      id="mobile"
                      type="tel"
                      className={`rounded-xl mt-2 ${errors.mobile ? "border-red-500" : ""
                        }`}
                      dir="ltr"
                      placeholder="05XXXXXXXX"
                      maxLength={10}
                      onInput={(e) => {
                        
                        const input = e.currentTarget;
                        input.value = input.value.replace(/[^0-9]/g, '');
                        field.onChange(input.value);
                      }}
                    />
                  </FormField>
                )}
              />

              <Controller
                name="nationalId"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={t("users.nationalIdLabel")}
                    required
                    error={errors.nationalId?.message}
                  >
                    <Input
                      {...field}
                      id="nationalId"
                      type="tel"
                      className={`rounded-xl mt-2 ${errors.nationalId ? "border-red-500" : ""
                        }`}
                      dir="ltr"
                      maxLength={10}
                      placeholder="1234567890"
                      onInput={(e) => {
                        
                        const input = e.currentTarget;
                        input.value = input.value.replace(/[^0-9]/g, '');
                        field.onChange(input.value);
                      }}
                    />
                  </FormField>
                )}
              />
            </div>

            { }
            <div className="grid md:grid-cols-2 gap-4">
              <Controller
                name="studentId"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={t("users.studentIdLabel")}
                    hint={
                      watchedRole === UserRole.ADMIN ||
                        watchedRole === UserRole.EMPLOYEE
                        ? t("users.studentsOnly")
                        : undefined
                    }
                    error={errors.studentId?.message}
                  >
                    <Input
                      {...field}
                      id="studentId"
                      className="rounded-xl mt-2"
                      disabled={
                        watchedRole === UserRole.ADMIN ||
                        watchedRole === UserRole.EMPLOYEE
                      }
                      placeholder="43XXXXXXX"
                    />
                  </FormField>
                )}
              />

              <Controller
                name="departmentId"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={t("users.departmentLabel")}
                    required={watchedRole === UserRole.EMPLOYEE}
                    hint={
                      watchedRole === UserRole.ADMIN ||
                        watchedRole === UserRole.USER
                        ? t("users.employeesOnly")
                        : undefined
                    }
                    error={errors.departmentId?.message}
                  >
                    <Select
                      value={field.value || ""}
                      onValueChange={(value: string) => {
                        field.onChange(value);

                        setTimeout(() => {
                          field.onBlur();
                        }, 0);
                      }}
                      disabled={
                        watchedRole === UserRole.ADMIN ||
                        watchedRole === UserRole.USER
                      }
                    >
                      <SelectTrigger className="rounded-xl mt-2">
                        <SelectValue
                          placeholder={t("users.selectDepartment")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              />
            </div>

            { }
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
                      {t("users.accountActive")}
                    </Label>
                  </div>
                )}
              />
            )}

            { }
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

      {}
      <ConfirmDialog
        open={isConfirmDialogOpen}
        isEditMode={isEditMode}
        userName={currentFormData?.nameAr || ""}
        userRole={currentFormData?.roleId}
        roleLabels={ROLE_TRANSLATION_KEYS}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleConfirmSubmit}
        t={t}
      />

    </div>
  );
}
