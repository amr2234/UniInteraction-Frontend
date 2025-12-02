import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@/core/utils/formUtils";
import { 
  validateForm as validateFormUtil, 
  validateField,
  requiredRule,
  emailRule
} from "@/core/utils/validation";
import {
  useUserById,
  useCreateUser,
  useUpdateUser,
  UserDto,
} from "@/features/users";
import { useDepartmentsLookup } from "@/features/lookups/hooks/useLookups";
import { useI18n } from "@/i18n";
import { UserRole } from "@/core/constants/roles";

const RoleLabels: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: "users.roles.superAdmin",
  [UserRole.ADMIN]: "users.roles.admin",
  [UserRole.EMPLOYEE]: "users.roles.employee",
  [UserRole.USER]: "users.roles.visitor",
};



export const useUserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { t, language } = useI18n();
  
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  // Fetch departments from lookup API
  const { data: departmentsData, isLoading: isLoadingDepartments } = useDepartmentsLookup();
  const departments = Array.isArray(departmentsData) 
    ? departmentsData.map(dept => ({
        id: dept.id,
        name: language === 'ar' ? dept.nameAr : (dept.nameEn || dept.nameAr),
      }))
    : [];
  
  const { formData, errors, setFormData, setErrors } = useForm<UserDto>({
    nameAr: "",
    nameEn: "",
    email: "",
    mobile: "",
    nationalId: "",
    studentId: "",
    departmentId: "",
    roleId: UserRole.USER,
    isActive: true
  });

  // API hooks
  const { data: userData, isLoading: isFetchingUser } = useUserById(
    parseInt(id || "0")
  );
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isLoading = isFetchingUser || createUserMutation.isPending || updateUserMutation.isPending || isLoadingDepartments;

  // Load user data in edit mode
  useEffect(() => {
    if (userData && isEditMode) {
      setFormData({
        id: userData.id,
        nameAr: userData.nameAr,
        nameEn: userData.nameEn || "",
        email: userData.email,
        mobile: userData.mobile || "",
        nationalId: userData.nationalId || "",
        studentId: userData.studentId || "",
        departmentId: userData.departmentId || "",
        roleId: userData.roleId as UserRole,
        isActive: userData.isActive,
      });
    }
  }, [userData, isEditMode]);

  const getValidationRules = () => {
    const rules = [
      requiredRule<UserDto>('nameAr', formData.nameAr, t("validation.nameArRequired")),
      requiredRule<UserDto>('email', formData.email, t("validation.emailRequired")),
      emailRule<UserDto>('email', formData.email, t("validation.invalidEmail")),
    ];
    
    return rules;
  };

  const handleInputChange = (field: keyof UserDto, value: string | number | boolean) => {
    setFormData({ ...formData, [field]: value });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
    
    if (typeof value === 'string' && field !== 'nameEn' && field !== 'mobile' && field !== 'nationalId' && field !== 'studentId' && field !== 'departmentId') {
      const rules = getValidationRules();
      const fieldError = validateField(field, value, rules);
      
      if (fieldError) {
        setErrors(prev => ({ ...prev, [field]: fieldError }));
      }
    }
  };

  const handleRoleChange = (value: string) => {
    const roleId = parseInt(value) as UserRole;
    setFormData({ ...formData, roleId });
    
    if (roleId === UserRole.USER) {
      setFormData(prev => ({
        ...prev,
        roleId,
        studentId: "",
        departmentId: "",
      }));
    }
    
    if (errors.roleId) {
      setErrors({ ...errors, roleId: undefined });
    }
  };

  const validateFormFields = (): boolean => {
    const rules = getValidationRules();
    const newErrors = validateFormUtil(rules);
    
    if (!formData.roleId) {
      newErrors.roleId = t("validation.roleRequired");
    }
    
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
        const payload: UserDto = {
          nameAr: formData.nameAr,
          nameEn: formData.nameEn || undefined,
          email: formData.email,
          mobile: formData.mobile || undefined,
          nationalId: formData.nationalId || undefined,
          studentId: formData.studentId || undefined,
          departmentId: formData.departmentId || undefined,
          roleId: formData.roleId,
          isActive: formData.isActive,
        };
        await createUserMutation.mutateAsync(payload);
      } else {
        const payload: UserDto = {
          nameAr: formData.nameAr,
          nameEn: formData.nameEn || undefined,
          email: formData.email,
          mobile: formData.mobile || undefined,
          nationalId: formData.nationalId || undefined,
          studentId: formData.studentId || undefined,
          departmentId: formData.departmentId || undefined,
          roleId: formData.roleId,
          isActive: formData.isActive,

        };
        await updateUserMutation.mutateAsync({ id: parseInt(id!), payload });
      }

      navigate("/admin/users");
    } catch (error) {
    }
  };

  const handleCancel = () => {
    navigate("/admin/users");
  };

  return {
    formData,
    errors,
    isLoading,
    isEditMode,
    isConfirmDialogOpen,
    departments,
    UserRole,
    RoleLabels,
    setIsConfirmDialogOpen,
    handleInputChange,
    handleRoleChange,
    handleSubmit,
    handleConfirmSubmit,
    handleCancel
  };
};
