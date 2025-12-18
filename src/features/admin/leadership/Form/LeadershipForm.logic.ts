import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/i18n";
import { createLeadershipFormSchema } from "./LeadershipForm.schema";
import { LeadershipFormData, UseLeadershipFormReturn } from "./LeadershipForm.types";
import { toast } from "sonner";
import {
  useLeadershipById,
  useCreateLeadership,
  useUpdateLeadership,
} from "@/features/admin/leadership/hooks/useLeadership";
import { useDepartmentsLookup } from "@/features/lookups/hooks/useLookups";
import { usersApi } from "@/features/admin/users/api/users.api";
import { UserRole } from "@/core/constants/roles";
import type {
  CreateLeadershipPayload,
  UpdateLeadershipPayload,
  UserDto,
} from "@/core/types/api";

export const useLeadershipForm = (): UseLeadershipFormReturn => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { t } = useI18n();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<LeadershipFormData | null>(null);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  // API hooks
  const { data: leadershipData, isLoading: isFetchingLeadership } = useLeadershipById(
    parseInt(id || "0")
  );
  const createLeadershipMutation = useCreateLeadership();
  const updateLeadershipMutation = useUpdateLeadership();
  const { data: departments = [] } = useDepartmentsLookup();

  const isLoading = isFetchingLeadership || createLeadershipMutation.isPending || updateLeadershipMutation.isPending;

  const validationSchema = useMemo(() => createLeadershipFormSchema(t), [t]);

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState,
    setValue,
    watch,
    reset,
  } = useForm<LeadershipFormData>({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      nameAr: "",
      nameEn: "",
      positionTitleAr: "",
      positionTitleEn: "",
      departmentId: undefined,
      userId: undefined,
      isActive: true,
    },
  });

  const { isDirty } = formState;

  // Fetch users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await usersApi.getUsers({ 
          searchTerm: userSearchTerm,
          pageSize: 50,
          isActive: true 
        });
        // Filter users: 
        // 1. Exclude visitors (roleId === 4 or UserRole.USER)
        // 2. Show only those without leadership assignment or with current leadership
        const availableUsers = (response.items || []).filter(
          (user: any) => {
            // Exclude visitors
            const isNotVisitor = user.roleId !== UserRole.USER;
            // Check leadership assignment
            const hasNoLeadership = !user.leadershipId;
            const hasCurrentLeadership = isEditMode && user.leadershipId === parseInt(id || "0");
            
            return isNotVisitor && (hasNoLeadership || hasCurrentLeadership);
          }
        );
        setUsers(availableUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [userSearchTerm, isEditMode, id]);

  useEffect(() => {
    if (leadershipData && isEditMode) {
      reset({
        nameAr: leadershipData.nameAr,
        nameEn: leadershipData.nameEn || "",
        positionTitleAr: leadershipData.positionTitleAr,
        positionTitleEn: leadershipData.positionTitleEn || "",
        departmentId: leadershipData.departmentId,
        userId: leadershipData.userId,
        isActive: leadershipData.isActive,
      });
    }
  }, [leadershipData, isEditMode, reset]);

  const onSubmit = useCallback(async (data: LeadershipFormData) => {
    setCurrentFormData(data);
    setIsConfirmDialogOpen(true);
  }, []);

  const handleConfirmSubmit = useCallback(async () => {
    if (!currentFormData) return;

    setIsConfirmDialogOpen(false);

    try {
      if (isEditMode) {
        const payload: UpdateLeadershipPayload = {
          nameAr: currentFormData.nameAr,
          nameEn: currentFormData.nameEn || undefined,
          positionTitleAr: currentFormData.positionTitleAr,
          positionTitleEn: currentFormData.positionTitleEn || undefined,
          departmentId: currentFormData.departmentId,
          userId: currentFormData.userId,
          isActive: currentFormData.isActive,
        };
        await updateLeadershipMutation.mutateAsync({ id: parseInt(id!), payload });
        toast.success(t("leadership.updateSuccess"));
      } else {
        const payload: CreateLeadershipPayload = {
          nameAr: currentFormData.nameAr,
          nameEn: currentFormData.nameEn || undefined,
          positionTitleAr: currentFormData.positionTitleAr,
          positionTitleEn: currentFormData.positionTitleEn || undefined,
          departmentId: currentFormData.departmentId,
          userId: currentFormData.userId,
        };
        await createLeadershipMutation.mutateAsync(payload);
        toast.success(t("leadership.createSuccess"));
      }

      navigate("/admin/leadership");
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message || error?.message || "";
      const errorMessage = backendMessage || (isEditMode ? t("leadership.updateError") : t("leadership.createError"));
      toast.error(errorMessage);
    }
  }, [currentFormData, isEditMode, id, createLeadershipMutation, updateLeadershipMutation, navigate, t]);

  const handleCancel = useCallback(() => {
    navigate("/admin/leadership");
  }, [navigate]);

  return {
    control,
    handleSubmit: rhfHandleSubmit(onSubmit),
    formState,
    setValue,
    watch,
    reset,

    isEditMode,
    isLoading,
    isDirty,

    handleCancel,
    handleConfirmSubmit,

    isConfirmDialogOpen,
    setIsConfirmDialogOpen,

    currentFormData,

    // Departments for dropdown
    departments,

    // Users for dropdown
    users,
    isLoadingUsers,
    userSearchTerm,
    setUserSearchTerm,
  };
};
