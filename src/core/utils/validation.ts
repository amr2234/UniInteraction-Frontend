// ============================================
// Generic Validation Utility Functions
// ============================================

export type ValidationError = string | undefined;
export type ValidationErrors<T> = Partial<Record<keyof T, ValidationError>>;

export interface ValidationRule<T> {
  field: keyof T;
  value: any;
  condition: (value: any, formData?: T) => boolean;
  message: string;
}

/**
 * Generic validation function that can be used across forms
 * @param rules - Array of validation rules to apply
 * @returns ValidationErrors object with field names as keys and error messages as values
 */
export const validateForm = <T>(
  rules: ValidationRule<T>[]
): ValidationErrors<T> => {
  const errors: ValidationErrors<T> = {};

  rules.forEach(rule => {
    if (!rule.condition(rule.value, undefined)) {
      errors[rule.field] = rule.message;
    }
  });

  return errors;
};

/**
 * Create a validation rule
 */
export const createRule = <T>(
  field: keyof T,
  value: any,
  condition: (value: any, formData?: T) => boolean,
  message: string
): ValidationRule<T> => ({
  field,
  value,
  condition,
  message
});

/**
 * Combine multiple validation errors
 */
export const combineErrors = <T>(
  ...errorObjects: ValidationErrors<T>[]
): ValidationErrors<T> => {
  return errorObjects.reduce((acc, curr) => ({ ...acc, ...curr }), {});
};

// ============================================
// Live Validation Functions
// ============================================

/**
 * Validate a single field with specific rules
 * @param field - The field to validate
 * @param value - The value to validate
 * @param rules - Array of validation rules to apply
 * @returns ValidationError - Error message or undefined if valid
 */
export const validateField = <T>(
  field: keyof T,
  value: any,
  rules: ValidationRule<T>[]
): ValidationError => {
  const fieldRules = rules.filter(rule => rule.field === field);
  
  for (const rule of fieldRules) {
    if (!rule.condition(value, undefined)) {
      return rule.message;
    }
  }
  
  return undefined;
};

/**
 * Get validation rules for a specific field
 * @param field - The field to get rules for
 * @param rules - All validation rules
 * @returns ValidationRule[] - Array of rules for the specified field
 */
export const getFieldRules = <T>(
  field: keyof T,
  rules: ValidationRule<T>[]
): ValidationRule<T>[] => {
  return rules.filter(rule => rule.field === field);
};

// ============================================
// Common Validation Functions
// ============================================

export const isRequired = (value: any): boolean => {
  return value !== null && value !== undefined && value !== '';
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
  const cleanedValue = value.replace(/[\s-]/g, '');
  return /^[0-9]{10}$/.test(cleanedValue);
};

export const isNationalId = (value: string): boolean => {
  const cleanedValue = value.replace(/[\s-]/g, '');
  return cleanedValue.length === 10 && /^[0-9]+$/.test(cleanedValue);
};

export const isEqualTo = (value1: any, value2: any): boolean => {
  return value1 === value2;
};

export const matchesPattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};

// ============================================
// Predefined Validation Rules
// ============================================

export const requiredRule = <T>(field: keyof T, value: any, message: string) => 
  createRule(field, value, isRequired, message);

export const emailRule = <T>(field: keyof T, value: string, message: string) => 
  createRule(field, value, isEmail, message);

export const minLengthRule = <T>(field: keyof T, value: string, length: number, message: string) => 
  createRule(field, value, (val) => minLength(val, length), message);

export const phoneRule = <T>(field: keyof T, value: string, message: string) => 
  createRule(field, value, isPhone, message);

export const nationalIdRule = <T>(field: keyof T, value: string, message: string) => 
  createRule(field, value, isNationalId, message);

export const confirmPasswordRule = <T>(field: keyof T, password: string, confirmPassword: string, message: string) => 
  createRule(field, confirmPassword, () => isEqualTo(password, confirmPassword), message);

export const patternRule = <T>(field: keyof T, value: string, pattern: RegExp, message: string) => 
  createRule(field, value, (val) => matchesPattern(val, pattern), message);