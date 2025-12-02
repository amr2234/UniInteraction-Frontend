import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@/core/utils/formUtils";
import {
  validateForm as validateFormUtil,
  validateField,
  requiredRule,
} from "@/core/utils/validation";
import {
  useDepartmentById,
  useCreateDepartment,
  useUpdateDepartment,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from "@/features/departments";
import { useI18n } from "@/i18n";

interface DepartmentFormData {
  id?: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  code: string;
  isActive: boolean;
}

export const useDepartmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { t } = useI18n();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const { formData, errors, setFormData, setErrors } = useForm<DepartmentFormData>({
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    code: "",
    isActive: true,
  });

  // API hooks
  const { data: departmentData, isLoading: isFetchingDepartment } = useDepartmentById(
    parseInt(id || "0")
  );
  const createDepartmentMutation = useCreateDepartment();
  const updateDepartmentMutation = useUpdateDepartment();

  const isLoading =
    isFetchingDepartment ||
    createDepartmentMutation.isPending ||
    updateDepartmentMutation.isPending;

  // Load department data in edit mode
  useEffect(() => {
    if (departmentData && isEditMode) {
      setFormData({
        id: departmentData.id,
        nameAr: departmentData.nameAr,
        nameEn: departmentData.nameEn || "",
        descriptionAr: departmentData.descriptionAr || "",
        descriptionEn: departmentData.descriptionEn || "",
        code: departmentData.code || "",
        isActive: departmentData.isActive,
      });
    }
  }, [departmentData, isEditMode]);

  const getValidationRules = () => {
    const rules = [
      requiredRule<DepartmentFormData>(
        "nameAr",
        formData.nameAr,
        t("validation.nameArRequired")
      ),
    ];

    return rules;
  };

  const handleInputChange = (
    field: keyof DepartmentFormData,
    value: string | boolean
  ) => {
    setFormData({ ...formData, [field]: value });

    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }

    if (
      typeof value === "string" &&
      field !== "nameEn" &&
      field !== "descriptionAr" &&
      field !== "descriptionEn" &&
      field !== "code"
    ) {
      const rules = getValidationRules();
      const fieldError = validateField(field, value, rules);

      if (fieldError) {
        setErrors((prev) => ({ ...prev, [field]: fieldError }));
      }
    }
  };

  const validateFormFields = (): boolean => {
    const rules = getValidationRules();
    const newErrors = validateFormUtil(rules);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFormFields()) {
      return;
    }

    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsConfirmDialogOpen(false);

    try {
      if (!isEditMode) {
        // Create new department
        const payload: CreateDepartmentDto = {
          nameAr: formData.nameAr,
          nameEn: formData.nameEn || undefined,
          descriptionAr: formData.descriptionAr || undefined,
          descriptionEn: formData.descriptionEn || undefined,
          code: formData.code || undefined,
        };
        await createDepartmentMutation.mutateAsync(payload);
      } else {
        // Update existing department
        const payload: UpdateDepartmentDto = {
          nameAr: formData.nameAr,
          nameEn: formData.nameEn || undefined,
          descriptionAr: formData.descriptionAr || undefined,
          descriptionEn: formData.descriptionEn || undefined,
          code: formData.code || undefined,
          isActive: formData.isActive,
        };
        await updateDepartmentMutation.mutateAsync({ id: parseInt(id!), payload });
      }

      navigate("/admin/departments");
    } catch (error) {
      // Error is handled by the hook with toast
    }
  };

  const handleCancel = () => {
    navigate("/admin/departments");
  };

  return {
    formData,
    errors,
    isLoading,
    isEditMode,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    handleInputChange,
    handleSubmit,
    handleConfirmSubmit,
    handleCancel,
  };
};
