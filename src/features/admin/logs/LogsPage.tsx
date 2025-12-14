import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
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
import { useI18n } from "@/i18n";
import { Search, Download, Trash2, Filter, FileText, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Log {
  id: number;
  timestamp: string;
  level: "info" | "warning" | "error" | "critical";
  category: string;
  user: string;
  action: string;
  message: string;
}

// Mock data
const mockLogs: Log[] = [
  {
    id: 1,
    timestamp: "2025-11-30 14:30:25",
    level: "info",
    category: "authentication",
    user: "admin@university.edu",
    action: "LOGIN",
    message: "User logged in successfully",
  },
  {
    id: 2,
    timestamp: "2025-11-30 14:28:15",
    level: "warning",
    category: "requests",
    user: "user@university.edu",
    action: "UPDATE_REQUEST",
    message: "Request status changed to pending",
  },
  {
    id: 3,
    timestamp: "2025-11-30 14:25:10",
    level: "error",
    category: "system",
    user: "system",
    action: "EMAIL_SEND_FAILED",
    message: "Failed to send notification email",
  },
  {
    id: 4,
    timestamp: "2025-11-30 14:20:05",
    level: "info",
    category: "users",
    user: "admin@university.edu",
    action: "CREATE_USER",
    message: "New user created: john.doe@university.edu",
  },
  {
    id: 5,
    timestamp: "2025-11-30 14:15:00",
    level: "critical",
    category: "system",
    user: "system",
    action: "DATABASE_ERROR",
    message: "Database connection timeout",
  },
];

export function LogsPage() {
  const { t } = useI18n();
  const [logs] = useState<Log[]>(mockLogs);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterLogs(term, selectedLevel, selectedCategory);
  };

  const handleLevelFilter = (level: string) => {
    setSelectedLevel(level);
    filterLogs(searchTerm, level, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterLogs(searchTerm, selectedLevel, category);
  };

  const filterLogs = (search: string, level: string, category: string) => {
    let filtered = logs;

    if (search) {
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(search.toLowerCase()) ||
          log.user.toLowerCase().includes(search.toLowerCase()) ||
          log.action.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (level !== "all") {
      filtered = filtered.filter((log) => log.level === level);
    }

    if (category !== "all") {
      filtered = filtered.filter((log) => log.category === category);
    }

    setFilteredLogs(filtered);
  };

  const handleExport = async (format: "csv" | "pdf" | "excel") => {
    setIsExporting(true);
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(t("logs.exportSuccess") + ` (${format.toUpperCase()})`);
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFilteredLogs([]);
      toast.success(t("logs.logsCleared"));
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const getLevelBadge = (level: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
      info: { variant: "default", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
      warning: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
      error: { variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-100" },
      critical: { variant: "destructive", className: "bg-red-600 text-white hover:bg-red-600" },
    };

    const config = variants[level] || variants.info;
    return (
      <Badge variant={config.variant} className={config.className}>
        {t(`logs.${level}`)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2B2B2B]">{t("logs.title")}</h1>
        <p className="text-[#6F6F6F] mt-2">{t("logs.subtitle")}</p>
      </div>

      <Card className="p-6">
        {/* Filters */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">{t("common.search")}</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-4 h-4" />
                <Input
                  id="search"
                  placeholder={t("logs.searchLogs")}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="level">{t("logs.logLevel")}</Label>
              <Select value={selectedLevel} onValueChange={handleLevelFilter}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t("logs.allLevels")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("logs.allLevels")}</SelectItem>
                  <SelectItem value="info">{t("logs.info")}</SelectItem>
                  <SelectItem value="warning">{t("logs.warning")}</SelectItem>
                  <SelectItem value="error">{t("logs.error")}</SelectItem>
                  <SelectItem value="critical">{t("logs.critical")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">{t("common.filter")}</Label>
              <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t("logs.categories.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("logs.categories.all")}</SelectItem>
                  <SelectItem value="authentication">{t("logs.categories.authentication")}</SelectItem>
                  <SelectItem value="requests">{t("logs.categories.requests")}</SelectItem>
                  <SelectItem value="users">{t("logs.categories.users")}</SelectItem>
                  <SelectItem value="system">{t("logs.categories.system")}</SelectItem>
                  <SelectItem value="settings">{t("logs.categories.settings")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleExport("csv")}
              disabled={isExporting}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {t("logs.exportAs")} CSV
            </Button>
            <Button
              onClick={() => handleExport("excel")}
              disabled={isExporting}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {t("logs.exportAs")} Excel
            </Button>
            <Button
              onClick={() => handleExport("pdf")}
              disabled={isExporting}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {t("logs.exportAs")} PDF
            </Button>

            <Button 
              variant="destructive" 
              size="sm" 
              className="flex items-center gap-2 ml-auto"
              onClick={() => setIsClearDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
              {t("logs.clearLogs")}
            </Button>

            <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("logs.clearLogs")}</AlertDialogTitle>
                  <AlertDialogDescription>{t("logs.clearConfirm")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsClearDialogOpen(false)}>
                    {t("common.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    handleClearLogs();
                    setIsClearDialogOpen(false);
                  }} className="bg-red-600 hover:bg-red-700">
                    {t("common.confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#2B2B2B]">{t("logs.totalLogs")}</span>
            <span className="text-2xl font-bold text-[#875E9E]">{filteredLogs.length}</span>
          </div>
        </div>

        {/* Logs Table */}
        <div className="border rounded-lg overflow-hidden">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-[#6F6F6F]">
              <p>{t("logs.noLogsFound")}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("logs.timestamp")}</TableHead>
                  <TableHead>{t("logs.logLevel")}</TableHead>
                  <TableHead>{t("common.filter")}</TableHead>
                  <TableHead>{t("logs.user")}</TableHead>
                  <TableHead>{t("logs.action")}</TableHead>
                  <TableHead>{t("logs.message")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                    <TableCell>{getLevelBadge(log.level)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{t(`logs.categories.${log.category}`)}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{log.user}</TableCell>
                    <TableCell className="font-medium text-sm">{log.action}</TableCell>
                    <TableCell className="text-sm text-[#6F6F6F]">{log.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
