import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
import { Search, Plus, Edit, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";

interface MainCategoryDto {
  id: number;
  nameAr: string;
  nameEn?: string;
}

interface SubCategoryDto {
  id: number;
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  mainCategoryId: number;
  mainCategoryName: string;
  isActive: boolean;
}

export function SubCategoryManagement() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [subCategories, setSubCategories] = useState<SubCategoryDto[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategoryDto[]>([]);
  const [mainCategories, setMainCategories] = useState<MainCategoryDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryDto | null>(null);

  // Mock data
  const mockMainCategories: MainCategoryDto[] = [
    { id: 1, nameAr: "الشؤون الأكاديمية", nameEn: "Academic Affairs" },
    { id: 2, nameAr: "شؤون الطلاب", nameEn: "Student Affairs" },
    { id: 3, nameAr: "الموارد البشرية", nameEn: "Human Resources" },
  ];

  const mockSubCategories: SubCategoryDto[] = [
    {
      id: 1,
      nameAr: "القبول والتسجيل",
      nameEn: "Admission & Registration",
      descriptionAr: "خدمات القبول والتسجيل للطلاب الجدد",
      mainCategoryId: 1,
      mainCategoryName: "الشؤون الأكاديمية",
      isActive: true,
    },
    {
      id: 2,
      nameAr: "الامتحانات",
      nameEn: "Examinations",
      descriptionAr: "خدمات الامتحانات والنتائج",
      mainCategoryId: 1,
      mainCategoryName: "الشؤون الأكاديمية",
      isActive: true,
    },
    {
      id: 3,
      nameAr: "الأنشطة الطلابية",
      nameEn: "Student Activities",
      descriptionAr: "الأنشطة والفعاليات الطلابية",
      mainCategoryId: 2,
      mainCategoryName: "شؤون الطلاب",
      isActive: true,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterSubCategories();
  }, [subCategories, searchTerm, selectedMainCategory]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMainCategories(mockMainCategories);
      setSubCategories(mockSubCategories);
    } catch (error) {
      toast.error(t("categories.loadError"));
    } finally {
      setIsLoading(false);
    }
  };

  const filterSubCategories = () => {
    let filtered = [...subCategories];

    if (selectedMainCategory && selectedMainCategory !== "all") {
      filtered = filtered.filter(
        (sub) => sub.mainCategoryId === parseInt(selectedMainCategory)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (sub) =>
          sub.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.nameEn?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSubCategories(filtered);
  };

  const handleToggleActive = async (subCategory: SubCategoryDto) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setSubCategories(
        subCategories.map((sub) =>
          sub.id === subCategory.id ? { ...sub, isActive: !sub.isActive } : sub
        )
      );

      toast.success(
        `${!subCategory.isActive ? t("users.active") : t("users.inactive")} "${subCategory.nameAr}"`
      );
    } catch (error) {
      toast.error(t("messages.updateError"));
    }
  };

  const handleDeleteSubCategory = async () => {
    if (!selectedSubCategory) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSubCategories(
        subCategories.filter((sub) => sub.id !== selectedSubCategory.id)
      );

      toast.success(`${t("categories.deleteSuccess")} "${selectedSubCategory.nameAr}"`, {
        duration: 4000,
      });
      setIsDeleteDialogOpen(false);
      setSelectedSubCategory(null);
    } catch (error) {
      toast.error(t("messages.deleteError"));
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#2B2B2B] mb-2">{t("categories.subCategories")}</h1>
          <p className="text-[#6F6F6F]">{t("categories.manageCategoriesDesc")}</p>
        </div>

        {/* Filters Row */}
        <Card className="p-6 mb-6 rounded-xl border-0 shadow-soft bg-white">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 max-w-sm">
              <Label className="text-[#2B2B2B] mb-2 block">
                {t("categories.parentCategory")}
              </Label>
              <Select
                value={selectedMainCategory}
                onValueChange={setSelectedMainCategory}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder={t("users.allStatuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("users.allStatuses")}</SelectItem>
                  {mainCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.nameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 max-w-sm">
              <Label className="text-[#2B2B2B] mb-2 block">{t("common.search")}</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
                <Input
                  placeholder={t("categories.searchCategories")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 rounded-xl"
                />
              </div>
            </div>

            <Button
              onClick={() => navigate("/admin/sub-categories/new")}
              className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 gap-2 rounded-xl"
            >
              <Plus className="w-5 h-5" />
              {t("categories.addNewSubCategory")}
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card className="rounded-xl border-0 shadow-soft bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-right font-semibold text-gray-700">
                    {t("form.nameAr")}
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    {t("form.nameEn")}
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    {t("categories.parentCategory")}
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
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      {t("common.loading")}
                    </TableCell>
                  </TableRow>
                ) : filteredSubCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      {t("common.noData")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubCategories.map((subCategory) => (
                    <TableRow key={subCategory.id} className="hover:bg-gray-50">
                      <TableCell className="text-right">
                        <p className="font-medium text-[#2B2B2B]">
                          {subCategory.nameAr}
                        </p>
                      </TableCell>
                      <TableCell className="text-right" dir="ltr">
                        {subCategory.nameEn || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-[#6CAEBD]/10 text-[#6CAEBD] hover:bg-[#6CAEBD]/20">
                          {subCategory.mainCategoryName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={subCategory.isActive}
                            onCheckedChange={() => handleToggleActive(subCategory)}
                          />
                          <Badge
                            variant={subCategory.isActive ? "default" : "secondary"}
                            className={
                              subCategory.isActive ? "bg-green-500" : "bg-gray-400"
                            }
                          >
                            {subCategory.isActive ? t("users.active") : t("users.inactive")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/sub-categories/edit/${subCategory.id}`)
                            }
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSubCategory(subCategory);
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
              {t("categories.deleteConfirm")} "{selectedSubCategory?.nameAr}"؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubCategory}
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
