import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Download,
  Filter,
  FileText,
  FileSpreadsheet,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useLogsPage } from "./LogsPage.logic";
import { LogLevel } from "./types/logs.types";

export function LogsPage() {
  const {
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
  } = useLogsPage();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2B2B2B]">{t("logs.title")}</h1>
        <p className="text-[#6F6F6F] mt-2">{t("logs.subtitle")}</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6F6F6F]">{t("logs.totalLogs")}</p>
              <p className="text-2xl font-bold text-[#2B2B2B]">{statistics.total}</p>
            </div>
            <Info className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6F6F6F]">{t("logs.levels.information")}</p>
              <p className="text-2xl font-bold text-green-600">{statistics.byLevel.information}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6F6F6F]">{t("logs.levels.warning")}</p>
              <p className="text-2xl font-bold text-yellow-600">{statistics.byLevel.warning}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6F6F6F]">{t("logs.levels.error")}</p>
              <p className="text-2xl font-bold text-red-600">
                {statistics.byLevel.error + statistics.byLevel.critical}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        {/* Filters Section */}
        <div className="space-y-4 mb-6">
          {/* Main Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <Label htmlFor="search">{t("common.search")}</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-4 h-4" />
                <Input
                  id="search"
                  placeholder={t("logs.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Log Level Filter */}
            <div>
              <Label htmlFor="level">{t("logs.logLevel")}</Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t("logs.allLevels")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("logs.allLevels")}</SelectItem>
                  {logLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {t(`logs.levels.${level.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <Label htmlFor="category">{t("logs.category")}</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t("logs.allCategories")} />
                </SelectTrigger>
                <SelectContent className="max-h-96">
                  <SelectItem value="all">{t("logs.allCategories")}</SelectItem>
                  {categoryGroups.map((group) => (
                    <SelectGroup key={group.label}>
                      <SelectLabel className="text-xs font-semibold text-[#875E9E]">
                        {group.label}
                      </SelectLabel>
                      {group.categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {getCategoryName(category)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromDate">{t("logs.fromDate")}</Label>
              <Input
                id="fromDate"
                type="datetime-local"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="toDate">{t("logs.toDate")}</Label>
              <Input
                id="toDate"
                type="datetime-local"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showAdvancedFilters ? t("logs.hideAdvancedFilters") : t("logs.showAdvancedFilters")}
          </Button>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="userId">{t("logs.userId")}</Label>
                <Input
                  id="userId"
                  type="number"
                  placeholder={t("logs.userIdPlaceholder")}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="entityType">{t("logs.entityType")}</Label>
                <Input
                  id="entityType"
                  placeholder={t("logs.entityTypePlaceholder")}
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="entityId">{t("logs.entityId")}</Label>
                <Input
                  id="entityId"
                  type="number"
                  placeholder={t("logs.entityIdPlaceholder")}
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* Filter Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={applyFilters}
              className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {t("logs.applyFilters")}
            </Button>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              {t("logs.clearFilters")}
            </Button>
            <Button
              onClick={fetchLogs}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {t("logs.refresh")}
            </Button>

            <div className="ml-auto flex gap-2">
              <Button
                onClick={() => handleExport("csv")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                CSV
              </Button>
              <Button
                onClick={() => handleExport("excel")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </Button>
              <Button
                onClick={() => handleExport("pdf")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="border rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-[#6F6F6F]">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>{t("logs.loading")}</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-[#6F6F6F]">
              <p>{t("logs.noLogsFound")}</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">{t("logs.timestamp")}</TableHead>
                    <TableHead className="w-[120px]">{t("logs.logLevel")}</TableHead>
                    <TableHead>{t("logs.category")}</TableHead>
                    <TableHead>{t("logs.message")}</TableHead>
                    <TableHead className="w-[200px]">{t("logs.username")}</TableHead>
                    <TableHead className="w-[150px]">{t("logs.requestPath")}</TableHead>
                    <TableHead className="w-[100px] text-center">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-xs">
                        {formatDate(log.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getLevelBadgeConfig(log.level).className}>
                          {getLevelBadgeConfig(log.level).label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {log.categoryName || getCategoryName(log.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-[#2B2B2B] line-clamp-2">
                          {language === "ar" && log.messageAr ? log.messageAr : log.message}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm text-[#6F6F6F]">
                        {log.username || "-"}
                      </TableCell>
                      <TableCell className="text-xs text-[#6F6F6F] font-mono">
                        {log.requestPath || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          onClick={() => handleViewDetails(log)}
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                <div className="text-sm text-[#6F6F6F]">
                  {t("logs.showing")} {(filters.pageNumber! - 1) * filters.pageSize! + 1} - {Math.min(filters.pageNumber! * filters.pageSize!, totalCount)} {t("logs.of")} {totalCount} {t("logs.logs")}
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={filters.pageSize?.toString()}
                    onValueChange={(value: string) => handlePageSizeChange(parseInt(value))}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="200">200</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => handlePageChange(filters.pageNumber! - 1)}
                      disabled={filters.pageNumber === 1}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm px-4">
                      {t("logs.page")} {filters.pageNumber}
                    </span>
                    <Button
                      onClick={() => handlePageChange(filters.pageNumber! + 1)}
                      disabled={logs.length < filters.pageSize!}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Log Details Dialog */}
      <AlertDialog open={isDetailsDialogOpen} onOpenChange={handleCloseDetails}>
        <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {/* Close button at the top right */}
          <button
            onClick={handleCloseDetails}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-[#2B2B2B]">{t("logs.logDetails")}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[#6F6F6F]">
              {selectedLog && formatDate(selectedLog.createdAt)}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              {/* Classification */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-[#6F6F6F]">{t("logs.logLevel")}</Label>
                  <div className="mt-1">
                    <Badge className={getLevelBadgeConfig(selectedLog.level).className}>
                      {getLevelBadgeConfig(selectedLog.level).label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-[#6F6F6F]">{t("logs.category")}</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedLog.categoryName || getCategoryName(selectedLog.category)}</Badge>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <Label className="text-xs text-[#6F6F6F]">{t("logs.message")}</Label>
                <p className="mt-1 text-sm text-[#2B2B2B] p-3 bg-gray-50 rounded">
                  {language === "ar" && selectedLog.messageAr ? selectedLog.messageAr : selectedLog.message}
                </p>
              </div>

              {/* Details */}
              {selectedLog.details && (
                <div>
                  <Label className="text-xs text-[#6F6F6F]">{t("logs.details")}</Label>
                  <pre className="mt-1 text-xs p-3 bg-gray-50 rounded overflow-x-auto">
                    {selectedLog.details}
                  </pre>
                </div>
              )}

              {/* Stack Trace */}
              {selectedLog.stackTrace && (
                <div>
                  <Label className="text-xs text-[#6F6F6F]">{t("logs.stackTrace")}</Label>
                  <pre className="mt-1 text-xs p-3 bg-red-50 rounded overflow-x-auto text-red-800 max-h-64">
                    {selectedLog.stackTrace}
                  </pre>
                </div>
              )}

              {/* Context */}
              <div className="grid grid-cols-2 gap-4">
                {selectedLog.username && (
                  <div>
                    <Label className="text-xs text-[#6F6F6F]">{t("logs.username")}</Label>
                    <p className="mt-1 text-sm">{selectedLog.username}</p>
                  </div>
                )}
                {selectedLog.ipAddress && (
                  <div>
                    <Label className="text-xs text-[#6F6F6F]">{t("logs.ipAddress")}</Label>
                    <p className="mt-1 text-sm font-mono">{selectedLog.ipAddress}</p>
                  </div>
                )}
                {selectedLog.requestPath && (
                  <div>
                    <Label className="text-xs text-[#6F6F6F]">{t("logs.requestPath")}</Label>
                    <p className="mt-1 text-sm font-mono">{selectedLog.requestPath}</p>
                  </div>
                )}
                {selectedLog.httpMethod && (
                  <div>
                    <Label className="text-xs text-[#6F6F6F]">{t("logs.httpMethod")}</Label>
                    <p className="mt-1 text-sm">
                      <Badge variant="outline">{selectedLog.httpMethod}</Badge>
                    </p>
                  </div>
                )}
              </div>

              {/* Entity */}
              {(selectedLog.entityType || selectedLog.action) && (
                <div className="grid grid-cols-3 gap-4">
                  {selectedLog.entityType && (
                    <div>
                      <Label className="text-xs text-[#6F6F6F]">{t("logs.entityType")}</Label>
                      <p className="mt-1 text-sm">{selectedLog.entityType}</p>
                    </div>
                  )}
                  {selectedLog.entityId && (
                    <div>
                      <Label className="text-xs text-[#6F6F6F]">{t("logs.entityId")}</Label>
                      <p className="mt-1 text-sm">{selectedLog.entityId}</p>
                    </div>
                  )}
                  {selectedLog.action && (
                    <div>
                      <Label className="text-xs text-[#6F6F6F]">{t("logs.action")}</Label>
                      <p className="mt-1 text-sm">{selectedLog.action}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-3 gap-4">
                {selectedLog.durationMs != null && (
                  <div>
                    <Label className="text-xs text-[#6F6F6F]">{t("logs.duration")}</Label>
                    <p className="mt-1 text-sm">{selectedLog.durationMs} ms</p>
                  </div>
                )}
                {selectedLog.source && (
                  <div>
                    <Label className="text-xs text-[#6F6F6F]">{t("logs.source")}</Label>
                    <p className="mt-1 text-sm">{selectedLog.source}</p>
                  </div>
                )}
                {selectedLog.correlationId && (
                  <div>
                    <Label className="text-xs text-[#6F6F6F]">{t("logs.correlationId")}</Label>
                    <p className="mt-1 text-sm font-mono text-xs">{selectedLog.correlationId}</p>
                  </div>
                )}
              </div>

              {/* User Agent */}
              {selectedLog.userAgent && (
                <div>
                  <Label className="text-xs text-[#6F6F6F]">{t("logs.userAgent")}</Label>
                  <p className="mt-1 text-xs text-[#6F6F6F] p-2 bg-gray-50 rounded">
                    {selectedLog.userAgent}
                  </p>
                </div>
              )}
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
