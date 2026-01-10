import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/i18n";
import { createLeadershipFormSchema } from "./LeadershipForm.schema";
import {
  LeadershipFormData,
  UseLeadershipFormReturn,
} from "./LeadershipForm.types";
import { toast } from "sonner";
import {
  useLeadershipById,
  useCreateLeadership,
  useUpdateLeadership,
} from "@/features/admin/leadership/hooks/useLeadership";
import {
  usersApi,
  UserManagementDto,
} from "@/features/admin/users/api/users.api";
import { UserRole } from "@/core/constants/roles";
import type {
  CreateLeadershipPayload,
  UpdateLeadershipPayload,
} from "@/core/types/api";

export const useLeadershipForm = (): UseLeadershipFormReturn => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { t } = useI18n();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentFormData, setCurrentFormData] =
    useState<LeadershipFormData | null>(null);
  const [users, setUsers] = useState<UserManagementDto[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  const { data: leadershipData, isLoading: isFetchingLeadership } =
    useLeadershipById(parseInt(id || "0"));
  const createLeadershipMutation = useCreateLeadership();
  const updateLeadershipMutation = useUpdateLeadership();

  const isLoading =
    isFetchingLeadership ||
    createLeadershipMutation.isPending ||
    updateLeadershipMutation.isPending;

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
      userId: undefined,
      isActive: true,
    },
  });

  const { isDirty } = formState;

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await usersApi.getUsers({
          searchTerm: userSearchTerm,
          isActive: true,
          enablePagination: false, // Get all users, not paginated
        });

        const availableUsers = (response.items || []).filter((user: any) => {
          return (
            user.roleId === UserRole.ADMIN || user.roleId === UserRole.EMPLOYEE
          );
        });
        setUsers(availableUsers);
      } catch (error) {
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
          userId: currentFormData.userId || undefined,
          isActive: currentFormData.isActive,
        };
        await updateLeadershipMutation.mutateAsync({
          id: parseInt(id!),
          payload,
        });
        toast.success(t("leadership.updateSuccess"));
      } else {
        const payload: CreateLeadershipPayload = {
          nameAr: currentFormData.nameAr,
          nameEn: currentFormData.nameEn || undefined,
          positionTitleAr: currentFormData.positionTitleAr,
          positionTitleEn: currentFormData.positionTitleEn || undefined,
          userId: currentFormData.userId || undefined,
        };
        await createLeadershipMutation.mutateAsync(payload);
        toast.success(t("leadership.createSuccess"));
      }

      navigate("/admin/leadership");
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.message || error?.message || "";
      const errorMessage =
        backendMessage ||
        (isEditMode
          ? t("leadership.updateError")
          : t("leadership.createError"));
      toast.error(errorMessage);
    }
  }, [
    currentFormData,
    isEditMode,
    id,
    createLeadershipMutation,
    updateLeadershipMutation,
    navigate,
    t,
  ]);

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

    users,
    isLoadingUsers,
    userSearchTerm,
    setUserSearchTerm,
  };
};
