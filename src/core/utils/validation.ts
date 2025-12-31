export type ValidationError = string | undefined;
export type ValidationErrors<T> = Partial<Record<keyof T, ValidationError>>;

export interface ValidationRule<T> {
  field: keyof T;
  value: any;
  condition: (value: any, formData?: T) => boolean;
  message: string;
}

export const validateForm = <T>(
  rules: ValidationRule<T>[]
): ValidationErrors<T> => {
  const errors: ValidationErrors<T> = {};

  rules.forEach((rule) => {
    if (!rule.condition(rule.value, undefined)) {
      errors[rule.field] = rule.message;
    }
  });

  return errors;
};

export const createRule = <T>(
  field: keyof T,
  value: any,
  condition: (value: any, formData?: T) => boolean,
  message: string
): ValidationRule<T> => ({
  field,
  value,
  condition,
  message,
});

export const combineErrors = <T>(
  ...errorObjects: ValidationErrors<T>[]
): ValidationErrors<T> => {
  return errorObjects.reduce((acc, curr) => ({ ...acc, ...curr }), {});
};

export const validateField = <T>(
  field: keyof T,
  value: any,
  rules: ValidationRule<T>[]
): ValidationError => {
  const fieldRules = rules.filter((rule) => rule.field === field);

  for (const rule of fieldRules) {
    if (!rule.condition(value, undefined)) {
      return rule.message;
    }
  }

  return undefined;
};

export const getFieldRules = <T>(
  field: keyof T,
  rules: ValidationRule<T>[]
): ValidationRule<T>[] => {
  return rules.filter((rule) => rule.field === field);
};

export const isRequired = (value: any): boolean => {
  return value !== null && value !== undefined && value !== "";
};

export const isEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const minLength = (value: string, length: number): boolean => {
  return value.length >= length;
};

export const maxLength = (value: string, length: number): boolean => {
  return value.length <= length;
};

export const isPhone = (value: string): boolean => {
  const cleanedValue = value.replace(/[\s-]/g, "");
  return /^[0-9]{10}$/.test(cleanedValue);
};

export const isSaudiMobile = (value: string): boolean => {
  const cleanedValue = value.replace(/[\s-]/g, "");

  return /^05[0-9]{8}$/.test(cleanedValue);
};

export const isArabicOnly = (value: string): boolean => {
  if (!value || value.trim() === "") return true;

  return /^[\u0600-\u06FF\s]+$/.test(value);
};

export const isEnglishOnly = (value: string): boolean => {
  if (!value || value.trim() === "") return true;

  return /^[a-zA-Z\s]+$/.test(value);
};

export const isNationalId = (value: string): boolean => {
  const cleanedValue = value.replace(/[\s-]/g, "");
  return cleanedValue.length === 10 && /^[0-9]+$/.test(cleanedValue);
};

export const isEqualTo = (value1: any, value2: any): boolean => {
  return value1 === value2;
};

export const matchesPattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};

export const requiredRule = <T>(field: keyof T, value: any, message: string) =>
  createRule(field, value, isRequired, message);

export const emailRule = <T>(field: keyof T, value: string, message: string) =>
  createRule(field, value, isEmail, message);

export const minLengthRule = <T>(
  field: keyof T,
  value: string,
  length: number,
  message: string
) => createRule(field, value, (val) => minLength(val, length), message);

export const maxLengthRule = <T>(
  field: keyof T,
  value: string,
  length: number,
  message: string
) => createRule(field, value, (val) => maxLength(val, length), message);

export const phoneRule = <T>(field: keyof T, value: string, message: string) =>
  createRule(field, value, isPhone, message);

export const nationalIdRule = <T>(
  field: keyof T,
  value: string,
  message: string
) => createRule(field, value, isNationalId, message);

export const confirmPasswordRule = <T>(
  field: keyof T,
  password: string,
  confirmPassword: string,
  message: string
) =>
  createRule(
    field,
    confirmPassword,
    () => isEqualTo(password, confirmPassword),
    message
  );

export const patternRule = <T>(
  field: keyof T,
  value: string,
  pattern: RegExp,
  message: string
) => createRule(field, value, (val) => matchesPattern(val, pattern), message);

export const saudiMobileRule = <T>(
  field: keyof T,
  value: string,
  message: string
) => createRule(field, value, isSaudiMobile, message);

export const arabicOnlyRule = <T>(
  field: keyof T,
  value: string,
  message: string
) => createRule(field, value, isArabicOnly, message);

export const englishOnlyRule = <T>(
  field: keyof T,
  value: string,
  message: string
) => createRule(field, value, isEnglishOnly, message);

export const hasArabicRegex = /[\u0600-\u06FF]/;
export const noEnglishRegex = /^[^a-zA-Z]*$/;
export const noArabicRegex = /^[^\u0600-\u06FF]*$/;
