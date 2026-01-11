import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, ArrowRight, Edit, Lock, LogOut, CheckCircle, Camera, Loader2 } from "lucide-react";
import { useProfilePageLogic } from "./ProfilePage.logic";

export function ProfilePage() {
  const {
    isEditing,
    showChangePassword,
    profilePicture,
    formData,
    formErrors,
    passwordData,
    passwordErrors,
    isUploadingPicture,
    isChangingPassword,
    fileInputRef,
    setIsEditing,
    setShowChangePassword,
    handleInputChange,
    handleSave,
    handleCancel,
    handleLogout,
    handleChangePhotoClick,
    handleFileChange,
    handlePasswordChange,
    handleChangePasswordSubmit,
    navigate,
    t,
  } = useProfilePageLogic();

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#115740] mb-4"
          >
            <ArrowRight className="w-5 h-5" />
            <span>{t("navigation.profile")}</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-[#115740]">{t("profile.title")}</h1>
                <p className="text-gray-600">{t("profile.subtitle")}</p>
              </div>
            </div>
            
            {/* Email Verified Badge - Small, at top right */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs font-medium text-green-700">{t("profile.emailVerified")}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#115740]">{t("profile.personalInfo")}</h3>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>{isEditing ? t("common.cancel") : t("common.edit")}</span>
                </Button>
              </div>

              <div className="space-y-6">
                {/* Name in Arabic and English */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nameAr">{t("profile.nameAr")}</Label>
                    <Input
                      id="nameAr"
                      type="text"
                      value={formData.nameAr}
                      onChange={(e) => handleInputChange("nameAr", e.target.value)}
                      disabled
                      className="mt-2 bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nameEn">{t("profile.nameEn")}</Label>
                    <Input
                      id="nameEn"
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => handleInputChange("nameEn", e.target.value)}
                      disabled
                      className="mt-2 bg-gray-50"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* National ID */}
                <div>
                  <Label htmlFor="nationalId">{t("profile.nationalId")}</Label>
                  <Input
                    id="nationalId"
                    type="text"
                    value={formData.nationalId}
                    onChange={(e) => handleInputChange("nationalId", e.target.value)}
                    disabled
                    className="mt-2 bg-gray-50"
                    dir="ltr"
                  />
                </div>

                {/* Email and Phone (Editable) */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">{t("profile.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={!isEditing}
                      className={`mt-2 ${formErrors.email ? "border-red-500" : ""}`}
                      dir="ltr"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="mobile">{t("profile.mobile")}</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      disabled={!isEditing}
                      className={`mt-2 ${formErrors.mobile ? "border-red-500" : ""}`}
                      dir="ltr"
                    />
                    {formErrors.mobile && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.mobile}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4">
                    <Button className="flex-1 bg-[#115740] hover:bg-[#0d4230]" onClick={handleSave}>
                      {t("common.save")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="px-8"
                    >
                      {t("common.cancel")}
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Change Password */}
            {showChangePassword && (
              <Card className="p-6">
                <h3 className="text-[#115740] mb-6">{t("profile.changePassword")}</h3>
                <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="new-password">{t("profile.newPassword")}</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      placeholder={t("profile.enterNewPassword")}
                      className={`mt-2 ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">{t("profile.confirmPassword")}</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      placeholder={t("profile.confirmNewPassword")}
                      className={`mt-2 ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" disabled={isChangingPassword} className="flex-1 bg-[#115740] hover:bg-[#0d4230]">
                      {isChangingPassword ? t('common.saving') : t("profile.updatePassword")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowChangePassword(false)}
                      className="px-8"
                    >
                      {t("common.cancel")}
                    </Button>
                  </div>
                </form>
              </Card>
            )}


          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <Card className="p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {/* Profile Picture Display - Using Avatar Component */}
                  <Avatar className="w-32 h-32 mx-auto rounded-full">
                    <AvatarImage
                      src={profilePicture || undefined}
                      alt={formData.nameAr}
                      className="object-cover rounded-full"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#115740] to-[#1C4E80] text-white rounded-full">
                      <User className="w-16 h-16" />
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Upload/Loading Overlay */}
                  {isUploadingPicture && (
                    <div className="absolute inset-0 w-32 h-32 mx-auto bg-black/50 rounded-full flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                  
                  {/* Camera Button */}
                  <button
                    onClick={handleChangePhotoClick}
                    disabled={isUploadingPicture}
                    className="absolute bottom-0 right-0 bg-[#115740] hover:bg-[#0d4230] text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={t('profile.changePhoto')}
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={handleChangePhotoClick}
                  disabled={isUploadingPicture}
                >
                  {isUploadingPicture ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('profile.uploading')}
                    </>
                  ) : (
                    t('profile.changePhoto')
                  )}
                </Button>
                
                {/* File Requirements */}
                <p className="text-xs text-gray-500 mt-2">
                  {t('profile.imageRequirements')}
                </p>
              </div>
            </Card>


            <Card className="p-6">
              <h4 className="text-[#115740] mb-4">{t("profile.accountSettings")}</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setShowChangePassword(!showChangePassword)}
                >
                  <Lock className="w-4 h-4" />
                  <span>{t("profile.changePassword")}</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("auth.logout")}</span>
                </Button>
              </div>
            </Card>


          </div>
        </div>
      </div>


    </div>
  );
}
