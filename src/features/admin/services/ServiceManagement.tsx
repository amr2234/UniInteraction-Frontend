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
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface MainCategoryDto {
  id: number;
  nameAr: string;
}

interface SubCategoryDto {
  id: number;
  nameAr: string;
  mainCategoryId: number;
}

interface ServiceDto {
  id: number;
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  subCategoryId: number;
  subCategoryName: string;
  isActive: boolean;
}

export function ServiceManagement() {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceDto[]>([]);
  const [mainCategories, setMainCategories] = useState<MainCategoryDto[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryDto[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategoryDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDto | null>(null);

  const mockMainCategories: MainCategoryDto[] = [
    { id: 1, nameAr: "الشؤون الأكاديمية" },
    { id: 2, nameAr: "شؤون الطلاب" },
  ];

  const mockSubCategories: SubCategoryDto[] = [
    { id: 1, nameAr: "القبول والتسجيل", mainCategoryId: 1 },
    { id: 2, nameAr: "الامتحانات", mainCategoryId: 1 },
    { id: 3, nameAr: "الأنشطة الطلابية", mainCategoryId: 2 },
  ];

  const mockServices: ServiceDto[] = [
    {
      id: 1,
      nameAr: "طلب إفادة تخرج",
      nameEn: "Graduation Certificate Request",
      descriptionAr: "طلب إصدار إفادة تخرج رسمية",
      subCategoryId: 1,
      subCategoryName: "القبول والتسجيل",
      isActive: true,
    },
    {
      id: 2,
      nameAr: "طلب كشف درجات",
      nameEn: "Transcript Request",
      descriptionAr: "طلب كشف درجات معتمد",
      subCategoryId: 2,
      subCategoryName: "الامتحانات",
      isActive: true,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedMainCategory && selectedMainCategory !== "all") {
      const filtered = subCategories.filter(
        (sub) => sub.mainCategoryId === parseInt(selectedMainCategory)
      );
      setFilteredSubCategories(filtered);
      setSelectedSubCategory("all");
    } else {
      setFilteredSubCategories(subCategories);
    }
  }, [selectedMainCategory, subCategories]);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, selectedSubCategory]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMainCategories(mockMainCategories);
      setSubCategories(mockSubCategories);
      setFilteredSubCategories(mockSubCategories);
      setServices(mockServices);
    } catch (error) {
      toast.error("فشل تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    if (selectedSubCategory && selectedSubCategory !== "all") {
      filtered = filtered.filter(
        (service) => service.subCategoryId === parseInt(selectedSubCategory)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.nameEn?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const handleToggleActive = async (service: ServiceDto) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setServices(
        services.map((s) =>
          s.id === service.id ? { ...s, isActive: !s.isActive } : s
        )
      );
      toast.success(
        `تم ${!service.isActive ? "تفعيل" : "إلغاء تفعيل"} "${service.nameAr}" بنجاح`
      );
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث الحالة");
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setServices(services.filter((s) => s.id !== selectedService.id));
      toast.success(`تم حذف "${selectedService.nameAr}" بنجاح`);
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-[#2B2B2B] mb-2">الخدمات</h1>
          <p className="text-[#6F6F6F]">إدارة خدمات الجامعة</p>
        </div>

        <Card className="p-6 mb-6 rounded-xl border-0 shadow-soft bg-white">
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <Label className="text-[#2B2B2B] mb-2 block">التصنيف الرئيسي</Label>
              <Select value={selectedMainCategory} onValueChange={setSelectedMainCategory}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="جميع التصنيفات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التصنيفات</SelectItem>
                  {mainCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.nameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[#2B2B2B] mb-2 block">التصنيف الفرعي</Label>
              <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="جميع التصنيفات الفرعية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التصنيفات الفرعية</SelectItem>
                  {filteredSubCategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id.toString()}>
                      {sub.nameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-[#2B2B2B] mb-2 block">بحث</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
                  <Input
                    placeholder="ابحث في الخدمات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 rounded-xl"
                  />
                </div>
              </div>
              <Button
                onClick={() => navigate("/admin/services/new")}
                className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 gap-2 rounded-xl mt-7"
              >
                <Plus className="w-5 h-5" />
                إضافة خدمة
              </Button>
            </div>
          </div>
        </Card>

        <Card className="rounded-xl border-0 shadow-soft bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-right font-semibold text-gray-700">
                    اسم الخدمة بالعربية
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    اسم الخدمة بالإنجليزية
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    التصنيف الفرعي
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    الحالة
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700">
                    الإجراءات
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      جاري التحميل...
                    </TableCell>
                  </TableRow>
                ) : filteredServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      لا توجد نتائج
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices.map((service) => (
                    <TableRow key={service.id} className="hover:bg-gray-50">
                      <TableCell className="text-right">
                        <p className="font-medium text-[#2B2B2B]">{service.nameAr}</p>
                      </TableCell>
                      <TableCell className="text-right" dir="ltr">
                        {service.nameEn || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-[#875E9E]/10 text-[#875E9E] hover:bg-[#875E9E]/20">
                          {service.subCategoryName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={service.isActive}
                            onCheckedChange={() => handleToggleActive(service)}
                          />
                          <Badge
                            variant={service.isActive ? "default" : "secondary"}
                            className={service.isActive ? "bg-green-500" : "bg-gray-400"}
                          >
                            {service.isActive ? "نشط" : "غير نشط"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/services/edit/${service.id}`)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedService(service);
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف "{selectedService?.nameAr}"؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
