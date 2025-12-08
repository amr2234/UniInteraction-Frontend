import { UseFormReturn } from "react-hook-form";

export interface LeadershipFormData {
  fullNameAr: string;
  fullNameEn?: string;
  positionTitleAr: string;
  positionTitleEn?: string;
  departmentId?: number;
  isActive?: boolean;
}

export interface UseLeadershipFormReturn {
  // React Hook Form methods
  control: UseFormReturn<LeadershipFormData>["control"];
  handleSubmit: ReturnType<UseFormReturn<LeadershipFormData>["handleSubmit"]>;
  formState: UseFormReturn<LeadershipFormData>["formState"];
  watch: UseFormReturn<LeadershipFormData>["watch"];
  setValue: UseFormReturn<LeadershipFormData>["setValue"];
  reset: UseFormReturn<LeadershipFormData>["reset"];

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
  currentFormData: LeadershipFormData | null;

  // Departments for dropdown
  departments: { id: number; nameAr: string; nameEn?: string }[];
}
