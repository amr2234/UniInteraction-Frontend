import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import {
  validateField,
  validateForm,
  requiredRule,
  emailRule,
  phoneRule,
  minLengthRule,
  confirmPasswordRule,
} from "@/core/utils/validation";
import { useUserProfile } from "@/features/auth/hooks/useAuth";
import {
  useUpdateProfile,
  useUploadProfilePicture,
} from "@/features/profile/hooks/useProfile";
import { authApi } from "@/features/auth/api/auth.api";
import { profileApi } from "@/features/profile/api/profile.api";
import { queryClient } from "@/core/lib/QueryProvider";
import { useMutation } from "@tanstack/react-query";

interface ProfileFormData {
  nameAr: string;
  nameEn: string;
  email: string;
  mobile: string;
  nationalId: string;
}

interface ProfileFormErrors {
  email?: string;
  mobile?: string;
}

interface PasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

interface PasswordFormErrors {
  newPassword?: string;
  confirmPassword?: string;
}

export const useProfilePageLogic = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const profileData = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadPictureMutation = useUploadProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    nameAr: "",
    nameEn: "",
    email: "",
    mobile: "",
    nationalId: "",
  });
  const [formErrors, setFormErrors] = useState<ProfileFormErrors>({});
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordFormErrors>({});

  useEffect(() => {
    if (profileData) {
      setFormData({
        nameAr: profileData.nameAr || "",
        nameEn: profileData.nameEn || "",
        email: profileData.email || "",
        mobile: profileData.mobile || "",
        nationalId: profileData.nationalId || "",
      });

      if (profileData.profilePictureId) {
        profileApi
          .getAttachment(profileData.profilePictureId)
          .then((filePath) => {
            if (filePath) {
              console.log("Profile picture file path:", filePath);

              const baseUrl = import.meta.env.VITE_API_BASE_URL;
              const fullUrl = baseUrl.replace("/api", "") + filePath;
              setProfilePicture(fullUrl);
            }
          })
          .catch((error) => {
            console.error("Failed to fetch profile picture:", error);
            setProfilePicture(null);
          });
      } else if (profileData.profilePicture) {
        setProfilePicture(profileData.profilePicture);
      } else {
        setProfilePicture(null);
      }
    }
  }, [profileData]);

  const getValidationRules = () => [
    requiredRule<ProfileFormData>(
      "email",
      formData.email,
      t("validation.emailRequired")
    ),
    emailRule<ProfileFormData>(
      "email",
      formData.email,
      t("validation.invalidEmail")
    ),
    requiredRule<ProfileFormData>(
      "mobile",
      formData.mobile,
      t("validation.phoneRequired")
    ),
    phoneRule<ProfileFormData>(
      "mobile",
      formData.mobile,
      t("validation.invalidPhone")
    ),
  ];

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData({ ...formData, [field]: value });

    if (formErrors[field as keyof ProfileFormErrors]) {
      setFormErrors({
        ...formErrors,
        [field as keyof ProfileFormErrors]: undefined,
      });
    }

    if (field === "email" || field === "mobile") {
      const rules = getValidationRules();
      const fieldError = validateField(field, value, rules);

      if (fieldError) {
        setFormErrors((prev) => ({ ...prev, [field]: fieldError }));
      }
    }
  };

  const handleSave = async () => {
    const rules = getValidationRules();
    const newErrors = validateForm(rules);

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      toast.error(t("validation.pleaseFixErrors"));
      return;
    }

    updateProfileMutation.mutate(
      {
        email: formData.email,
        mobile: formData.mobile,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormErrors({});
  };

  const handleLogout = () => {
    authApi.logout();

    queryClient.clear();

    toast.success(t("auth.logoutSuccess"));

    navigate("/login", { replace: true });
  };

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: ({ email, newPassword }: { email: string; newPassword: string }) =>
      authApi.createPassword(email, newPassword),
    onSuccess: () => {
      toast.success(t("profile.passwordChangedSuccess"));
      setShowChangePassword(false);
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setPasswordErrors({});
    },
    onError: (error: any) => {
      toast.error(error?.message || t("profile.passwordChangeFailed"));
    },
  });

  const getPasswordValidationRules = () => [
    requiredRule<PasswordFormData>(
      "newPassword",
      passwordData.newPassword,
      t("validation.passwordRequired")
    ),
    minLengthRule<PasswordFormData>(
      "newPassword",
      passwordData.newPassword,
      6,
      t("validation.passwordMinLength")
    ),
    requiredRule<PasswordFormData>(
      "confirmPassword",
      passwordData.confirmPassword,
      t("validation.confirmPasswordRequired")
    ),
    confirmPasswordRule<PasswordFormData>(
      "confirmPassword",
      passwordData.newPassword,
      passwordData.confirmPassword,
      t("validation.passwordMismatch")
    ),
  ];

  const handlePasswordChange = (field: keyof PasswordFormData, value: string) => {
    setPasswordData({ ...passwordData, [field]: value });

    if (passwordErrors[field]) {
      setPasswordErrors({ ...passwordErrors, [field]: undefined });
    }

    const rules = getPasswordValidationRules();
    const fieldError = validateField(field, value, rules);

    if (fieldError) {
      setPasswordErrors((prev) => ({ ...prev, [field]: fieldError }));
    }

    // Special handling for password confirmation
    if (field === "newPassword" || field === "confirmPassword") {
      const password = field === "newPassword" ? value : passwordData.newPassword;
      const confirmPassword = field === "confirmPassword" ? value : passwordData.confirmPassword;

      if (password && confirmPassword) {
        const confirmPasswordValidation = confirmPasswordRule<PasswordFormData>(
          "confirmPassword",
          password,
          confirmPassword,
          t("validation.passwordMismatch")
        );

        if (!confirmPasswordValidation.condition(confirmPassword)) {
          setPasswordErrors((prev) => ({
            ...prev,
            confirmPassword: confirmPasswordValidation.message,
          }));
        } else {
          setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }
      }
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rules = getPasswordValidationRules();
    const newErrors = validateForm(rules);

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      toast.error(t("validation.pleaseFixErrors"));
      return;
    }

    changePasswordMutation.mutate({
      email: formData.email,
      newPassword: passwordData.newPassword,
    });
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const validateImageFile = (file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return t("profile.invalidImageType");
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return t("profile.imageTooLarge");
    }

    return null;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    uploadPictureMutation.mutate(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    isEditing,
    showChangePassword,
    profilePicture,
    formData,
    formErrors,
    passwordData,
    passwordErrors,
    isUploadingPicture: uploadPictureMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
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
  };
};
