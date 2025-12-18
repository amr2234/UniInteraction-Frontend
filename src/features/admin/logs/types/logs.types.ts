// ============================================
// System Logs Types
// ============================================

/**
 * Log Levels Enum (matches backend)
 */
export enum LogLevel {
  Trace = "Trace",
  Debug = "Debug",
  Information = "Information",
  Warning = "Warning",
  Error = "Error",
  Critical = "Critical",
  None = "None",
}

/**
 * Log Categories Enum (matches backend)
 */
export enum LogCategory {
  // Authentication & Authorization
  Authentication = "Authentication",
  Authorization = "Authorization",
  Login = "Login",
  Logout = "Logout",
  PasswordReset = "PasswordReset",
  
  // User Management
  UserCreated = "UserCreated",
  UserUpdated = "UserUpdated",
  UserDeleted = "UserDeleted",
  UserActivated = "UserActivated",
  UserDeactivated = "UserDeactivated",
  
  // Request Management
  RequestCreated = "RequestCreated",
  RequestUpdated = "RequestUpdated",
  RequestStatusChanged = "RequestStatusChanged",
  RequestAssigned = "RequestAssigned",
  RequestResolved = "RequestResolved",
  RequestClosed = "RequestClosed",
  RequestRated = "RequestRated",
  
  // File Operations
  FileUploaded = "FileUploaded",
  FileDownloaded = "FileDownloaded",
  FileDeleted = "FileDeleted",
  
  // Visit Management
  VisitScheduled = "VisitScheduled",
  VisitAccepted = "VisitAccepted",
  VisitRescheduled = "VisitRescheduled",
  
  // Department & Leadership
  DepartmentAssigned = "DepartmentAssigned",
  LeadershipCreated = "LeadershipCreated",
  LeadershipUpdated = "LeadershipUpdated",
  LeadershipDeleted = "LeadershipDeleted",
  DepartmentUpdated = "DepartmentUpdated",
  DepartmentDeleted = "DepartmentDeleted",
  
  // System Events
  SystemStartup = "SystemStartup",
  SystemShutdown = "SystemShutdown",
  ConfigurationChanged = "ConfigurationChanged",
  DatabaseMigration = "DatabaseMigration",
  
  // API & Integration
  ApiCallSuccess = "ApiCallSuccess",
  ApiCallFailure = "ApiCallFailure",
  ExternalServiceError = "ExternalServiceError",
  
  // Performance
  SlowQuery = "SlowQuery",
  HighMemoryUsage = "HighMemoryUsage",
  
  // Security
  SecurityViolation = "SecurityViolation",
  SuspiciousActivity = "SuspiciousActivity",
  AccessDenied = "AccessDenied",
  
  // Errors
  ValidationError = "ValidationError",
  BusinessLogicError = "BusinessLogicError",
  DatabaseError = "DatabaseError",
  UnhandledException = "UnhandledException",
  
  // Notifications
  NotificationSent = "NotificationSent",
  NotificationFailed = "NotificationFailed",
  
  // General
  Other = "Other",
}

/**
 * System Log DTO (matches backend response)
 */
export interface SystemLogDto {
  id: number;

  // Classification
  level: number | LogLevel;  // Backend sends as number (0-6)
  levelName: string;
  category: number | LogCategory;  // Backend sends as number
  categoryName: string;

  // Content
  message: string;
  messageAr?: string;
  details?: string;
  stackTrace?: string;

  // Context
  userId?: number;
  username?: string;
  ipAddress?: string;
  userAgent?: string;
  requestPath?: string;
  httpMethod?: string;

  // Entity tracking
  entityType?: string;
  entityId?: number;
  action?: string;

  // Timing
  createdAt: string;
  durationMs?: number;

  // Extra
  source?: string;
  correlationId?: string;
}

/**
 * Log Filters (query parameters for API)
 */
export interface LogFilters {
  level?: LogLevel;
  category?: LogCategory;
  fromDate?: string;
  toDate?: string;
  userId?: number;
  entityType?: string;
  entityId?: number;
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}

/**
 * API Result wrapper (matches backend)
 */
export interface Result<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[];
}
