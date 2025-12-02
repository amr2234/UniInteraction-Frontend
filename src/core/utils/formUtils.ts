import { useState } from 'react';

export interface FormState<T> {
  formData: T;
  errors: Partial<Record<keyof T, string>>;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof T, string>>>>;
}

export const useForm = <T>(initialState: T): FormState<T> => {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  
  return {
    formData,
    errors,
    setFormData,
    setErrors
  };
};