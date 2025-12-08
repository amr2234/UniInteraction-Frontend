import { z } from "zod";

const arabicRegex = /^[\u0600-\u06FF\s]+$/;
const englishRegex = /^[a-zA-Z\s]+$/;

export const createLeadershipFormSchema = (t: (key: string) => string) => {
  return z.object({
    fullNameAr: z
      .string()
      .min(1, t("validation.nameArRequired"))
      .regex(arabicRegex, t("validation.arabicOnly")),

    fullNameEn: z
      .string()
      .optional()
      .refine((val) => !val || val.trim() === "" || englishRegex.test(val), {
        message: t("validation.englishOnly"),
      }),

    positionTitleAr: z
      .string()
      .min(1, t("validation.positionArRequired"))
      .regex(arabicRegex, t("validation.arabicOnly")),

    positionTitleEn: z
      .string()
      .optional()
      .refine((val) => !val || val.trim() === "" || englishRegex.test(val), {
        message: t("validation.englishOnly"),
      }),

    departmentId: z.number().optional(),

    displayOrder: z
      .number()
      .min(1, t("validation.displayOrderRequired"))
      .default(1),

    isActive: z.boolean().default(true),
  });
};

export type LeadershipFormSchema = z.infer<
  ReturnType<typeof createLeadershipFormSchema>
>;
