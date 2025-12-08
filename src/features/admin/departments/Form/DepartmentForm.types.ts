import { UseFormReturn, FieldErrors } from "react-hook-form";

export interface DepartmentFormData {
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isActive?: boolean;
}

export interface UseDepartmentFormReturn {
  // React Hook Form methods
  control: UseFormReturn<DepartmentFormData>["control"];
  handleSubmit: ReturnType<UseFormReturn<DepartmentFormData>["handleSubmit"]>;
  formState: UseFormReturn<DepartmentFormData>["formState"];
  watch: UseFormReturn<DepartmentFormData>["watch"];
  setValue: UseFormReturn<DepartmentFormData>["setValue"];
  reset: UseFormReturn<DepartmentFormData>["reset"];

  // Form state
  isEditMode: boolean;
  isLoading: boolean;
  isDirty: boolean;

  // Handlers
  handleCancel: () => void;
  handleConfirmSubmit: () => Promise<void>;

  // Dialog state
  isConfirmDialogOpen: boolean;
  setIsConfirmDialogOpen: (open: boolean) => void;

  // Current form data for confirmation
  currentFormData: DepartmentFormData | null;
}
