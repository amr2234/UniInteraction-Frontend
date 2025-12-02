import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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

interface MainCategoryDto {
  id: number;
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isActive: boolean;
}

export function MainCategoryManagement() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [categories, setCategories] = useState<MainCategoryDto[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<MainCategoryDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MainCategoryDto | null>(null);

  // Mock data
  const mockCategories: MainCategoryDto[] = [
    {
      id: 1,
      nameAr: "الشؤون الأكاديمية",
      nameEn: "Academic Affairs",
      descriptionAr: "جميع الخدمات المتعلقة بالشؤون الأكاديمية والدراسية",
      descriptionEn: "All services related to academic affairs and studies",
      isActive: true,
    },
    {
      id: 2,
      nameAr: "شؤون الطلاب",
      nameEn: "Student Affairs",
      descriptionAr: "الخدمات المتعلقة بشؤون الطلاب والأنشطة الطلابية",
      descriptionEn: "Services related to student affairs and activities",
      isActive: true,
    },
    {
      id: 3,
      nameAr: "الموارد البشرية",
      nameEn: "Human Resources",
      descriptionAr: "خدمات الموظفين والموارد البشرية",
      descriptionEn: "Employee and HR services",
      isActive: false,
    },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchTerm]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/main-categories');
      // const data = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 500));
      setCategories(mockCategories);
    } catch (error) {
      toast.error(t("categories.loadError"));
    } finally {
      setIsLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = [...categories];

    if (searchTerm) {
      filtered = filtered.filter(
        (cat) =>
          cat.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.descriptionAr?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  };

  const handleToggleActive = async (category: MainCategoryDto) => {
    try {
      // TODO: PATCH /api/main-categories/{id}
      await new Promise((resolve) => setTimeout(resolve, 300));

      setCategories(
        categories.map((c) =>
          c.id === category.id ? { ...c, isActive: !c.isActive } : c
        )
      );

      toast.success(
        `${!category.isActive ? t("users.active") : t("users.inactive")} "${category.nameAr}"`
      );
    } catch (error) {
      toast.error(t("messages.updateError"));
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      // TODO: DELETE /api/main-categories/{id}
      await new Promise((resolve) => setTimeout(resolve, 500));

      setCategories(categories.filter((c) => c.id !== selectedCategory.id));

      toast.success(`${t("categories.deleteSuccess")} "${selectedCategory.nameAr}"`, {
        duration: 4000,
      });
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
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
            <h1 className="text-[#2B2B2B] mb-2">{t("categories.mainCategories")}</h1>
            <p className="text-[#6F6F6F]">{t("categories.manageCategoriesDesc")}</p>
          </div>
          <Button
            onClick={() => navigate("/admin/main-categories/new")}
            className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 gap-2 rounded-xl"
          >
            <Plus className="w-5 h-5" />
            {t("categories.addNewMainCategory")}
          </Button>
        </div>

        {/* Search */}
        <Card className="p-6 mb-6 rounded-xl border-0 shadow-soft bg-white">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
            <Input
              placeholder={t("categories.searchCategories")}
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
                    {t("form.nameAr")}
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    {t("form.nameEn")}
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    {t("form.descriptionAr")}
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
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      {t("common.noData")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-gray-50">
                      <TableCell className="text-right">
                        <p className="font-medium text-[#2B2B2B]">
                          {category.nameAr}
                        </p>
                      </TableCell>
                      <TableCell className="text-right" dir="ltr">
                        {category.nameEn || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <p className="text-sm text-gray-600 max-w-md truncate">
                          {category.descriptionAr || "-"}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={category.isActive}
                            onCheckedChange={() => handleToggleActive(category)}
                          />
                          <Badge
                            variant={category.isActive ? "default" : "secondary"}
                            className={
                              category.isActive ? "bg-green-500" : "bg-gray-400"
                            }
                          >
                            {category.isActive ? t("users.active") : t("users.inactive")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/main-categories/edit/${category.id}`)
                            }
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCategory(category);
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
              {t("categories.deleteConfirm")} "{selectedCategory?.nameAr}"؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
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
