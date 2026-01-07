
export interface UserFormData {
  nameAr: string;
  nameEn?: string;
  email: string;
  mobile: string;
  nationalId: string;
  studentId?: string;
  departmentId?: string;
  roleId: number;
  isActive?: boolean;
}


export interface DepartmentItem {
  id: number;
  name: string;
}


export interface UseUserFormReturn {
  // React Hook Form properties
  register: any;
  control: any;
  handleSubmit: any;
  formState: any;
  setValue: any;
  watch: any;
  reset: any;
  
  // Form state
  isEditMode: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  
  // Data
  departments: DepartmentItem[];
  
  // Handlers
  onSubmit: (data: UserFormData) => Promise<void>;
  handleCancel: () => void;
  handleConfirmSubmit: () => void;
  
  // Dialog state
  isConfirmDialogOpen: boolean;
  setIsConfirmDialogOpen: (open: boolean) => void;
  
  // Current form data
  currentFormData: UserFormData | null;
}
