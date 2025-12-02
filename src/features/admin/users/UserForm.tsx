import React from "react";
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
import { ArrowRight, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useUserForm } from "./UserForm.logic";
import { useI18n } from "@/i18n";

// User Roles Enum
export function UserForm() {
  const { t } = useI18n();
  const {
    formData,
    errors,
    isLoading,
    isEditMode,
    isConfirmDialogOpen,
    departments,
    UserRole,
    RoleLabels,
    setIsConfirmDialogOpen,
    handleInputChange,
    handleRoleChange,
    handleSubmit,
    handleConfirmSubmit,
    handleCancel
  } = useUserForm();

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
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-4 gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            {t("users.backToList")}
          </Button>
          <h1 className="text-[#2B2B2B] mb-2">
            {isEditMode ? t("users.editUserTitle") : t("users.addUserTitle")}
          </h1>
          <p className="text-[#6F6F6F]">
            {isEditMode
              ? t("users.editUserDesc")
              : t("users.addUserDesc")}
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nameAr" className="text-[#2B2B2B]">
                  {t("users.nameArLabel")} <span className="text-red-500">*</span>
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nameAr}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="nameEn" className="text-[#2B2B2B]">
                  {t("users.nameEnLabel")}
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

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-[#2B2B2B]">
                {t("users.emailLabel")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`rounded-xl mt-2 ${
                  errors.email ? "border-red-500" : ""
                }`}
                dir="ltr"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="roleId" className="text-[#2B2B2B]">
                {t("users.roleLabel")} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.roleId?.toString()}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger
                  className={`rounded-xl mt-2 ${
                    errors.roleId ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder={t("users.selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t("users.roles.admin")}</SelectItem>
                  <SelectItem value="2">{t("users.roles.employee")}</SelectItem>
                  <SelectItem value="3">{t("users.roles.visitor")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.roleId && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.roleId}
                </p>
              )}
            </div>

            {/* Mobile & National ID */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mobile" className="text-[#2B2B2B]">
                  {t("users.mobileLabel")}
                </Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  className="rounded-xl mt-2"
                  dir="ltr"
                  placeholder="05XXXXXXXX"
                />
              </div>

              <div>
                <Label htmlFor="nationalId" className="text-[#2B2B2B]">
                  {t("users.nationalIdLabel")}
                </Label>
                <Input
                  id="nationalId"
                  value={formData.nationalId}
                  onChange={(e) => handleInputChange("nationalId", e.target.value)}
                  className="rounded-xl mt-2"
                  dir="ltr"
                  maxLength={10}
                />
              </div>
            </div>

            {/* Student ID & Department */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentId" className="text-[#2B2B2B]">
                  {t("users.studentIdLabel")}{" "}
                  {formData.roleId !== UserRole.USER && (
                    <span className="text-orange-500">{t("users.employeesOnly")}</span>
                  )}
                </Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange("studentId", e.target.value)}
                  className="rounded-xl mt-2"
                  disabled={formData.roleId === UserRole.USER}
                />
              </div>

              <div>
                <Label htmlFor="departmentId" className="text-[#2B2B2B]">
                  {t("users.departmentLabel")}{" "}
                  {formData.roleId !== UserRole.USER && (
                    <span className="text-orange-500">{t("users.employeesOnly")}</span>
                  )}
                </Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value: string) => handleInputChange("departmentId", value)}
                  disabled={formData.roleId === UserRole.USER}
                >
                  <SelectTrigger className="rounded-xl mt-2">
                    <SelectValue placeholder={t("users.selectDepartment")} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                  {t("users.accountActive")}
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
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 rounded-xl gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? t("common.saving") : t("common.save")}
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
              {isEditMode ? t("users.confirmUpdate") : t("users.confirmAddUser")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEditMode ? (
                <>
                  {t("users.confirmUpdateMessage")}{" "}
                  <span className="font-semibold text-[#2B2B2B]">
                    "{formData.nameAr}"
                  </span>
                  ؟
                </>
              ) : (
                <>
                  {t("users.confirmAddMessage")}{" "}
                  <span className="font-semibold text-[#2B2B2B]">
                    {formData.roleId && t(RoleLabels[formData.roleId as keyof typeof RoleLabels])} "{formData.nameAr}"
                  </span>{" "}
                  {t("users.toSystem")}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmDialogOpen(false)}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSubmit}
            >
              {isEditMode ? t("common.save") : t("users.add")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
