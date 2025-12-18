import { useState, useEffect, useCallback, useMemo } from "react";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { logsApi } from "./api/logs.api";
import { SystemLogDto, LogFilters, LogLevel, LogCategory } from "./types/logs.types";

export const useLogsPage = () => {
  const { t, language } = useI18n();

  // State
  const [logs, setLogs] = useState<SystemLogDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedLog, setSelectedLog] = useState<SystemLogDto | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<LogFilters>({
    pageNumber: 1,
    pageSize: 20,
  });

  // Individual filter states for UI
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [entityType, setEntityType] = useState<string>("");
  const [entityId, setEntityId] = useState<string>("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fetch logs from API
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await logsApi.getLogs(filters);
      
      if (result.success && result.data) {
        setLogs(result.data);
        setTotalCount(result.data.length);
        
        if (result.message) {
          // Optionally show success message with count
          // toast.info(result.message);
        }
      } else {
        toast.error(result.message || t("logs.fetchError"));
        setLogs([]);
        
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach(error => toast.error(error));
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch logs:", error);
      toast.error(error?.message || t("logs.fetchError"));
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, t]);

  // Fetch logs on mount and when filters change
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Apply filters
  const applyFilters = useCallback(() => {
    const newFilters: LogFilters = {
      pageNumber: 1, // Reset to first page when filters change
      pageSize: filters.pageSize,
    };

    if (searchTerm.trim()) {
      newFilters.searchTerm = searchTerm.trim();
    }

    if (selectedLevel !== "all") {
      newFilters.level = selectedLevel as LogLevel;
    }

    if (selectedCategory !== "all") {
      newFilters.category = selectedCategory as LogCategory;
    }

    if (fromDate) {
      newFilters.fromDate = new Date(fromDate).toISOString();
    }

    if (toDate) {
      // Set to end of day
      const endOfDay = new Date(toDate);
      endOfDay.setHours(23, 59, 59, 999);
      newFilters.toDate = endOfDay.toISOString();
    }

    if (userId) {
      const parsedUserId = parseInt(userId);
      if (!isNaN(parsedUserId)) {
        newFilters.userId = parsedUserId;
      }
    }

    if (entityType.trim()) {
      newFilters.entityType = entityType.trim();
    }

    if (entityId) {
      const parsedEntityId = parseInt(entityId);
      if (!isNaN(parsedEntityId)) {
        newFilters.entityId = parsedEntityId;
      }
    }

    setFilters(newFilters);
  }, [searchTerm, selectedLevel, selectedCategory, fromDate, toDate, userId, entityType, entityId, filters.pageSize]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedLevel("all");
    setSelectedCategory("all");
    setFromDate("");
    setToDate("");
    setUserId("");
    setEntityType("");
    setEntityId("");
    setFilters({
      pageNumber: 1,
      pageSize: 20,
    });
  }, []);

  // Pagination
  const handlePageChange = useCallback((newPage: number) => {
    setFilters(prev => ({
      ...prev,
      pageNumber: newPage,
    }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setFilters(prev => ({
      ...prev,
      pageNumber: 1,
      pageSize: newPageSize,
    }));
  }, []);

  // Export logs
  const handleExport = useCallback(async (format: "csv" | "excel" | "pdf") => {
    try {
      toast.info(t("logs.exportingLogs"));
      // Future implementation when backend supports export
      // const blob = await logsApi.exportLogs(filters, format);
      // Download the blob
      toast.success(t("logs.exportSuccess"));
    } catch (error: any) {
      console.error("Export failed:", error);
      toast.error(error?.message || t("logs.exportError"));
    }
  }, [filters, t]);

  // View log details
  const handleViewDetails = useCallback((log: SystemLogDto) => {
    setSelectedLog(log);
    setIsDetailsDialogOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsDialogOpen(false);
    setSelectedLog(null);
  }, []);

  // Get level badge configuration
  const getLevelBadgeConfig = useCallback((level: number | LogLevel) => {
    // Map numeric level to LogLevel enum
    const levelMap: { [key: number]: LogLevel } = {
      0: LogLevel.Trace,
      1: LogLevel.Debug,
      2: LogLevel.Information,
      3: LogLevel.Warning,
      4: LogLevel.Error,
      5: LogLevel.Critical,
      6: LogLevel.None,
    };
    
    const levelEnum = typeof level === 'number' ? levelMap[level] : level;
    
    const configs = {
      [LogLevel.Trace]: { className: "bg-gray-100 text-gray-800", label: t("logs.levels.trace") },
      [LogLevel.Debug]: { className: "bg-blue-100 text-blue-800", label: t("logs.levels.debug") },
      [LogLevel.Information]: { className: "bg-green-100 text-green-800", label: t("logs.levels.information") },
      [LogLevel.Warning]: { className: "bg-yellow-100 text-yellow-800", label: t("logs.levels.warning") },
      [LogLevel.Error]: { className: "bg-red-100 text-red-800", label: t("logs.levels.error") },
      [LogLevel.Critical]: { className: "bg-red-600 text-white", label: t("logs.levels.critical") },
      [LogLevel.None]: { className: "bg-gray-100 text-gray-800", label: t("logs.levels.none") },
    };
    return configs[levelEnum] || configs[LogLevel.Information];
  }, [t]);

  // Get category display name
  const getCategoryName = useCallback((category: number | LogCategory) => {
    // If it's already a string (enum), use it; otherwise use the categoryName from the log
    const categoryString = typeof category === 'string' ? category : '';
    return categoryString ? t(`logs.categories.${categoryString.toLowerCase()}`) : '';
  }, [t]);

  // Format date
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return language === "ar"
      ? date.toLocaleString("ar-SA")
      : date.toLocaleString("en-US");
  }, [language]);

  // Statistics
  const statistics = useMemo(() => {
    const total = logs.length;
    
    // Map numeric levels to count
    const byLevel = {
      trace: logs.filter(l => l.level === 0 || l.level === LogLevel.Trace).length,
      debug: logs.filter(l => l.level === 1 || l.level === LogLevel.Debug).length,
      information: logs.filter(l => l.level === 2 || l.level === LogLevel.Information).length,
      warning: logs.filter(l => l.level === 3 || l.level === LogLevel.Warning).length,
      error: logs.filter(l => l.level === 4 || l.level === LogLevel.Error).length,
      critical: logs.filter(l => l.level === 5 || l.level === LogLevel.Critical).length,
    };

    return {
      total,
      byLevel,
      hasErrors: byLevel.error + byLevel.critical > 0,
    };
  }, [logs]);

  // All available log levels for dropdown
  const logLevels = Object.values(LogLevel).filter(level => level !== LogLevel.None);

  // Grouped categories for dropdown
  const categoryGroups = useMemo(() => [
    {
      label: t("logs.categoryGroups.authentication"),
      categories: [
        LogCategory.Authentication,
        LogCategory.Authorization,
        LogCategory.Login,
        LogCategory.Logout,
        LogCategory.PasswordReset,
      ],
    },
    {
      label: t("logs.categoryGroups.userManagement"),
      categories: [
        LogCategory.UserCreated,
        LogCategory.UserUpdated,
        LogCategory.UserDeleted,
        LogCategory.UserActivated,
        LogCategory.UserDeactivated,
      ],
    },
    {
      label: t("logs.categoryGroups.requestManagement"),
      categories: [
        LogCategory.RequestCreated,
        LogCategory.RequestUpdated,
        LogCategory.RequestStatusChanged,
        LogCategory.RequestAssigned,
        LogCategory.RequestResolved,
        LogCategory.RequestClosed,
        LogCategory.RequestRated,
      ],
    },
    {
      label: t("logs.categoryGroups.fileOperations"),
      categories: [
        LogCategory.FileUploaded,
        LogCategory.FileDownloaded,
        LogCategory.FileDeleted,
      ],
    },
    {
      label: t("logs.categoryGroups.visitManagement"),
      categories: [
        LogCategory.VisitScheduled,
        LogCategory.VisitAccepted,
        LogCategory.VisitRescheduled,
      ],
    },
    {
      label: t("logs.categoryGroups.departmentLeadership"),
      categories: [
        LogCategory.DepartmentAssigned,
        LogCategory.LeadershipCreated,
        LogCategory.LeadershipUpdated,
        LogCategory.LeadershipDeleted,
        LogCategory.DepartmentUpdated,
        LogCategory.DepartmentDeleted,
      ],
    },
    {
      label: t("logs.categoryGroups.systemEvents"),
      categories: [
        LogCategory.SystemStartup,
        LogCategory.SystemShutdown,
        LogCategory.ConfigurationChanged,
        LogCategory.DatabaseMigration,
      ],
    },
    {
      label: t("logs.categoryGroups.security"),
      categories: [
        LogCategory.SecurityViolation,
        LogCategory.SuspiciousActivity,
        LogCategory.AccessDenied,
      ],
    },
    {
      label: t("logs.categoryGroups.errors"),
      categories: [
        LogCategory.ValidationError,
        LogCategory.BusinessLogicError,
        LogCategory.DatabaseError,
        LogCategory.UnhandledException,
      ],
    },
  ], [t]);

  return {
    // State
    logs,
    isLoading,
    totalCount,
    selectedLog,
    isDetailsDialogOpen,
    
    // Filters
    searchTerm,
    selectedLevel,
    selectedCategory,
    fromDate,
    toDate,
    userId,
    entityType,
    entityId,
    showAdvancedFilters,
    filters,
    
    // Setters
    setSearchTerm,
    setSelectedLevel,
    setSelectedCategory,
    setFromDate,
    setToDate,
    setUserId,
    setEntityType,
    setEntityId,
    setShowAdvancedFilters,
    
    // Actions
    applyFilters,
    clearFilters,
    handlePageChange,
    handlePageSizeChange,
    handleExport,
    handleViewDetails,
    handleCloseDetails,
    fetchLogs,
    
    // Helpers
    getLevelBadgeConfig,
    getCategoryName,
    formatDate,
    
    // Data
    statistics,
    logLevels,
    categoryGroups,
    
    // Internationalization
    t,
    language,
  };
};
