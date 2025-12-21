import { z } from "zod";
import { REQUEST_TYPES } from "./RequestForm.types";

// Regex patterns for validation
const hasArabicRegex = /[\u0600-\u06FF]/;
const noEnglishRegex = /^[^a-zA-Z]*$/;
const hasEnglishRegex = /[a-zA-Z]/;
const noArabicRegex = /^[^\u0600-\u06FF]*$/;

export const createRequestFormSchema = (t: (key: string) => string) => {
  return z.object({
    // Personal Information (common for all types)
    nameAr: z.string().min(1, t("validation.required")),
    nameEn: z.string().optional(),
    email: z
      .string()
      .min(1, t("validation.required"))
      .email(t("validation.invalidEmail")),
    mobile: z
      .string()
      .min(1, t("validation.required"))
      .regex(/^05\d{8}$/, t("validation.invalidMobile")),

    // Request Type
    requestTypeId: z.number(),

    // Common Fields - required for all types with Arabic validation
    titleAr: z
      .string()
      .min(1, t("validation.required"))
      .max(100, t("validation.maxLength").replace("{max}", "100"))
      .refine((val) => hasArabicRegex.test(val), {
        message: t("validation.arabicRequired"),
      })
      .refine((val) => noEnglishRegex.test(val), {
        message: t("validation.noEnglishAllowed"),
      }),
    titleEn: z
      .string()
      .max(100, t("validation.maxLength").replace("{max}", "100"))
      .optional(),
    subjectAr: z
      .string()
      .min(1, t("validation.required"))
      .refine((val) => hasArabicRegex.test(val), {
        message: t("validation.arabicRequired"),
      })
      .refine((val) => noEnglishRegex.test(val), {
        message: t("validation.noEnglishAllowed"),
      }),
    subjectEn: z.string().optional(),
    additionalDetailsAr: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.trim() === "" || (hasArabicRegex.test(val) && noEnglishRegex.test(val)),
        {
          message: t("validation.arabicOnly"),
        }
      ),
    additionalDetailsEn: z.string().optional(),

    // Category fields - Optional, will be validated conditionally
    mainCategoryId: z.string().optional(),
    subCategoryId: z.string().optional(),
    serviceId: z.string().optional(),

    // Visit-specific fields - Optional, will be validated conditionally

    universityLeadershipId: z.string().optional(),
    hasRelatedComplaint: z.boolean().optional(),
    relatedRequestId: z.string().optional(),
  }).superRefine((data, ctx) => {
    // Visit-specific validation
    if (data.requestTypeId === REQUEST_TYPES.VISIT) {
      // Validate related request selection
      if (data.hasRelatedComplaint === true && (!data.relatedRequestId || data.relatedRequestId.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.relatedRequestRequired"),
          path: ["relatedRequestId"],
        });
      }



      // University leadership is required
      if (!data.universityLeadershipId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.required"),
          path: ["universityLeadershipId"],
        });
      }
    }
  });
};
