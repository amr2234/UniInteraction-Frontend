import React from "react";
import { Card } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

interface CategorySectionProps {
  mainCategories: Array<{ value: string; label: string }>;
  subCategories: Array<{ value: string; label: string }>;
  services?: Array<{ value: string; label: string }>;
  requestCategoryLabel?: string;
  mainCategoryLabel?: string;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  mainCategories,
  subCategories,
  services,
  requestCategoryLabel = "تصنيف الطلب",
  mainCategoryLabel = "الفئة الرئيسية",
}) => {
  const requestCategories = [
    { value: "academic", label: "الشؤون الأكاديمية" },
    { value: "administrative", label: "الشؤون الإدارية" },
    { value: "technical", label: "الدعم الفني" },
    { value: "financial", label: "الشؤون المالية" },
    { value: "student", label: "شؤون الطلاب" },
  ];

  return (
    <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
      <h3 className="text-[#6CAEBD] mb-6">التصنيف</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="requestCategory" className="text-[#2B2B2B]">
            {requestCategoryLabel}
          </Label>
          <Select>
            <SelectTrigger id="requestCategory" className="mt-2 rounded-xl">
              <SelectValue placeholder="اختر التصنيف" />
            </SelectTrigger>
            <SelectContent>
              {requestCategories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="mainCategory" className="text-[#2B2B2B]">
            {mainCategoryLabel}
          </Label>
          <Select>
            <SelectTrigger id="mainCategory" className="mt-2 rounded-xl">
              <SelectValue placeholder="اختر الفئة الرئيسية" />
            </SelectTrigger>
            <SelectContent>
              {mainCategories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="subCategory" className="text-[#2B2B2B]">
            الفئة الفرعية
          </Label>
          <Select>
            <SelectTrigger id="subCategory" className="mt-2 rounded-xl">
              <SelectValue placeholder="اختر الفئة الفرعية" />
            </SelectTrigger>
            <SelectContent>
              {subCategories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {services && (
          <div>
            <Label htmlFor="service" className="text-[#2B2B2B]">
              الخدمة
            </Label>
            <Select>
              <SelectTrigger id="service" className="mt-2 rounded-xl">
                <SelectValue placeholder="اختر الخدمة" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </Card>
  );
};
