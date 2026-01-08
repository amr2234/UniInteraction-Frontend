import {
  validateForm,
  requiredRule,
  emailRule,
  minLengthRule,
  phoneRule,
  nationalIdRule,
  confirmPasswordRule,
  patternRule,
  hasArabicRegex,
  noEnglishRegex,
  noArabicRegex,
} from "@/core/utils/validation";
import type { RegisterRequest } from "@/core/types/api";

/**
 * Validate a single field in the registration form
 * @param field - The field to validate
 * @param value - The current value of the field
 * @param formData - The complete form data for context
 * @param t - Translation function
 * @returns Error message if validation fails, undefined otherwise
 */
export const validateRegisterField = (
  field: keyof RegisterRequest,
  value: string | boolean,
  formData: RegisterRequest,
  t: (key: string) => string
): string | undefined => {
  const valueStr = value as string;

  // Name Arabic validation
  if (field === "nameAr") {
    if (!valueStr.trim()) {
      return t("validation.fullNameArRequired");
    }
    if (!hasArabicRegex.test(valueStr)) {
      return t("validation.arabicRequired");
    }
    if (!noEnglishRegex.test(valueStr)) {
      return t("validation.noEnglishAllowed");
    }
    return undefined;
  }

  // Name English validation (optional, but must be English only if provided)
  if (field === "nameEn") {
    if (valueStr && valueStr.trim() && !noArabicRegex.test(valueStr)) {
      return t("validation.noArabicAllowed");
    }
    return undefined;
  }

  // Username validation
  if (field === "username") {
    if (!valueStr.trim()) {
      return t("validation.usernameRequired");
    }
    return undefined;
  }

  // Email validation
  if (field === "email") {
    if (!valueStr.trim()) {
      return t("validation.emailRequired");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(valueStr)) {
      return t("validation.invalidEmail");
    }
    return undefined;
  }

  // Password validation
  if (field === "password") {
    if (!valueStr.trim()) {
      return t("validation.passwordRequired");
    }
    if (valueStr.length < 6) {
      return t("validation.passwordMinLength");
    }
    return undefined;
  }

  // Confirm Password validation
  if (field === "confirmPassword") {
    if (!valueStr.trim()) {
      return t("validation.confirmPasswordRequired");
    }
    if (valueStr !== formData.password) {
      return t("validation.passwordMismatch");
    }
    return undefined;
  }

  // Mobile validation
  if (field === "mobile") {
    if (!valueStr.trim()) {
      return t("validation.mobileRequired");
    }
    const cleanedValue = valueStr.replace(/[\s-]/g, "");
    if (!/^[0-9]{10}$/.test(cleanedValue)) {
      return t("validation.invalidPhone");
    }
    return undefined;
  }

  // National ID validation
  if (field === "nationalId") {
    if (!valueStr.trim()) {
      return t("validation.nationalIdRequired");
    }
    const cleanedValue = valueStr.replace(/[\s-]/g, "");
    if (cleanedValue.length !== 10 || !/^[0-9]+$/.test(cleanedValue)) {
      return t("validation.nationalIdFormat");
    }
    return undefined;
  }

  // Student ID validation (only if isStudent is true)
  if (field === "studentId") {
    if (formData.isStudent && !valueStr.trim()) {
      return t("validation.studentIdRequired");
    }
    return undefined;
  }

  return undefined;
};

/**
 * Validate all fields in the registration form
 * @param formData - Form data to validate
 * @param t - Translation function
 * @returns Object containing validation errors for each field
 */
export const validateRegisterForm = (
  formData: RegisterRequest,
  t: (key: string) => string
): Partial<Record<keyof RegisterRequest, string>> => {
  const validationRules = [
    // Username - required
    requiredRule<RegisterRequest>("username", formData.username, t("validation.usernameRequired")),
    
    // Name Arabic - required, must contain Arabic, no English allowed
    requiredRule<RegisterRequest>("nameAr", formData.nameAr, t("validation.fullNameArRequired")),
    patternRule<RegisterRequest>("nameAr", formData.nameAr, hasArabicRegex, t("validation.arabicRequired")),
    patternRule<RegisterRequest>("nameAr", formData.nameAr, noEnglishRegex, t("validation.noEnglishAllowed")),
    
    // Email - required, valid format
    requiredRule<RegisterRequest>("email", formData.email, t("validation.emailRequired")),
    emailRule<RegisterRequest>("email", formData.email, t("validation.invalidEmail")),
    
    // Password - required, min length
    requiredRule<RegisterRequest>("password", formData.password, t("validation.passwordRequired")),
    minLengthRule<RegisterRequest>("password", formData.password, 6, t("validation.passwordMinLength")),
    
    // Confirm Password - required, must match
    requiredRule<RegisterRequest>("confirmPassword", formData.confirmPassword, t("validation.confirmPasswordRequired")),
    confirmPasswordRule<RegisterRequest>("confirmPassword", formData.password, formData.confirmPassword, t("validation.passwordMismatch")),
    
    // Mobile - required, valid format
    requiredRule<RegisterRequest>("mobile", formData.mobile, t("validation.mobileRequired")),
    phoneRule<RegisterRequest>("mobile", formData.mobile, t("validation.invalidPhone")),
    
    // National ID - required, valid format
    requiredRule<RegisterRequest>("nationalId", formData.nationalId || "", t("validation.nationalIdRequired")),
    nationalIdRule<RegisterRequest>("nationalId", formData.nationalId || "", t("validation.nationalIdFormat")),
  ];

  // Add conditional validation for Name English (only if provided)
  if (formData.nameEn && formData.nameEn.trim()) {
    validationRules.push(
      patternRule<RegisterRequest>("nameEn", formData.nameEn, noArabicRegex, t("validation.noArabicAllowed"))
    );
  }

  // Add conditional validation for Student ID (only if isStudent)
  if (formData.isStudent) {
    validationRules.push(
      requiredRule<RegisterRequest>("studentId", formData.studentId || "", t("validation.studentIdRequired"))
    );
  }

  // Validate using global utility
  return validateForm<RegisterRequest>(validationRules);
};
