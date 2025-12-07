import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/i18n";
import { UserRole } from "@/core/constants/roles";
import { createUserFormSchema } from "./UserForm.schema";
import {
  UserFormData,
  DepartmentItem,
  UseUserFormReturn,
} from "./UserForm.types";
import {
  useUserById,
  useCreateUser,
  useUpdateUser,
  UserDto,
} from "@/features/users";
import { useDepartmentsLookup } from "@/features/lookups/hooks/useLookups";
import { toast } from "sonner";

export const useUserForm = (): UseUserFormReturn => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { t, language } = useI18n();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<UserFormData | null>(
    null
  );

  const validationSchema = useMemo(() => createUserFormSchema(t), [t]);

  const {
    register,
    control,
    handleSubmit: rhfHandleSubmit,
    formState,
    setValue,
    watch,
    reset,
    trigger,
  } = useForm<UserFormData>({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      nameAr: "",
      nameEn: "",
      email: "",
      mobile: "",
      nationalId: "",
      studentId: "",
      departmentId: "",
      roleId: UserRole.USER,
      isActive: true,
    },
  });

  const { errors, isDirty, isSubmitting } = formState;

  const watchedRole = watch("roleId");

  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useDepartmentsLookup();
  const departments: DepartmentItem[] = useMemo(
    () =>
      Array.isArray(departmentsData)
        ? departmentsData.map((dept) => ({
            id: dept.id,
            name: language === "ar" ? dept.nameAr : dept.nameEn || dept.nameAr,
          }))
        : [],
    [departmentsData, language]
  );

  const { data: userData, isLoading: isFetchingUser } = useUserById(
    parseInt(id || "0")
  );

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isLoading = isFetchingUser || isLoadingDepartments;

  useEffect(() => {
    if (userData && isEditMode) {
      
      reset({
        nameAr: userData.nameAr,
        nameEn: userData.nameEn || "",
        email: userData.email,
        mobile: userData.mobile || "",
        nationalId: userData.nationalId || "",
        studentId: userData.studentId || "",
        departmentId: userData.departmentId 
          ? String(userData.departmentId) 
          : "",
        roleId: userData.roleId,
        isActive: userData.isActive,
      });
    }
  }, [userData, isEditMode, reset]);

  useEffect(() => {
    
    
    if (!isDirty && isEditMode) {
      return;
    }
    
    if (watchedRole === UserRole.ADMIN) {
      setValue("studentId", "", { shouldValidate: false });
      setValue("departmentId", "", { shouldValidate: false });
    } else if (watchedRole === UserRole.EMPLOYEE) {
      setValue("studentId", "", { shouldValidate: false });
    } else if (watchedRole === UserRole.USER) {
      setValue("departmentId", "", { shouldValidate: false });
    }

    
    if (isDirty) {
      setTimeout(() => {
        trigger(["departmentId", "studentId"]);
      }, 0);
    }
  }, [watchedRole, setValue, trigger, isDirty, isEditMode]);

  const onSubmit = useCallback(async (data: UserFormData) => {
    setCurrentFormData(data);
    setIsConfirmDialogOpen(true);
  }, []);

  const handleConfirmSubmit = useCallback(async () => {
    if (!currentFormData) return;

    setIsConfirmDialogOpen(false);

    try {
      const payload: UserDto = {
        nameAr: currentFormData.nameAr,
        nameEn: currentFormData.nameEn || undefined,
        email: currentFormData.email,
        mobile: currentFormData.mobile || undefined,
        nationalId: currentFormData.nationalId || undefined,
        studentId: currentFormData.studentId || undefined,
        departmentId: currentFormData.departmentId || undefined,
        roleId: currentFormData.roleId,
        isActive: currentFormData.isActive ?? true,
      };

      if (isEditMode) {
        await updateUserMutation.mutateAsync({ id: parseInt(id!), payload });
        toast.success(t("users.updateSuccess"));
      } else {
        await createUserMutation.mutateAsync(payload);
        toast.success(t("users.createSuccess"));
      }

      navigate("/admin/users");
    } catch (error: any) {
      // Check for specific backend error messages
      const backendMessage = error?.response?.data?.message || error?.message || '';
      
      let errorMessage;
      // Check if error message contains "email already exists" (case-insensitive)
      if (backendMessage.toLowerCase().includes('email') && 
          (backendMessage.toLowerCase().includes('already exists') || 
           backendMessage.toLowerCase().includes('already in use') ||
           backendMessage.toLowerCase().includes('مستخدم'))) {
        errorMessage = t('validation.emailAlreadyExists');
      } else if (backendMessage) {
        // For other backend messages, show them directly
        errorMessage = backendMessage;
      } else {
        // Fallback to generic error message
        errorMessage = isEditMode ? t('users.updateError') : t('users.createError');
      }
      
      toast.error(errorMessage);
    }
  }, [
    currentFormData,
    isEditMode,
    id,
    createUserMutation,
    updateUserMutation,
    navigate,
    t,
  ]);

  const handleCancel = useCallback(() => {
    navigate("/admin/users");
  }, [navigate]);

  return {
    register,
    control,
    handleSubmit: rhfHandleSubmit(onSubmit),
    formState,
    setValue,
    watch,
    reset,

    isEditMode,
    isLoading,
    isSubmitting,
    isDirty,
    departments,

    onSubmit,
    handleCancel,
    handleConfirmSubmit,

    isConfirmDialogOpen,
    setIsConfirmDialogOpen,

    currentFormData,
  };
};
