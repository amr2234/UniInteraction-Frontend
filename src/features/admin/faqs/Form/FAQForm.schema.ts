import { z } from "zod";

// Regex to ensure NO English letters in Arabic fields
const noEnglishRegex = /^[^a-zA-Z]*$/;
// Regex to ensure text contains at least some Arabic characters
const hasArabicRegex = /[\u0600-\u06FF]/;
// Regex to ensure NO Arabic letters in English fields
const noArabicRegex = /^[^\u0600-\u06FF]*$/;
// Regex to ensure text contains at least some English characters
const hasEnglishRegex = /[a-zA-Z]/;

export const createFAQFormSchema = (t: (key: string) => string) => {
  return z.object({
    questionAr: z
      .string()
      .min(1, t("validation.required"))
      .refine((val) => hasArabicRegex.test(val), {
        message: t("validation.arabicRequired"),
      })
      .refine((val) => noEnglishRegex.test(val), {
        message: t("validation.noEnglishAllowed"),
      }),

    questionEn: z
      .string()
      .min(1, t("validation.required"))
      .refine(
        (val) =>
          !val ||
          val.trim() === "" ||
          (hasEnglishRegex.test(val) && noArabicRegex.test(val)),
        {
          message: t("validation.englishOnly"),
        }
      ),

    answerAr: z
      .string()
      .min(1, t("validation.required"))
      .refine((val) => hasArabicRegex.test(val), {
        message: t("validation.arabicRequired"),
      })
      .refine((val) => noEnglishRegex.test(val), {
        message: t("validation.noEnglishAllowed"),
      }),

    answerEn: z
      .string()
      .min(1, t("validation.required"))
      .refine(
        (val) =>
          !val ||
          val.trim() === "" ||
          (hasEnglishRegex.test(val) && noArabicRegex.test(val)),
        {
          message: t("validation.englishOnly"),
        }
      ),

    order: z
      .number()
      .min(1, t("validation.required"))
      .int()
      .positive(),

    categoryId: z.number().optional(),

    isActive: z.boolean(),
  });
};

export type FAQFormSchema = z.infer<
  ReturnType<typeof createFAQFormSchema>
>;
