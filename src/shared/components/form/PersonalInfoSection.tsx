import React from "react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export const PersonalInfoSection: React.FC = () => {
  return (
    <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
      <h3 className="text-[#6CAEBD] mb-6">المعلومات الشخصية</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="fullNameAr" className="text-[#2B2B2B]">
            الاسم الكامل (عربي) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullNameAr"
            required
            placeholder="أدخل الاسم الكامل بالعربية"
            className="mt-2 rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="fullNameEn" className="text-[#2B2B2B]">
            الاسم الكامل (إنجليزي)
          </Label>
          <Input
            id="fullNameEn"
            placeholder="Enter Full Name in English"
            className="mt-2 rounded-xl"
            dir="ltr"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-[#2B2B2B]">
            البريد الإلكتروني <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="example@domain.com"
            className="mt-2 rounded-xl"
            dir="ltr"
          />
        </div>

        <div>
          <Label htmlFor="mobile" className="text-[#2B2B2B]">
            رقم الجوال <span className="text-red-500">*</span>
          </Label>
          <Input
            id="mobile"
            type="tel"
            required
            placeholder="05xxxxxxxx"
            className="mt-2 rounded-xl"
            dir="ltr"
          />
        </div>
      </div>
    </Card>
  );
};
