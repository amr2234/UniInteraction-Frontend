import { z } from "zod";
import { UserRole } from "@/core/constants/roles";

const arabicRegex = /^[\u0600-\u06FF\s]+$/;
const englishRegex = /^[a-zA-Z\s]+$/;
const ksaMobileRegex = /^05\d{8}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createUserFormSchema = (t: (key: string) => string) => {
  return z
    .object({
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

      email: z
        .string()
        .min(1, t("validation.emailRequired"))
        .regex(emailRegex, t("validation.invalidEmail")),

      mobile: z
        .string()
        .min(1, t("validation.mobileRequired"))
        .regex(ksaMobileRegex, t("validation.invalidMobile")),

      nationalId: z
        .string()
        .min(1, t("validation.nationalIdRequired"))
        .length(10, t("validation.nationalIdLength"))
        .regex(/^[0-9]+$/, t("validation.nationalIdNumeric")),

      studentId: z.string().optional(),

      departmentId: z.string().optional(),

      roleId: z.number().min(1, t("validation.roleRequired")),

      isActive: z.boolean().optional().default(true),
    })
    .superRefine((data, ctx) => {
      if (data.roleId === UserRole.EMPLOYEE) {
        if (!data.departmentId || data.departmentId.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.departmentRequired"),
            path: ["departmentId"],
          });
        }
      }

      if (
        (data.roleId === UserRole.ADMIN || data.roleId === UserRole.EMPLOYEE) &&
        data.studentId &&
        data.studentId.trim() !== ""
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.studentIdNotAllowed"),
          path: ["studentId"],
        });
      }

      if (
        (data.roleId === UserRole.ADMIN || data.roleId === UserRole.USER) &&
        data.departmentId &&
        data.departmentId.trim() !== ""
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.departmentNotAllowed"),
          path: ["departmentId"],
        });
      }
    });
};

export type UserFormSchema = z.infer<ReturnType<typeof createUserFormSchema>>;
