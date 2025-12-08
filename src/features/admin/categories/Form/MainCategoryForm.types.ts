import { UseFormReturn } from "react-hook-form";

export interface MainCategoryFormData {
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface UseMainCategoryFormReturn {
  // React Hook Form methods
  control: UseFormReturn<MainCategoryFormData>["control"];
  handleSubmit: ReturnType<UseFormReturn<MainCategoryFormData>["handleSubmit"]>;
  formState: UseFormReturn<MainCategoryFormData>["formState"];
  watch: UseFormReturn<MainCategoryFormData>["watch"];
  setValue: UseFormReturn<MainCategoryFormData>["setValue"];
  reset: UseFormReturn<MainCategoryFormData>["reset"];

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
  currentFormData: MainCategoryFormData | null;
}
