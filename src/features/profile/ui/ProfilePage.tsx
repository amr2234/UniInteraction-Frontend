import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, Mail, Phone, ArrowRight, Edit, Lock, LogOut, Shield, CheckCircle, XCircle, Camera, Loader2 } from "lucide-react";
import { useProfilePageLogic } from "./ProfilePage.logic";
import { NafathActivationDialog } from "../components/NafathActivationDialog";

export function ProfilePage() {
  const {
    isEditing,
    showChangePassword,
    showNafathDialog,
    profilePicture,
    formData,
    formErrors,
    isUploadingPicture,
    fileInputRef,
    setIsEditing,
    setShowChangePassword,
    setShowNafathDialog,
    handleInputChange,
    handleSave,
    handleCancel,
    handleLogout,
    handleOpenNafathDialog,
    handleNafathSuccess,
    handleChangePhotoClick,
    handleFileChange,
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
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-[#115740]">{t("profile.title")}</h1>
              <p className="text-gray-600">{t("profile.subtitle")}</p>
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
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">{t("profile.currentPassword")}</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder={t("profile.enterCurrentPassword")}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">{t("profile.newPassword")}</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder={t("profile.enterNewPassword")}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">{t("profile.confirmPassword")}</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder={t("profile.confirmNewPassword")}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1 bg-[#115740] hover:bg-[#0d4230]">
                      {t("profile.updatePassword")}
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

            {/* Account Statistics */}
            <Card className="p-6">
              <h3 className="text-[#115740] mb-4">{t("profile.accountStats")}</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-2xl">
                  <p className="text-2xl font-bold text-blue-600">8</p>
                  <p className="text-sm text-gray-600 mt-1">{t("profile.activeRequests")}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-2xl">
                  <p className="text-2xl font-bold text-green-600">24</p>
                  <p className="text-sm text-gray-600 mt-1">{t("profile.completedRequests")}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-2xl">
                  <p className="text-2xl font-bold text-purple-600">32</p>
                  <p className="text-sm text-gray-600 mt-1">{t("profile.totalRequests")}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <Card className="p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {/* Profile Picture Display */}
                  <div className="w-32 h-32 bg-gradient-to-br from-[#115740] to-[#1C4E80] rounded-full flex items-center justify-center overflow-hidden">
                    {profilePicture ? (
                      <img 
                        src={profilePicture} 
                        alt={formData.nameAr}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-white">{formData.nameAr?.substring(0, 2) || 'أ.ع'}</span>
                    )}
                  </div>
                  
                  {/* Upload/Loading Overlay */}
                  {isUploadingPicture && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
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

            {/* Quick Actions */}
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

            {/* Connected Accounts */}
            <Card className="p-6">
              <h4 className="text-[#115740] mb-4">{t("profile.connectedAccounts")}</h4>
              <div className="space-y-3">
                {/* Nafath Status - Dynamic based on nationalId */}
                {formData.nationalId ? (
                  // Nafath Connected
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{t("profile.nafath")}</p>
                        <p className="text-xs text-gray-500">{t("profile.connected")}</p>
                      </div>
                    </div>
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {t("profile.active")}
                    </span>
                  </div>
                ) : (
                  // Nafath Not Connected
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{t("profile.nafath")}</p>
                        <p className="text-xs text-gray-500">{t("profile.notConnected")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {t("profile.inactive")}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleOpenNafathDialog}
                        className="h-7 px-3 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      >
                        {t("common.activate")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Nafath Activation Dialog */}
      <NafathActivationDialog
        open={showNafathDialog}
        onOpenChange={setShowNafathDialog}
        onSuccess={handleNafathSuccess}
      />
    </div>
  );
}
