// Form exports
export { DepartmentForm } from "./Form";
export type { DepartmentFormData, UseDepartmentFormReturn } from "./Form";

// Table exports
export { DepartmentManagement } from "./Table";

// Hooks exports
export {
  useDepartments,
  useDepartmentById,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
  useToggleDepartmentStatus,
  useActiveDepartments,
} from "./hooks/useDepartments";

// Types exports
export type {
  DepartmentDto,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentFilters,
} from "./types/department.types";
