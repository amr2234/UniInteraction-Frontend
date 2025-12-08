import { z } from "zod";

const arabicRegex = /^[\u0600-\u06FF\s]+$/;
const englishRegex = /^[a-zA-Z\s]+$/;

export const createDepartmentFormSchema = (t: (key: string) => string) => {
  return z.object({
    nameAr: z
      .string()
      .min(1, t("validation.nameArRequired"))
      .regex(arabicRegex, t("validation.arabicOnly")),

    nameEn: z
      .string()
      .optional()
      .refine((val) => !val || val.trim() === "" || englishRegex.test(val), {
        message: t("validation.englishOnly"),
      }),

    descriptionAr: z.string().optional(),

    descriptionEn: z
      .string()
      .optional()
      .refine((val) => !val || val.trim() === "" || englishRegex.test(val), {
        message: t("validation.englishOnly"),
      }),

    isActive: z.boolean().default(true),
  });
};

export type DepartmentFormSchema = z.infer<
  ReturnType<typeof createDepartmentFormSchema>
>;
