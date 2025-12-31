import {
  validateForm,
  requiredRule,
  maxLengthRule,
  patternRule,
  hasArabicRegex,
  noEnglishRegex,
  noArabicRegex,
} from "@/core/utils/validation";

export interface ReactivateFormData {
  titleAr: string;
  titleEn: string;
  subjectAr: string;
  subjectEn: string;
}

export type ReactivateFormErrors = Partial<Record<keyof ReactivateFormData, string>>;

/**
 * Validate a single field in the reactivate form
 * @param field - The field to validate
 * @param value - The current value of the field
 * @param t - Translation function
 * @returns Error message if validation fails, undefined otherwise
 */
export const validateReactivateField = (
  field: keyof ReactivateFormData,
  value: string,
  t: (key: string) => string
): string | undefined => {
  const rules = [];

  if (field === "titleAr") {
    rules.push(
      requiredRule<ReactivateFormData>("titleAr", value, t("validation.required")),
      patternRule<ReactivateFormData>("titleAr", value, hasArabicRegex, t("validation.arabicRequired")),
      patternRule<ReactivateFormData>("titleAr", value, noEnglishRegex, t("validation.noEnglishAllowed")),
      maxLengthRule<ReactivateFormData>("titleAr", value, 100, t("validation.maxLength").replace("{max}", "100"))
    );
  } else if (field === "titleEn" && value.trim()) {
    rules.push(
      patternRule<ReactivateFormData>("titleEn", value, noArabicRegex, t("validation.noArabicAllowed")),
      maxLengthRule<ReactivateFormData>("titleEn", value, 100, t("validation.maxLength").replace("{max}", "100"))
    );
  } else if (field === "subjectAr") {
    rules.push(
      requiredRule<ReactivateFormData>("subjectAr", value, t("validation.required")),
      patternRule<ReactivateFormData>("subjectAr", value, hasArabicRegex, t("validation.arabicRequired")),
      patternRule<ReactivateFormData>("subjectAr", value, noEnglishRegex, t("validation.noEnglishAllowed"))
    );
  } else if (field === "subjectEn" && value.trim()) {
    rules.push(
      patternRule<ReactivateFormData>("subjectEn", value, noArabicRegex, t("validation.noArabicAllowed"))
    );
  }

  const errors = validateForm<ReactivateFormData>(rules);
  return errors[field];
};

/**
 * Validate all fields in the reactivate form
 * @param data - Form data to validate
 * @param t - Translation function
 * @returns Object containing validation errors for each field
 */
export const validateReactivateForm = (
  data: ReactivateFormData,
  t: (key: string) => string
): ReactivateFormErrors => {
  const validationRules = [
    // Title Arabic - required
    requiredRule<ReactivateFormData>(
      "titleAr",
      data.titleAr,
      t("validation.required")
    ),
    // Title Arabic - must have Arabic
    patternRule<ReactivateFormData>(
      "titleAr",
      data.titleAr,
      hasArabicRegex,
      t("validation.arabicRequired")
    ),
    // Title Arabic - no English allowed
    patternRule<ReactivateFormData>(
      "titleAr",
      data.titleAr,
      noEnglishRegex,
      t("validation.noEnglishAllowed")
    ),
    // Title Arabic - max 100 chars
    maxLengthRule<ReactivateFormData>(
      "titleAr",
      data.titleAr,
      100,
      t("validation.maxLength").replace("{max}", "100")
    ),
    // Subject Arabic - required
    requiredRule<ReactivateFormData>(
      "subjectAr",
      data.subjectAr,
      t("validation.required")
    ),
    // Subject Arabic - must have Arabic
    patternRule<ReactivateFormData>(
      "subjectAr",
      data.subjectAr,
      hasArabicRegex,
      t("validation.arabicRequired")
    ),
    // Subject Arabic - no English allowed
    patternRule<ReactivateFormData>(
      "subjectAr",
      data.subjectAr,
      noEnglishRegex,
      t("validation.noEnglishAllowed")
    ),
  ];

  // Add conditional validation for English fields (only if filled)
  if (data.titleEn && data.titleEn.trim()) {
    validationRules.push(
      patternRule<ReactivateFormData>(
        "titleEn",
        data.titleEn,
        noArabicRegex,
        t("validation.noArabicAllowed")
      ),
      maxLengthRule<ReactivateFormData>(
        "titleEn",
        data.titleEn,
        100,
        t("validation.maxLength").replace("{max}", "100")
      )
    );
  }

  if (data.subjectEn && data.subjectEn.trim()) {
    validationRules.push(
      patternRule<ReactivateFormData>(
        "subjectEn",
        data.subjectEn,
        noArabicRegex,
        t("validation.noArabicAllowed")
      )
    );
  }

  // Validate using global utility
  return validateForm<ReactivateFormData>(validationRules);
};
