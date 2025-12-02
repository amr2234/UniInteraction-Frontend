import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";

interface UniversityLeadershipDto {
  id: number;
  nameAr: string;
  nameEn?: string;
  positionAr: string;
  positionEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export function LeadershipManagement() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [leadership, setLeadership] = useState<UniversityLeadershipDto[]>([]);
  const [filteredLeadership, setFilteredLeadership] = useState<UniversityLeadershipDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<UniversityLeadershipDto | null>(null);

  // Mock data
  const mockLeadership: UniversityLeadershipDto[] = [
    {
      id: 1,
      nameAr: "د. عبدالله محمد الغامدي",
      nameEn: "Dr. Abdullah Mohammed Al-Ghamdi",
      positionAr: "رئيس الجامعة",
      positionEn: "University President",
      descriptionAr: "يتمتع بخبرة واسعة في التعليم العالي وإدارة الجامعات",
      descriptionEn: "Has extensive experience in higher education and university management",
      email: "president@sru.edu.sa",
      phone: "+966 11 1234567",
      imageUrl: "https://via.placeholder.com/150",
      displayOrder: 1,
      isActive: true,
    },
    {
      id: 2,
      nameAr: "د. فاطمة أحمد العمري",
      nameEn: "Dr. Fatimah Ahmed Al-Omari",
      positionAr: "وكيلة الجامعة للشؤون الأكاديمية",
      positionEn: "Vice President for Academic Affairs",
      descriptionAr: "حاصلة على درجة الدكتوراه في الإدارة التربوية",
      descriptionEn: "Holds a PhD in Educational Administration",
      email: "vp.academic@sru.edu.sa",
      phone: "+966 11 1234568",
      imageUrl: "https://via.placeholder.com/150",
      displayOrder: 2,
      isActive: true,
    },
    {
      id: 3,
      nameAr: "د. خالد سعيد الحربي",
      nameEn: "Dr. Khaled Saeed Al-Harbi",
      positionAr: "عميد شؤون الطلاب",
      positionEn: "Dean of Student Affairs",
      descriptionAr: "خبرة 15 عاماً في خدمة الطلاب والأنشطة الطلابية",
      descriptionEn: "15 years of experience in student services and activities",
      email: "dean.students@sru.edu.sa",
      phone: "+966 11 1234569",
      imageUrl: "https://via.placeholder.com/150",
      displayOrder: 3,
      isActive: false,
    },
  ];

  useEffect(() => {
    fetchLeadership();
  }, []);

  useEffect(() => {
    filterLeadership();
  }, [leadership, searchTerm]);

  const fetchLeadership = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/leadership');
      // const data = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 500));
      setLeadership(mockLeadership);
    } catch (error) {
      toast.error(t("leadership.loadError"));
    } finally {
      setIsLoading(false);
    }
  };

  const filterLeadership = () => {
    let filtered = [...leadership];

    if (searchTerm) {
      filtered = filtered.filter(
        (leader) =>
          leader.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leader.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leader.positionAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leader.positionEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leader.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => a.displayOrder - b.displayOrder);
    setFilteredLeadership(filtered);
  };

  const handleDeleteLeader = async () => {
    if (!selectedLeader) return;

    try {
      // TODO: DELETE /api/leadership/{id}
      await new Promise((resolve) => setTimeout(resolve, 500));

      setLeadership(leadership.filter((l) => l.id !== selectedLeader.id));

      toast.success(`${t("leadership.deleteSuccess")} "${selectedLeader.nameAr}"`, {
        duration: 4000,
      });
      setIsDeleteDialogOpen(false);
      setSelectedLeader(null);
    } catch (error) {
      toast.error(t("messages.deleteError"));
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[#2B2B2B] mb-2">{t("leadership.manageLeadership")}</h1>
            <p className="text-[#6F6F6F]">{t("leadership.manageLeadershipDesc")}</p>
          </div>
          <Button
            onClick={() => navigate("/admin/leadership/new")}
            className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 gap-2 rounded-xl"
          >
            <Plus className="w-5 h-5" />
            {t("leadership.addNewLeader")}
          </Button>
        </div>

        {/* Search */}
        <Card className="p-6 mb-6 rounded-xl border-0 shadow-soft bg-white">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
            <Input
              placeholder={t("leadership.searchLeadership")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 rounded-xl"
            />
          </div>
        </Card>

        {/* Table */}
        <Card className="rounded-xl border-0 shadow-soft bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-right font-semibold text-gray-700">
                    {t("users.displayOrder")}
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    {t("leadership.leaderName")}
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    {t("leadership.leaderPosition")}
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    {t("form.email")}
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    {t("leadership.contactInfo")}
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    {t("form.status")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700">
                    {t("users.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      {t("common.loading")}
                    </TableCell>
                  </TableRow>
                ) : filteredLeadership.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      {t("common.noData")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeadership.map((leader) => (
                    <TableRow key={leader.id} className="hover:bg-gray-50">
                      <TableCell className="text-right">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#6CAEBD]/10 text-[#6CAEBD] font-semibold">
                          {leader.displayOrder}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <p className="font-medium text-[#2B2B2B]">
                            {leader.nameAr}
                          </p>
                          {leader.nameEn && (
                            <p className="text-xs text-gray-500" dir="ltr">
                              {leader.nameEn}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <p className="text-[#2B2B2B]">{leader.positionAr}</p>
                          {leader.positionEn && (
                            <p className="text-xs text-gray-500" dir="ltr">
                              {leader.positionEn}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" dir="ltr">
                        {leader.email || "-"}
                      </TableCell>
                      <TableCell className="text-right" dir="ltr">
                        {leader.phone || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={leader.isActive ? "default" : "secondary"}
                          className={
                            leader.isActive ? "bg-green-500" : "bg-gray-400"
                          }
                        >
                          {leader.isActive ? t("users.active") : t("users.inactive")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/leadership/edit/${leader.id}`)
                            }
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLeader(leader);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("messages.confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("leadership.deleteConfirm")} "{selectedLeader?.nameAr}" {t("leadership.deleteConfirm")}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLeader}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
